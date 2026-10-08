const KEYS = {
  departments: 'irms.departments',
  requesters: 'irms.requesters',
  inventoryItems: 'irms.inventoryItems',
  requisitions: 'irms.requisitions',
  settings: 'irms.settings',
  initialized: 'irms.initialized'
};

export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read from localStorage', key, e);
    return fallback;
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to write to localStorage', key, e);
  }
}

export { KEYS };
