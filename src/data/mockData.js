// ---------------------------------------------------------------------------
// Deterministic mock-data generator for the Inventory Requisition Management
// System. Everything here is FICTIONAL and is only used to seed
// browser localStorage on first run.
// ---------------------------------------------------------------------------

export const DEPARTMENTS = [
  'Finance',
  'Operations',
  'Human Resources',
  'Credit',
  'Information Technology',
  'Internal Audit',
  'Risk & Compliance',
  'Customer Relations'
];

const FIRST_NAMES = [
  'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen'
];
const LAST_NAMES = [
  'Uwimana', 'Mugisha', 'Niyonsaba', 'Habimana', 'Ingabire', 'Mukamana', 'Bizimana',
  'Nkurunziza', 'Kagame', 'Uwase', 'Nshuti', 'Munyaneza', 'Iradukunda', 'Byiringiro',
  'Nsengiyumva', 'Uwitonze', 'Rugamba', 'Twagirayezu', 'Mutoni', 'Karenzi'
];
const POSITIONS = [
  'Officer', 'Senior Officer', 'Manager', 'Assistant', 'Coordinator', 'Analyst',
  'Supervisor', 'Team Lead'
];

const ITEM_TEMPLATES = [
  ['Printer Paper A4', 'Paper', 'ream'],
  ['Printer Paper A3', 'Paper', 'ream'],
  ['Toner Cartridge - Black', 'Toner', 'unit'],
  ['Toner Cartridge - Color', 'Toner', 'unit'],
  ['Ink Cartridge', 'Toner', 'unit'],
  ['Ballpoint Pens (Blue)', 'Stationery', 'box'],
  ['Ballpoint Pens (Black)', 'Stationery', 'box'],
  ['Gel Pens', 'Stationery', 'box'],
  ['Notebooks A5', 'Stationery', 'piece'],
  ['Notebooks A4', 'Stationery', 'piece'],
  ['Manila Files', 'Filing', 'piece'],
  ['Ring Binders', 'Filing', 'piece'],
  ['Lever Arch Files', 'Filing', 'piece'],
  ['Staplers', 'Office Equipment', 'piece'],
  ['Staples (Box)', 'Office Equipment', 'box'],
  ['Envelopes (A4)', 'Stationery', 'box'],
  ['Envelopes (DL)', 'Stationery', 'box'],
  ['USB Flash Drives 16GB', 'IT Accessories', 'piece'],
  ['USB Flash Drives 32GB', 'IT Accessories', 'piece'],
  ['Computer Mouse (Wired)', 'IT Accessories', 'piece'],
  ['Computer Mouse (Wireless)', 'IT Accessories', 'piece'],
  ['Keyboard (Wired)', 'IT Accessories', 'piece'],
  ['Keyboard (Wireless)', 'IT Accessories', 'piece'],
  ['HDMI Cables', 'IT Accessories', 'piece'],
  ['Cleaning Detergent', 'Cleaning Supplies', 'bottle'],
  ['Hand Sanitizer', 'Cleaning Supplies', 'bottle'],
  ['Disinfectant Wipes', 'Cleaning Supplies', 'pack'],
  ['Paper Towels', 'Cleaning Supplies', 'roll'],
  ['Trash Bags', 'Cleaning Supplies', 'pack'],
  ['Whiteboard Markers', 'Stationery', 'box'],
  ['Highlighters', 'Stationery', 'box'],
  ['Sticky Notes', 'Stationery', 'pack'],
  ['Correction Fluid', 'Stationery', 'piece'],
  ['Rulers', 'Stationery', 'piece'],
  ['Scissors', 'Office Equipment', 'piece'],
  ['Glue Sticks', 'Stationery', 'piece'],
  ['Clipboards', 'Office Equipment', 'piece'],
  ['Calculators', 'Office Equipment', 'piece'],
  ['Extension Cables', 'IT Accessories', 'piece'],
  ['Laptop Bags', 'IT Accessories', 'piece'],
  ['Name Badges', 'Office Equipment', 'piece'],
  ['ID Card Holders', 'Office Equipment', 'piece'],
  ['Paper Clips', 'Stationery', 'box'],
  ['Binder Clips', 'Stationery', 'box'],
  ['Index Cards', 'Stationery', 'pack'],
  ['Desk Organizers', 'Office Equipment', 'piece'],
  ['Printer Paper Legal', 'Paper', 'ream'],
  ['Air Freshener', 'Cleaning Supplies', 'bottle'],
  ['Rubber Bands', 'Stationery', 'box'],
  ['Whiteboard Eraser', 'Office Equipment', 'piece'],
  ['Batteries AA (Pack)', 'IT Accessories', 'pack']
];

const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

const PURPOSES = [
  'Replenishing department stock for the quarter',
  'Supplies for new staff onboarding',
  'Preparation for upcoming client meeting',
  'General office supplies restock',
  'Support for ongoing audit exercise',
  'IT accessories for new workstation setup',
  'Cleaning supplies for office maintenance',
  'Stationery for training workshop',
  'Support for monthly reporting cycle',
  'Replacement of worn-out equipment'
];

function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rand = seededRandom(20260115);
function pick(arr) {
  return arr[Math.floor(rand() * arr.length)];
}
function randInt(min, max) {
  return Math.floor(rand() * (max - min + 1)) + min;
}
function pad(num, size) {
  return String(num).padStart(size, '0');
}

// ---------------------------------------------------------------------------
// Departments
// ---------------------------------------------------------------------------
export function generateDepartments() {
  return DEPARTMENTS.map((name, idx) => ({
    id: `DPT-${pad(idx + 1, 2)}`,
    name,
    code: name
      .split(/[\s&]+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
  }));
}

// ---------------------------------------------------------------------------
// Requesters
// ---------------------------------------------------------------------------
export function generateRequesters() {
  const requesters = [];
  for (let i = 0; i < 20; i++) {
    const first = FIRST_NAMES[i];
    const last = LAST_NAMES[i];
    const department = DEPARTMENTS[i % DEPARTMENTS.length];
    requesters.push({
      id: `EMP-${pad(i + 1, 4)}`,
      name: `${first} ${last}`,
      department,
      position: POSITIONS[i % POSITIONS.length],
      phone: `+250 78${pad(randInt(1000000, 9999999), 7)}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@company.com`,
      status: i % 9 === 0 ? 'Inactive' : 'Active'
    });
  }
  return requesters;
}

// ---------------------------------------------------------------------------
// Inventory items
// ---------------------------------------------------------------------------
export function generateInventoryItems() {
  return ITEM_TEMPLATES.map((tpl, idx) => {
    const [name, category, unit] = tpl;
    const availableQuantity = randInt(0, 250);
    const reorderLevel = randInt(15, 40);
    let status = 'In Stock';
    if (availableQuantity === 0) status = 'Out of Stock';
    else if (availableQuantity <= reorderLevel) status = 'Low Stock';
    return {
      id: `ITM-${pad(idx + 1, 4)}`,
      code: `SKU-${pad(idx + 1, 4)}`,
      name,
      category,
      unit,
      availableQuantity,
      reorderLevel,
      location: `Store Room ${String.fromCharCode(65 + (idx % 4))}-${(idx % 6) + 1}`,
      status
    };
  });
}

// ---------------------------------------------------------------------------
// Requisitions (30, spread across the year, with 100+ item lines total)
// ---------------------------------------------------------------------------
const STATUS_PLAN = [
  ...Array(6).fill('Draft'),
  ...Array(6).fill('Submitted'),
  ...Array(6).fill('Approved'),
  ...Array(6).fill('Rejected'),
  ...Array(6).fill('Issued')
]; // 30 total, 6 of each

function buildTimeline(status, requestDate) {
  const timeline = [{ status: 'Draft', date: requestDate }];
  if (['Submitted', 'Approved', 'Rejected', 'Issued'].includes(status)) {
    timeline.push({ status: 'Submitted', date: requestDate });
  }
  return timeline;
}

export function generateRequisitions(inventoryItems, requesters) {
  const requisitions = [];
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // Jan - Sep 2026

  for (let i = 0; i < STATUS_PLAN.length; i++) {
    const status = STATUS_PLAN[i];
    const requester = requesters[randInt(0, requesters.length - 1)];
    const month = months[i % months.length];
    const day = randInt(1, 27);
    const requestDate = `2026-${pad(month, 2)}-${pad(day, 2)}`;
    const requiredDate = `2026-${pad(month, 2)}-${pad(Math.min(day + randInt(3, 10), 28), 2)}`;
    const priority = pick(PRIORITIES);
    const purpose = pick(PURPOSES);

    const itemCount = randInt(3, 5); // ensures 100+ total lines across 30 requisitions
    const usedItemIds = new Set();
    const items = [];
    for (let j = 0; j < itemCount; j++) {
      let invItem;
      let attempts = 0;
      do {
        invItem = inventoryItems[randInt(0, inventoryItems.length - 1)];
        attempts++;
      } while (usedItemIds.has(invItem.id) && attempts < 10);
      usedItemIds.add(invItem.id);

      const requestedQuantity = randInt(1, 20);
      items.push({
        lineId: `${pad(i + 1, 4)}-${pad(j + 1, 2)}`,
        itemId: invItem.id,
        itemName: invItem.name,
        category: invItem.category,
        unit: invItem.unit,
        availableQuantityAtRequest: invItem.availableQuantity,
        requestedQuantity,
        issuedQuantity: 0,
        justification: 'Needed for routine departmental operations',
        remarks: ''
      });
    }

    const requisition = {
      id: `REQ-2026-${pad(i + 1, 4)}`,
      department: requester.department,
      requesterId: requester.id,
      requesterName: requester.name,
      requestDate,
      requiredDate,
      priority,
      purpose,
      remarks: '',
      status,
      items,
      timeline: buildTimeline(status, requestDate),
      approval: null,
      rejection: null,
      issue: null,
      createdAt: `${requestDate}T09:00:00.000Z`
    };

    if (status === 'Approved' || status === 'Issued') {
      requisition.approval = {
        date: requiredDate,
        approvedBy: 'Alice Uwimana (Manager)',
        comment: 'Approved as per available budget and stock.'
      };
      requisition.timeline.push({ status: 'Approved', date: requiredDate });
    }

    if (status === 'Rejected') {
      requisition.rejection = {
        date: requiredDate,
        rejectedBy: 'Alice Uwimana (Manager)',
        reason: pick([
          'Insufficient budget allocation for this period',
          'Quantities exceed departmental allowance',
          'Duplicate of a previously submitted requisition',
          'Incomplete justification provided'
        ])
      };
      requisition.timeline.push({ status: 'Rejected', date: requiredDate });
    }

    if (status === 'Issued') {
      requisition.items = requisition.items.map((it) => ({
        ...it,
        issuedQuantity: Math.max(1, it.requestedQuantity - randInt(0, 2))
      }));
      requisition.issue = {
        date: requiredDate,
        issuedBy: 'Peter Mugisha (Store Officer)',
        remarks: 'Items issued in full working condition.'
      };
      requisition.timeline.push({ status: 'Issued', date: requiredDate });
    }

    requisitions.push(requisition);
  }

  return requisitions;
}

export function generateInitialData() {
  const departments = generateDepartments();
  const requesters = generateRequesters();
  const inventoryItems = generateInventoryItems();
  const requisitions = generateRequisitions(inventoryItems, requesters);
  return { departments, requesters, inventoryItems, requisitions };
}
