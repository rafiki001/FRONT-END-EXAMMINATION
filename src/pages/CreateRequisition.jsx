import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  Alert,
  Divider,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SaveIcon from '@mui/icons-material/SaveOutlined';
import SendIcon from '@mui/icons-material/SendOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBackOutlined';

import { useData } from '../context/DataContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

function emptyItemLine(idx) {
  return {
    lineId: `new-${Date.now()}-${idx}`,
    itemId: '',
    itemName: '',
    category: '',
    unit: '',
    availableQuantityAtRequest: 0,
    requestedQuantity: 1,
    issuedQuantity: 0,
    justification: '',
    remarks: ''
  };
}

export default function CreateRequisition() {
  const { requisitionId } = useParams();
  const isEdit = !!requisitionId;
  const navigate = useNavigate();
  const {
    requisitions,
    departments,
    requesters,
    inventoryItems,
    dispatch,
    notify,
    generateNextRequisitionNumber
  } = useData();
  const { currentUser } = useAuth();

  const existing = useMemo(
    () => (isEdit ? requisitions.find((r) => r.id === requisitionId) : null),
    [isEdit, requisitionId, requisitions]
  );

  const [form, setForm] = useState({
    department: currentUser?.department || '',
    requesterId: currentUser?.id || '',
    requestDate: new Date().toISOString().slice(0, 10),
    requiredDate: '',
    priority: 'Medium',
    purpose: '',
    remarks: ''
  });
  const [items, setItems] = useState([emptyItemLine(0)]);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (existing) {
      setForm({
        department: existing.department,
        requesterId: existing.requesterId,
        requestDate: existing.requestDate,
        requiredDate: existing.requiredDate,
        priority: existing.priority,
        purpose: existing.purpose,
        remarks: existing.remarks || ''
      });
      setItems(existing.items.map((it) => ({ ...it })));
    }
  }, [existing]);

  if (currentUser?.role !== 'Requester') {
    return <Alert severity="warning">Only users with the Requester role can create or edit requisitions.</Alert>;
  }
  if (isEdit && !existing) {
    return <Alert severity="error">Requisition not found.</Alert>;
  }
  if (isEdit && existing.status !== 'Draft') {
    return <Alert severity="warning">Only Draft requisitions can be edited.</Alert>;
  }

  const updateForm = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const updateItem = (lineId, field, value) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.lineId !== lineId) return it;
        if (field === 'itemId') {
          const inv = inventoryItems.find((i) => i.id === value);
          return {
            ...it,
            itemId: value,
            itemName: inv?.name || '',
            category: inv?.category || '',
            unit: inv?.unit || '',
            availableQuantityAtRequest: inv?.availableQuantity || 0
          };
        }
        return { ...it, [field]: value };
      })
    );
  };

  const addItem = () => setItems((prev) => [...prev, emptyItemLine(prev.length)]);
  const removeItem = (lineId) => setItems((prev) => prev.filter((it) => it.lineId !== lineId));

  const validate = () => {
    const newErrors = {};
    if (!form.department) newErrors.department = 'Department is required';
    if (!form.requesterId) newErrors.requesterId = 'Requester is required';
    if (!form.requestDate) newErrors.requestDate = 'Request date is required';
    if (!form.requiredDate) newErrors.requiredDate = 'Required date is required';
    if (!form.purpose.trim()) newErrors.purpose = 'Purpose is required';

    if (items.length === 0) {
      setFormError('A requisition must contain at least one item.');
      return false;
    }

    const seenItemIds = new Set();
    let duplicateFound = false;
    for (const it of items) {
      if (!it.itemId) {
        setFormError('Please select an inventory item for every line.');
        return false;
      }
      if (seenItemIds.has(it.itemId)) duplicateFound = true;
      seenItemIds.add(it.itemId);

      if (!it.requestedQuantity || Number(it.requestedQuantity) <= 0) {
        setFormError(`Requested quantity for "${it.itemName}" must be greater than zero.`);
        return false;
      }
      if (Number(it.requestedQuantity) > it.availableQuantityAtRequest) {
        setFormError(
          `Requested quantity for "${it.itemName}" (${it.requestedQuantity}) exceeds available stock (${it.availableQuantityAtRequest}).`
        );
        return false;
      }
      if (!it.justification.trim()) {
        setFormError(`Please provide a justification for "${it.itemName}".`);
        return false;
      }
    }
    if (duplicateFound) {
      setFormError('The same item was added more than once. Please combine quantities into a single line.');
      return false;
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setFormError('Please complete all required fields.');
      return false;
    }
    setFormError('');
    return true;
  };

  const buildRequisition = (status) => {
    const requesterName = existing ? existing.requesterName : currentUser?.name || 'Unknown Requester';
    const base = existing || {
      id: generateNextRequisitionNumber(),
      timeline: [{ status: 'Draft', date: form.requestDate }],
      approval: null,
      rejection: null,
      issue: null,
      createdAt: new Date().toISOString()
    };
    return {
      ...base,
      department: form.department,
      requesterId: form.requesterId,
      requesterName,
      requestDate: form.requestDate,
      requiredDate: form.requiredDate,
      priority: form.priority,
      purpose: form.purpose,
      remarks: form.remarks,
      status: existing ? existing.status : status,
      items: items.map((it) => ({ ...it, requestedQuantity: Number(it.requestedQuantity) }))
    };
  };

  const handleSaveDraft = () => {
    if (!validate()) return;
    const requisition = buildRequisition('Draft');
    dispatch({ type: isEdit ? 'UPDATE_REQUISITION' : 'CREATE_REQUISITION', payload: requisition });
    notify(`Requisition ${requisition.id} saved as Draft.`);
    navigate(`/requisitions/${requisition.id}`);
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const requisition = { ...buildRequisition('Submitted'), status: 'Submitted' };
    dispatch({ type: isEdit ? 'UPDATE_REQUISITION' : 'CREATE_REQUISITION', payload: requisition });
    if (isEdit) dispatch({ type: 'SUBMIT_REQUISITION', payload: requisition.id });
    notify(`Requisition ${requisition.id} submitted for approval.`);
    navigate(`/requisitions/${requisition.id}`);
  };

  const totalQty = items.reduce((s, it) => s + (Number(it.requestedQuantity) || 0), 0);

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} className="fade-in-up" mb={2}>
        <IconButton onClick={() => navigate('/requisitions')}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h5">{isEdit ? `Edit Requisition ${requisitionId}` : 'Create Requisition'}</Typography>
          <Typography variant="body2" color="text.secondary">
            Fill in the requisition details and add one or more items to request.
          </Typography>
        </Box>
      </Box>

      {formError && (
        <Alert severity="error" className="scale-in" sx={{ mb: 2 }} onClose={() => setFormError('')}>
          {formError}
        </Alert>
      )}

      <Paper className="fade-in-up hover-lift" sx={{ p: 3, mb: 2.5 }}>
        <Typography variant="subtitle1" gutterBottom>
          Basic Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Department"
              value={form.department}
              InputProps={{ readOnly: true }}
              helperText="Auto-filled from your account"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Requester"
              value={existing ? existing.requesterName : currentUser?.name || ''}
              InputProps={{ readOnly: true }}
              helperText="You are automatically the requester"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Request Date"
              InputLabelProps={{ shrink: true }}
              value={form.requestDate}
              error={!!errors.requestDate}
              helperText={errors.requestDate}
              onChange={(e) => updateForm('requestDate', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Required Date"
              InputLabelProps={{ shrink: true }}
              value={form.requiredDate}
              error={!!errors.requiredDate}
              helperText={errors.requiredDate}
              onChange={(e) => updateForm('requiredDate', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Priority"
              value={form.priority}
              onChange={(e) => updateForm('priority', e.target.value)}
            >
              {PRIORITIES.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={9}>
            <TextField
              fullWidth
              label="Purpose"
              value={form.purpose}
              error={!!errors.purpose}
              helperText={errors.purpose}
              onChange={(e) => updateForm('purpose', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Remarks (optional)"
              multiline
              minRows={2}
              value={form.remarks}
              onChange={(e) => updateForm('remarks', e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper className="fade-in-up hover-lift stagger-2" sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle1">Requested Items</Typography>
          <Chip label={`Total quantity: ${totalQty}`} color="primary" variant="outlined" />
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width="20%">Inventory Item</TableCell>
              <TableCell width="10%">Category</TableCell>
              <TableCell width="9%">Available</TableCell>
              <TableCell width="9%">Qty</TableCell>
              <TableCell width="7%">Unit</TableCell>
              <TableCell width="25%">Justification</TableCell>
              <TableCell width="15%">Remarks</TableCell>
              <TableCell width="5%" />
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((it, idx) => (
              <TableRow key={it.lineId} className="float-in" style={{ animationDelay: `${idx * 0.05}s` }} hover>
                <TableCell>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    value={it.itemId}
                    onChange={(e) => updateItem(it.lineId, 'itemId', e.target.value)}
                  >
                    {inventoryItems.map((inv) => (
                      <MenuItem key={inv.id} value={inv.id}>
                        {inv.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell>{it.category || '—'}</TableCell>
                <TableCell>{it.availableQuantityAtRequest}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <IconButton
                      size="small"
                      onClick={() =>
                        updateItem(it.lineId, 'requestedQuantity', Math.max(1, Number(it.requestedQuantity) - 1))
                      }
                    >
                      −
                    </IconButton>
                    <TextField
                      type="number"
                      size="small"
                      value={it.requestedQuantity}
                      onChange={(e) => updateItem(it.lineId, 'requestedQuantity', e.target.value)}
                      inputProps={{ min: 1, style: { width: 45, textAlign: 'center' } }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => updateItem(it.lineId, 'requestedQuantity', Number(it.requestedQuantity) + 1)}
                    >
                      +
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>{it.unit || '—'}</TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    value={it.justification}
                    onChange={(e) => updateItem(it.lineId, 'justification', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    value={it.remarks}
                    onChange={(e) => updateItem(it.lineId, 'remarks', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Remove item">
                    <span>
                      <IconButton
                        size="small"
                        color="error"
                        disabled={items.length === 1}
                        onClick={() => removeItem(it.lineId)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button startIcon={<AddIcon />} onClick={addItem} sx={{ mt: 2 }}>
          Add Item
        </Button>
      </Paper>

      <Box display="flex" justifyContent="flex-end" gap={1.5} mt={3} className="fade-in-up stagger-3">
        <Button variant="outlined" onClick={() => navigate('/requisitions')}>
          Cancel
        </Button>
        <Button variant="outlined" startIcon={<SaveIcon />} onClick={handleSaveDraft}>
          Save as Draft
        </Button>
        <Button variant="contained" startIcon={<SendIcon />} onClick={handleSubmit}>
          Submit Requisition
        </Button>
      </Box>
    </Box>
  );
}
