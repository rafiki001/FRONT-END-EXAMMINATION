// Pure helper functions - all dashboard/report numbers are DERIVED, never
// hard-coded, using map / filter / find / reduce / sort as required.

export function countByStatus(requisitions, status) {
  return requisitions.filter((r) => r.status === status).length;
}

export function totalItemsRequested(requisitions) {
  return requisitions.reduce(
    (sum, r) => sum + r.items.reduce((s, it) => s + it.requestedQuantity, 0),
    0
  );
}

export function totalItemsIssued(requisitions) {
  return requisitions.reduce(
    (sum, r) => sum + r.items.reduce((s, it) => s + (it.issuedQuantity || 0), 0),
    0
  );
}

export function remainingQuantity(item) {
  return item.requestedQuantity - (item.issuedQuantity || 0);
}

export function requisitionsByDepartment(requisitions, departments) {
  return departments.map((d) => ({
    department: d.name,
    count: requisitions.filter((r) => r.department === d.name).length
  }));
}

export function requisitionsByStatus(requisitions) {
  const statuses = ['Draft', 'Submitted', 'Approved', 'Rejected', 'Issued'];
  return statuses.map((status) => ({
    status,
    count: countByStatus(requisitions, status)
  }));
}

export function monthlyTrend(requisitions) {
  const map = new Map();
  requisitions.forEach((r) => {
    const month = r.requestDate.slice(0, 7); // YYYY-MM
    map.set(month, (map.get(month) || 0) + 1);
  });
  return Array.from(map.entries())
    .sort((a, b) => (a[0] > b[0] ? 1 : -1))
    .map(([month, count]) => ({ month, count }));
}

export function mostRequestedItems(requisitions, limit = 5) {
  const map = new Map();
  requisitions.forEach((r) => {
    r.items.forEach((it) => {
      map.set(it.itemName, (map.get(it.itemName) || 0) + it.requestedQuantity);
    });
  });
  return Array.from(map.entries())
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, limit);
}

export function findRequisition(requisitions, id) {
  return requisitions.find((r) => r.id === id);
}

export function pendingApprovals(requisitions) {
  return requisitions.filter((r) => r.status === 'Submitted');
}

export function recentRequisitions(requisitions, limit = 5) {
  return [...requisitions]
    .sort((a, b) => (a.requestDate < b.requestDate ? 1 : -1))
    .slice(0, limit);
}

export function recentlyIssued(requisitions, limit = 5) {
  return requisitions
    .filter((r) => r.status === 'Issued' && r.issue)
    .sort((a, b) => (a.issue.date < b.issue.date ? 1 : -1))
    .slice(0, limit);
}

export function rejectedRequests(requisitions) {
  return requisitions.filter((r) => r.status === 'Rejected');
}

export function nextRequisitionNumber(requisitions) {
  const year = new Date().getFullYear() > 2026 ? new Date().getFullYear() : 2026;
  const nums = requisitions
    .map((r) => parseInt(r.id.split('-')[2], 10))
    .filter((n) => !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return `REQ-${year}-${String(max + 1).padStart(4, '0')}`;
}
