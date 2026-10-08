import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { generateInitialData } from '../data/mockData.js';
import { loadJSON, saveJSON, KEYS } from '../utils/storage.js';
import { nextRequisitionNumber } from '../utils/calculations.js';

const DataContext = createContext(null);

function loadInitialState() {
  const alreadyInitialized = loadJSON(KEYS.initialized, false);
  if (alreadyInitialized) {
    return {
      departments: loadJSON(KEYS.departments, []),
      requesters: loadJSON(KEYS.requesters, []),
      inventoryItems: loadJSON(KEYS.inventoryItems, []),
      requisitions: loadJSON(KEYS.requisitions, []),
      snackbar: null
    };
  }
  const seeded = generateInitialData();
  saveJSON(KEYS.departments, seeded.departments);
  saveJSON(KEYS.requesters, seeded.requesters);
  saveJSON(KEYS.inventoryItems, seeded.inventoryItems);
  saveJSON(KEYS.requisitions, seeded.requisitions);
  saveJSON(KEYS.initialized, true);
  return { ...seeded, snackbar: null };
}

function reducer(state, action) {
  switch (action.type) {
    case 'NOTIFY':
      return { ...state, snackbar: action.payload };

    case 'CLEAR_NOTIFY':
      return { ...state, snackbar: null };

    case 'CREATE_REQUISITION': {
      const requisitions = [action.payload, ...state.requisitions];
      return { ...state, requisitions };
    }

    case 'UPDATE_REQUISITION': {
      const requisitions = state.requisitions.map((r) =>
        r.id === action.payload.id ? action.payload : r
      );
      return { ...state, requisitions };
    }

    case 'DELETE_REQUISITION': {
      const requisitions = state.requisitions.filter((r) => r.id !== action.payload);
      return { ...state, requisitions };
    }

    case 'SUBMIT_REQUISITION': {
      const requisitions = state.requisitions.map((r) => {
        if (r.id !== action.payload) return r;
        return {
          ...r,
          status: 'Submitted',
          timeline: [...r.timeline, { status: 'Submitted', date: today() }]
        };
      });
      return { ...state, requisitions };
    }

    case 'APPROVE_REQUISITION': {
      const { id, approvedBy, comment } = action.payload;
      const requisitions = state.requisitions.map((r) => {
        if (r.id !== id) return r;
        return {
          ...r,
          status: 'Approved',
          approval: { date: today(), approvedBy, comment },
          timeline: [...r.timeline, { status: 'Approved', date: today() }]
        };
      });
      return { ...state, requisitions };
    }

    case 'REJECT_REQUISITION': {
      const { id, rejectedBy, reason } = action.payload;
      const requisitions = state.requisitions.map((r) => {
        if (r.id !== id) return r;
        return {
          ...r,
          status: 'Rejected',
          rejection: { date: today(), rejectedBy, reason },
          timeline: [...r.timeline, { status: 'Rejected', date: today() }]
        };
      });
      return { ...state, requisitions };
    }

    case 'REVISE_REQUISITION': {
      const requisitions = state.requisitions.map((r) => {
        if (r.id !== action.payload) return r;
        return {
          ...r,
          status: 'Draft',
          rejection: null,
          timeline: [...r.timeline, { status: 'Draft (revised)', date: today() }]
        };
      });
      return { ...state, requisitions };
    }

    case 'ISSUE_REQUISITION': {
      const { id, issuedBy, remarks, itemIssues } = action.payload;
      let requisitions = state.requisitions.map((r) => {
        if (r.id !== id) return r;
        const items = r.items.map((it) => ({
          ...it,
          issuedQuantity: itemIssues[it.lineId] ?? it.issuedQuantity
        }));
        return {
          ...r,
          items,
          status: 'Issued',
          issue: { date: today(), issuedBy, remarks },
          timeline: [...r.timeline, { status: 'Issued', date: today() }]
        };
      });
      const issuedReq = requisitions.find((r) => r.id === id);
      const inventoryItems = state.inventoryItems.map((invItem) => {
        const line = issuedReq.items.find((it) => it.itemId === invItem.id);
        if (!line) return invItem;
        const newQty = Math.max(0, invItem.availableQuantity - line.issuedQuantity);
        let status = 'In Stock';
        if (newQty === 0) status = 'Out of Stock';
        else if (newQty <= invItem.reorderLevel) status = 'Low Stock';
        return { ...invItem, availableQuantity: newQty, status };
      });
      return { ...state, requisitions, inventoryItems };
    }

    default:
      return state;
  }
}

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState);

  useEffect(() => {
    saveJSON(KEYS.departments, state.departments);
  }, [state.departments]);
  useEffect(() => {
    saveJSON(KEYS.requesters, state.requesters);
  }, [state.requesters]);
  useEffect(() => {
    saveJSON(KEYS.inventoryItems, state.inventoryItems);
  }, [state.inventoryItems]);
  useEffect(() => {
    saveJSON(KEYS.requisitions, state.requisitions);
  }, [state.requisitions]);
  const notify = useCallback((message, severity = 'success') => {
    dispatch({ type: 'NOTIFY', payload: { message, severity, key: Date.now() } });
  }, []);

  const value = {
    ...state,
    dispatch,
    notify,
    generateNextRequisitionNumber: () => nextRequisitionNumber(state.requisitions)
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}
