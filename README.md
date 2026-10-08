# Inventory Requisition Management System (IRMS)

A **frontend-only** React.js simulation that allows departments to create multi-item
requisitions and follow them through the full approval, rejection and issuing
workflow — entirely in the browser, with no backend server.

> Built for: *Integrated Situation — Project 20: Inventory Requisition Management System*

---

## 1. Project Description

An organization needs a way for departments to request office supplies and for
authorized staff to review, approve, reject, and issue the requested items.
This project implements that as a **frontend simulation**: all departments,
employees, inventory items, requisitions, approvals and issued items are mock
data persisted in the browser's `localStorage`. No backend or real inventory
system is required or used.

## 2. Technologies Used

| Technology | Purpose |
|---|---|
| React.js (18) | UI library |
| Vite | Build tool / dev server |
| JavaScript ES6+ | Application logic |
| React Router v6 | Routing, including the dynamic `/requisitions/:requisitionId` route |
| Material UI (MUI v5) | Component library / design system |
| MUI X DataGrid | Requisitions & inventory tables (sorting, pagination) |
| Recharts | Dashboard pie / bar / area charts |
| Browser `localStorage` | Data persistence across refreshes |
| HTML5 / CSS3 | Layout, responsive design, animations & transitions |

## 3. Installation Instructions

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open the app
# Vite will print a local URL, typically http://localhost:5173
```

To create a production build:

```bash
npm run build
npm run preview   # serve the production build locally
```

## 4. How to Run the Project

1. Run `npm install` once to fetch dependencies.
2. Run `npm run dev` to start the Vite dev server.
3. Open the printed local URL in your browser.
4. On first load, the app automatically seeds `localStorage` with mock
   departments, requesters, inventory items and requisitions. Refreshing the
   page will **not** regenerate the data — your changes persist.
5. **Sign up** for your own account (or use a demo account below). Each user
   logs in for themselves — accounts live in the browser's `localStorage`,
   so **no backend is needed**.

### Login / Accounts (frontend-only)

- `/signup` — create an account (name, email, password, department, position,
  and role: Requester / Approver / Issuing Officer).
- `/login` — sign in; sessions persist across refresh; **Log Out** is in the
  avatar menu (top right).
- All app pages are protected and redirect to `/login` when signed out.
- Permissions follow the logged-in user's role: Requesters create/edit/submit
  requisitions (department and requester auto-filled from their account),
  Approvers approve/reject, Issuing Officers issue items. Approver/issuer names
  recorded on requisitions are the real logged-in users.
- Demo accounts (password `password123`): `requester@irms.demo`,
  `approver@irms.demo`, `issuer@irms.demo`.
- **Security note:** with no backend, passwords are stored in plain text in
  `localStorage` and accounts exist only in that browser. This is a
  simulation, not real authentication.

## 5. Features

- **Dashboard** — live summary cards (Total, Draft, Submitted, Approved,
  Rejected, Issued, Pending Approval, Total Items Requested), recent
  requisitions, pending approvals, recently issued items, rejected requests,
  department summary, and three Recharts visualizations (status pie chart,
  department bar chart, monthly trend area chart).
- **Requisitions** — searchable, filterable (department, status, priority,
  date), sortable, paginated MUI DataGrid with view / edit / delete actions.
  Edit and delete are only available while a requisition is in **Draft**.
- **Create / Edit Requisition** — dynamic multi-item form built from a React
  state array. Supports add/remove/edit item lines, quantity +/- controls,
  and full validation (required fields, quantity > 0, no duplicate items,
  requested quantity can't exceed simulated available stock).
- **Requisition Details** (`/requisitions/:requisitionId`) — full requisition
  information, animated status timeline, approval/rejection/issuing
  information blocks, and context-aware action buttons that only appear when
  valid for the current status and role.
- **Approval / Rejection simulation** — an MUI Dialog lets a simulated
  Approver approve (storing date, approver and comment) or reject (storing
  date, approver and reason) a submitted requisition.
- **Issuing workflow** — an MUI Dialog lets a simulated Issuing Officer issue
  quantities per line (validated against requested quantity and current
  simulated stock), which updates the requisition, the inventory, and the
  dashboard statistics.
- **Inventory Items** — searchable/filterable DataGrid of 50 mock inventory
  items with a visual stock-level indicator and status chip (In Stock / Low
  Stock / Out of Stock). Stock is dynamically reduced as items are issued.
- **Reports** — tabbed report views (by department, by status, monthly trend,
  requested items, rejected requisitions) with date/department/status/priority
  filters, a **Print** button and a **CSV export** button.
- **Responsive design** — desktop, tablet and mobile layouts using MUI's Grid
  system and a collapsible navigation drawer.
- **Animations & transitions** — fade/scale/slide-in animations on cards,
  list items, dialogs and route changes; hover-lift effects on cards and
  buttons; an animated status timeline; smooth MUI transition components on
  every dialog — giving the whole app a modern, professional feel.

## 6. Workflow Explanation

```
Draft ──submit──▶ Submitted ──approve──▶ Approved ──issue──▶ Issued
                       │
                       └──reject──▶ Rejected ──revise──▶ Draft
```

- **Draft** — the requester can edit, add/remove items, save, submit or
  delete the requisition.
- **Submitted** — read-only for the requester; a simulated Approver can
  Approve or Reject it from the Requisition Details page.
- **Approved** — a simulated Issuing Officer can view approved items and
  issue them.
- **Issued** — terminal state; displays issue date, issuing officer, items
  issued and quantities issued.
- **Rejected** — displays rejection date, rejecting approver and reason; the
  requester can choose **Revise**, which moves the requisition back to Draft
  for editing and resubmission.

Invalid transitions (e.g. issuing a Draft or Rejected requisition) are
prevented — the corresponding action buttons simply don't render unless the
requisition is in the correct status **and** the active simulated role has
permission to perform that action.

## 7. Calculation Rules

All dashboard and report figures are **derived at render time** using
`map()`, `filter()`, `find()`, `reduce()` and `sort()` — nothing is
hard-coded:

- `Total Items Requested` = sum of `requestedQuantity` across every item line
  of every requisition.
- `Total Items Issued` = sum of `issuedQuantity` across every item line.
- `Remaining Quantity` (per line) = `requestedQuantity − issuedQuantity`.
- `Available Stock` (per inventory item) = previous available stock −
  quantity issued against that item.
- `Department Requisitions` = count of requisitions whose `department`
  matches a given department.
- Chart data (status pie, department bar, monthly trend) is grouped and
  aggregated directly from the current `requisitions` array.

## 8. Mock-Data Explanation

Seeded once into `localStorage` on first run (see `src/data/mockData.js`):

- **8 departments** (Finance, Operations, Human Resources, Credit,
  Information Technology, Internal Audit, Risk & Compliance, Customer
  Relations)
- **20 requesters**, spread across all departments, with employee ID,
  position, phone, email and status
- **50 inventory items** across categories such as Paper, Toner, Stationery,
  Filing, Office Equipment, IT Accessories and Cleaning Supplies, each with a
  code, unit, available quantity, reorder level, location and computed
  status
- **30 requisitions** (6 of each status: Draft, Submitted, Approved,
  Rejected, Issued), spread across 9 months of 2026, each with 3–5 item
  lines — **120+ total requisition item lines**, multiple priorities, and
  fictional approval / rejection / issuing metadata
- All names, emails, phone numbers and data are entirely fictional.

Data is generated with a seeded pseudo-random function so the initial data
set is repeatable, then persisted to `localStorage` — from that point on the
user's own actions (create, edit, submit, approve, reject, issue, delete)
are what changes the data.

## 9. Screenshots

_Add screenshots of the Dashboard, Requisitions list, Create Requisition
form, Requisition Details page, Approval dialog, Issue dialog, Inventory
Items page and Reports page here before submission._

## 10. Future Improvements

- Real backend + database integration (REST or GraphQL API)
- User authentication and real role-based access control
- Email/SMS notifications on status changes
- Barcode/QR scanning for inventory items
- Multi-level approval chains
- PDF export for reports (in addition to CSV/print)
- Audit log of every change made to a requisition

---

## Project Structure

```
inventory-requisition-system/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── theme.js
    ├── index.css
    ├── data/
    │   └── mockData.js
    ├── utils/
    │   ├── storage.js
    │   └── calculations.js
    ├── context/
    │   └── DataContext.jsx
    ├── components/
    │   ├── StatusChip.jsx
    │   ├── StatusTimeline.jsx
    │   ├── SummaryCard.jsx
    │   ├── ApprovalDialog.jsx
    │   ├── IssueDialog.jsx
    │   ├── ConfirmDialog.jsx
    │   ├── EmptyState.jsx
    │   └── Layout/
    │       ├── AppLayout.jsx
    │       ├── Sidebar.jsx
    │       └── Topbar.jsx
    └── pages/
        ├── Dashboard.jsx
        ├── Requisitions.jsx
        ├── CreateRequisition.jsx
        ├── RequisitionDetails.jsx
        ├── InventoryItems.jsx
        ├── Reports.jsx
        └── NotFound.jsx
```
