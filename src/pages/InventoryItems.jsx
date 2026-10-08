import React, { useMemo, useState } from 'react';
import { Box, Typography, Paper, Grid, TextField, MenuItem, InputAdornment, LinearProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';

import { useData } from '../context/DataContext.jsx';
import StatusChip from '../components/StatusChip.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function InventoryItems() {
  const { inventoryItems } = useData();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const categories = useMemo(
    () => Array.from(new Set(inventoryItems.map((i) => i.category))).sort(),
    [inventoryItems]
  );

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return inventoryItems
      .filter((i) => {
        const matchesSearch =
          !term || i.name.toLowerCase().includes(term) || i.code.toLowerCase().includes(term);
        const matchesCategory = !categoryFilter || i.category === categoryFilter;
        const matchesStatus = !statusFilter || i.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [inventoryItems, search, categoryFilter, statusFilter]);

  const columns = [
    { field: 'code', headerName: 'Item Code', width: 110 },
    { field: 'name', headerName: 'Item Name', width: 200 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'unit', headerName: 'Unit', width: 90 },
    { field: 'availableQuantity', headerName: 'Available Qty', width: 130, type: 'number' },
    { field: 'reorderLevel', headerName: 'Reorder Level', width: 130, type: 'number' },
    { field: 'location', headerName: 'Location', width: 140 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (p) => <StatusChip status={p.value} />
    },
    {
      field: 'stockLevel',
      headerName: 'Stock Level',
      width: 150,
      sortable: false,
      renderCell: (p) => {
        const pct = Math.min(100, Math.round((p.row.availableQuantity / (p.row.reorderLevel * 3 || 1)) * 100));
        return (
          <Box width="100%">
            <LinearProgress
              variant="determinate"
              value={pct}
              color={p.row.status === 'Out of Stock' ? 'error' : p.row.status === 'Low Stock' ? 'warning' : 'success'}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        );
      }
    }
  ];

  return (
    <Box>
      <Typography variant="h5" className="fade-in-up" gutterBottom>
        Inventory Items
      </Typography>
      <Typography variant="body2" color="text.secondary" className="fade-in-up" sx={{ mb: 2 }}>
        Live inventory levels — quantities update automatically as items are issued.
      </Typography>

      <Paper className="fade-in-up hover-lift" sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by name or code"
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
          <Grid item xs={6} sm={3.5}>
            <TextField
              select
              fullWidth
              size="small"
              label="Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={3.5}>
            <TextField
              select
              fullWidth
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="In Stock">In Stock</MenuItem>
              <MenuItem value="Low Stock">Low Stock</MenuItem>
              <MenuItem value="Out of Stock">Out of Stock</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      <Paper className="fade-in-up hover-lift stagger-2" sx={{ height: 560, p: 1 }}>
        {rows.length === 0 ? (
          <EmptyState />
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            disableRowSelectionOnClick
            sx={{ border: 'none' }}
          />
        )}
      </Paper>
    </Box>
  );
}
