import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import PrintIcon from '@mui/icons-material/PrintOutlined';
import DownloadIcon from '@mui/icons-material/FileDownloadOutlined';

import { useData } from '../context/DataContext.jsx';
import StatusChip from '../components/StatusChip.jsx';
import EmptyState from '../components/EmptyState.jsx';
import {
  requisitionsByDepartment,
  requisitionsByStatus,
  monthlyTrend,
  totalItemsRequested,
  totalItemsIssued,
  rejectedRequests
} from '../utils/calculations.js';

const STATUSES = ['Draft', 'Submitted', 'Approved', 'Rejected', 'Issued'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

function toCSV(rows, columns) {
  const header = columns.map((c) => `"${c.headerName}"`).join(',');
  const body = rows
    .map((row) => columns.map((c) => `"${String(row[c.field] ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
  return `${header}\n${body}`;
}

function downloadCSV(filename, csvContent) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const { requisitions, departments } = useData();
  const [tab, setTab] = useState(0);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const filtered = useMemo(() => {
    return requisitions.filter((r) => {
      const matchesFrom = !dateFrom || r.requestDate >= dateFrom;
      const matchesTo = !dateTo || r.requestDate <= dateTo;
      const matchesDept = !deptFilter || r.department === deptFilter;
      const matchesStatus = !statusFilter || r.status === statusFilter;
      const matchesPriority = !priorityFilter || r.priority === priorityFilter;
      return matchesFrom && matchesTo && matchesDept && matchesStatus && matchesPriority;
    });
  }, [requisitions, dateFrom, dateTo, deptFilter, statusFilter, priorityFilter]);

  const summary = {
    total: filtered.length,
    itemsRequested: totalItemsRequested(filtered),
    itemsIssued: totalItemsIssued(filtered)
  };
  const byDept = requisitionsByDepartment(filtered, departments);
  const byStatus = requisitionsByStatus(filtered);
  const trend = monthlyTrend(filtered);
  const rejected = rejectedRequests(filtered);

  const requestedItemRows = filtered.flatMap((r) =>
    r.items.map((it) => ({
      requisition: r.id,
      department: r.department,
      item: it.itemName,
      requestedQuantity: it.requestedQuantity,
      issuedQuantity: it.issuedQuantity,
      status: r.status
    }))
  );

  const handlePrint = () => window.print();

  const handleExport = () => {
    const columns = [
      { field: 'requisition', headerName: 'Requisition' },
      { field: 'department', headerName: 'Department' },
      { field: 'item', headerName: 'Item' },
      { field: 'requestedQuantity', headerName: 'Requested Qty' },
      { field: 'issuedQuantity', headerName: 'Issued Qty' },
      { field: 'status', headerName: 'Status' }
    ];
    downloadCSV('requisition-report.csv', toCSV(requestedItemRows, columns));
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" className="fade-in-up" mb={2}>
        <Box>
          <Typography variant="h5">Reports</Typography>
          <Typography variant="body2" color="text.secondary">
            Filterable reporting across requisitions, items and departments.
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint}>
            Print
          </Button>
          <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleExport}>
            Export CSV
          </Button>
        </Box>
      </Box>

      <Paper className="fade-in-up hover-lift" sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={1.5}>
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="From"
              InputLabelProps={{ shrink: true }}
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="To"
              InputLabelProps={{ shrink: true }}
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} sm={2}>
            <TextField
              select
              fullWidth
              size="small"
              label="Department"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {departments.map((d) => (
                <MenuItem key={d.id} value={d.name}>
                  {d.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={2}>
            <TextField
              select
              fullWidth
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {STATUSES.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={2}>
            <TextField
              select
              fullWidth
              size="small"
              label="Priority"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {PRIORITIES.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={2} className="fade-in-up stagger-2" sx={{ mb: 1 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2 }} className="hover-lift">
            <Typography variant="body2" color="text.secondary">
              Requisitions in Range
            </Typography>
            <Typography variant="h5">{summary.total}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2 }} className="hover-lift">
            <Typography variant="body2" color="text.secondary">
              Total Items Requested
            </Typography>
            <Typography variant="h5">{summary.itemsRequested}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2 }} className="hover-lift">
            <Typography variant="body2" color="text.secondary">
              Total Items Issued
            </Typography>
            <Typography variant="h5">{summary.itemsIssued}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper className="fade-in-up hover-lift stagger-3">
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ px: 2, pt: 1 }}>
          <Tab label="By Department" />
          <Tab label="By Status" />
          <Tab label="Monthly Trend" />
          <Tab label="Requested Items" />
          <Tab label="Rejected Requisitions" />
        </Tabs>
        <Divider />
        <Box p={2}>
          {tab === 0 && <SimpleTable rows={byDept} columns={[{ field: 'department', label: 'Department' }, { field: 'count', label: 'Requisitions' }]} />}
          {tab === 1 && (
            <SimpleTable
              rows={byStatus}
              columns={[{ field: 'status', label: 'Status', render: (v) => <StatusChip status={v} /> }, { field: 'count', label: 'Requisitions' }]}
            />
          )}
          {tab === 2 && <SimpleTable rows={trend} columns={[{ field: 'month', label: 'Month' }, { field: 'count', label: 'Requisitions' }]} />}
          {tab === 3 && (
            requestedItemRows.length === 0 ? <EmptyState /> :
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Requisition</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Requested</TableCell>
                  <TableCell align="right">Issued</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requestedItemRows.map((row, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>{row.requisition}</TableCell>
                    <TableCell>{row.department}</TableCell>
                    <TableCell>{row.item}</TableCell>
                    <TableCell align="right">{row.requestedQuantity}</TableCell>
                    <TableCell align="right">{row.issuedQuantity}</TableCell>
                    <TableCell><StatusChip status={row.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {tab === 4 && (
            rejected.length === 0 ? <EmptyState title="No rejected requisitions" /> :
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Requisition</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Rejection Date</TableCell>
                  <TableCell>Rejected By</TableCell>
                  <TableCell>Reason</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rejected.map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.department}</TableCell>
                    <TableCell>{r.rejection?.date}</TableCell>
                    <TableCell>{r.rejection?.rejectedBy}</TableCell>
                    <TableCell>{r.rejection?.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

function SimpleTable({ rows, columns }) {
  if (rows.length === 0) return <EmptyState />;
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          {columns.map((c) => (
            <TableCell key={c.field}>{c.label}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, idx) => (
          <TableRow key={idx} hover>
            {columns.map((c) => (
              <TableCell key={c.field}>{c.render ? c.render(row[c.field]) : row[c.field]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
