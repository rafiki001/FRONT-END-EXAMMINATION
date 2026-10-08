import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  getUsers,
  saveUsers,
  getSessionUserId,
  setSessionUserId,
  clearSession,
  findUserByEmail,
  nextEmployeeId
} from '../utils/auth.js';
import { DEPARTMENTS } from '../data/mockData.js';

const AuthContext = createContext(null);

function seedDemoAccounts() {
  return [
    {
      id: 'USR-0001',
      employeeId: 'EMP-1001',
      name: 'Diane Uwase',
      email: 'requester@irms.demo',
      password: 'password123',
      department: 'Finance',
      position: 'Officer',
      role: 'Requester',
      createdAt: new Date().toISOString()
    },
    {
      id: 'USR-0002',
      employeeId: 'EMP-1002',
      name: 'Alice Uwimana',
      email: 'approver@irms.demo',
      password: 'password123',
      department: 'Operations',
      position: 'Manager',
      role: 'Approver',
      createdAt: new Date().toISOString()
    },
    {
      id: 'USR-0003',
      employeeId: 'EMP-1003',
      name: 'Peter Mugisha',
      email: 'issuer@irms.demo',
      password: 'password123',
      department: 'Operations',
      position: 'Store Officer',
      role: 'Issuer',
      createdAt: new Date().toISOString()
    }
  ];
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const existing = getUsers();
    if (existing.length > 0) return existing;
    const seeded = seedDemoAccounts();
    saveUsers(seeded);
    return seeded;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const id = getSessionUserId();
    if (!id) return null;
    const list = getUsers();
    return list.find((u) => u.id === id) || null;
  });

  const [authError, setAuthError] = useState('');

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  const login = useCallback(
    (email, password) => {
      setAuthError('');
      const user = findUserByEmail(users, email);
      if (!user || user.password !== password) {
        setAuthError('Invalid email or password.');
        return false;
      }
      setCurrentUser(user);
      setSessionUserId(user.id);
      return true;
    },
    [users]
  );

  const signup = useCallback(
    ({ name, email, password, department, position, role }) => {
      setAuthError('');
      if (findUserByEmail(users, email)) {
        setAuthError('An account with this email already exists.');
        return false;
      }
      const newUser = {
        id: `USR-${String(users.length + 1).padStart(4, '0')}`,
        employeeId: nextEmployeeId(users),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        department,
        position,
        role,
        createdAt: new Date().toISOString()
      };
      const updated = [...users, newUser];
      setUsers(updated);
      saveUsers(updated);
      setCurrentUser(newUser);
      setSessionUserId(newUser.id);
      return true;
    },
    [users]
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    clearSession();
  }, []);

  const value = {
    currentUser,
    users,
    authError,
    setAuthError,
    login,
    signup,
    logout,
    departments: DEPARTMENTS
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
