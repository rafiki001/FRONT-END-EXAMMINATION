import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Typography,
  Box,
  Slide,
  Alert
} from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function IssueDialog({ open, onClose, requisition, inventoryItems, onIssue }) {
  const [quantities, setQuantities] = useState({});
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (requisition) {
      const init = {};
      requisition.items.forEach((it) => {
        init[it.lineId] = it.requestedQuantity;
      });
      setQuantities(init);
      setError('');
    }
  }, [requisition]);

  if (!requisition) return null;

  const getAvailable = (itemId) => {
    const inv = inventoryItems.find((i) => i.id === itemId);
    return inv ? inv.availableQuantity : 0;
  };

  const handleChange = (lineId, value) => {
    setQuantities((prev) => ({ ...prev, [lineId]: value === '' ? '' : Number(value) }));
  };

  const handleSubmit = () => {
    for (const it of requisition.items) {
      const qty = quantities[it.lineId];
      const available = getAvailable(it.itemId);
      if (qty === '' || qty === undefined || Number.isNaN(qty) || qty < 0) {
        setError(`Please enter a valid quantity for ${it.itemName}.`);
        return;
      }
      if (qty > available) {
        setError(`Insufficient stock for ${it.itemName}. Only ${available} available.`);
        return;
      }
      if (qty > it.requestedQuantity) {
        setError(`Issued quantity for ${it.itemName} cannot exceed requested quantity.`);
        return;
      }
    }
    onIssue(quantities, remarks);
  };

  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition} keepMounted maxWidth="md" fullWidth>
      <DialogTitle>Issue Items — {requisition.id}</DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} className="scale-in">
            {error}
          </Alert>
        )}
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="right">Requested</TableCell>
              <TableCell align="right">Available</TableCell>
              <TableCell align="right">Qty to Issue</TableCell>
              <TableCell align="right">Remaining</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requisition.items.map((it) => {
              const available = getAvailable(it.itemId);
              const qty = quantities[it.lineId] ?? '';
              const remaining = it.requestedQuantity - (Number(qty) || 0);
              return (
                <TableRow key={it.lineId} hover>
                  <TableCell>{it.itemName}</TableCell>
                  <TableCell align="right">{it.requestedQuantity}</TableCell>
                  <TableCell align="right">{available}</TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      size="small"
                      value={qty}
                      onChange={(e) => handleChange(it.lineId, e.target.value)}
                      inputProps={{ min: 0, max: Math.min(available, it.requestedQuantity), style: { textAlign: 'right' } }}
                      sx={{ width: 90 }}
                    />
                  </TableCell>
                  <TableCell align="right">{remaining}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Box mt={2}>
          <TextField
            label="Issuing remarks"
            fullWidth
            multiline
            minRows={2}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="secondary" onClick={handleSubmit}>
          Confirm Issue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
