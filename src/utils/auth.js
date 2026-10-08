import { loadJSON, saveJSON } from './storage.js';

const USERS_KEY = 'irms.users';
const SESSION_KEY = 'irms.session';

// NOTE: This is a FRONTEND-ONLY SIMULATION. There is no server, so
// passwords are stored in plain text in the browser's localStorage.
// This is fine for a classroom / demo project, but must never be used
// as a pattern for a real, production authentication system.

export function getUsers() {
  return loadJSON(USERS_KEY, []);
}

export function saveUsers(users) {
  saveJSON(USERS_KEY, users);
}

export function getSessionUserId() {
  return loadJSON(SESSION_KEY, null);
}

export function setSessionUserId(id) {
  saveJSON(SESSION_KEY, id);
}

export function clearSession() {
  saveJSON(SESSION_KEY, null);
}

export function findUserByEmail(users, email) {
  return users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
}

export function nextEmployeeId(users) {
  const nums = users
    .map((u) => parseInt(String(u.employeeId).split('-')[1], 10))
    .filter((n) => !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 1000;
  return `EMP-${String(max + 1).padStart(4, '0')}`;
}
