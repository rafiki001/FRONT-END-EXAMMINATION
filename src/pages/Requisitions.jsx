import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
  InputAdornment
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddIcon from '@mui/icons-material/Add';

import { useData } from '../context/DataContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import StatusChip from '../components/StatusChip.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

const STATUSES = ['Draft', 'Submitted', 'Approved', 'Rejected', 'Issued'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

export default function Requisitions() {
  const { requisitions, departments, dispatch, notify } = useData();
  const { currentUser } = useAuth();
  const isRequester = currentUser?.role === 'Requester';
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return requisitions
      .filter((r) => {
        const matchesSearch =
          !term ||
          r.id.toLowerCase().includes(term) ||
          r.department.toLowerCase().includes(term) ||
          r.requesterName.toLowerCase().includes(term) ||
          r.purpose.toLowerCase().includes(term) ||
          r.items.some((it) => it.itemName.toLowerCase().includes(term));
        const matchesStatus = !statusFilter || r.status === statusFilter;
        const matchesDept = !deptFilter || r.department === deptFilter;
        const matchesPriority = !priorityFilter || r.priority === priorityFilter;
        const matchesDate = !dateFilter || r.requestDate === dateFilter;
        return matchesSearch && matchesStatus && matchesDept && matchesPriority && matchesDate;
      })
      .sort((a, b) => (a.requestDate < b.requestDate ? 1 : -1));
  }, [requisitions, search, statusFilter, deptFilter, priorityFilter, dateFilter]);

  const rows = filtered.map((r) => ({
    id: r.id,
    department: r.department,
    requesterName: r.requesterName,
    requestDate: r.requestDate,
    itemCount: r.items.length,
    totalQuantity: r.items.reduce((s, it) => s + it.requestedQuantity, 0),
    priority: r.priority,
    status: r.status
  }));

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setDeptFilter('');
    setPriorityFilter('');
    setDateFilter('');
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_REQUISITION', payload: confirmDelete });
    notify(`Requisition ${confirmDelete} deleted.`, 'info');
    setConfirmDelete(null);
  };

  const columns = [
    { field: 'id', headerName: 'Requisition #', width: 150, renderCell: (p) => <strong>{p.value}</strong> },
    { field: 'department', headerName: 'Department', width: 170 },
    { field: 'requesterName', headerName: 'Requester', width: 160 },
    { field: 'requestDate', headerName: 'Request Date', width: 120 },
    { field: 'itemCount', headerName: 'Items', width: 80, type: 'number' },
    { field: 'totalQuantity', headerName: 'Total Qty', width: 100, type: 'number' },
    { field: 'priority', headerName: 'Priority', width: 110 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (p) => <StatusChip status={p.value} />
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (p) => {
        const req = requisitions.find((r) => r.id === p.id);
        const editable = req.status === 'Draft' && isRequester;
        return (
          <Box>
            <Tooltip title="View details">
              <IconButton size="small" onClick={() => navigate(`/requisitions/${p.id}`)}>
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={editable ? 'Edit requisition' : 'Only Draft requisitions can be edited'}>
              <span>
                <IconButton
                  size="small"
                  disabled={!editable}
                  onClick={() => navigate(`/requisitions/${p.id}/edit`)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={editable ? 'Delete requisition' : 'Only Draft requisitions can be deleted'}>
              <span>
                <IconButton size="small" disabled={!editable} onClick={() => setConfirmDelete(p.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        );
      }
    }
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" className="fade-in-up" mb={2}>
        <Box>
          <Typography variant="h5">Requisitions</Typography>
          <Typography variant="body2" color="text.secondary">
            Search, filter and manage every requisition in the system.
          </Typography>
        </Box>
        {isRequester && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/requisitions/new')}
          >
            New Requisition
          </Button>
        )}
      </Box>

      <Paper className="fade-in-up hover-lift" sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={1.5} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search # / dept / requester / item"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={6} md={2}>
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
          <Grid item xs={6} md={2}>
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
          <Grid item xs={6} md={2}>
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
          <Grid item xs={6} md={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Request Date"
              InputLabelProps={{ shrink: true }}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <Tooltip title="Clear filters">
              <IconButton onClick={clearFilters}>
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      <Paper className="fade-in-up hover-lift stagger-2" sx={{ height: 560, p: 1 }}>
        {rows.length === 0 ? (
          <EmptyState title="No requisitions match your search" subtitle="Try clearing filters or search terms." />
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-row': { transition: 'background-color 0.2s ease' }
            }}
          />
        )}
      </Paper>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete requisition?"
        message={`This will permanently remove requisition ${confirmDelete} from the system.`}
        confirmLabel="Delete"
        confirmColor="error"
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
