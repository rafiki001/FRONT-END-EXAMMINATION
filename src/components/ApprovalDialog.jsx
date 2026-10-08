import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Slide,
  Alert
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ApprovalDialog({ open, onClose, requisition, onApprove, onReject }) {
  const [comment, setComment] = useState('');
  const [mode, setMode] = useState(null); // 'approve' | 'reject'
  const [error, setError] = useState('');

  if (!requisition) return null;

  const handleConfirm = () => {
    if (mode === 'reject' && !comment.trim()) {
      setError('Please provide a reason for rejection.');
      return;
    }
    if (mode === 'approve') onApprove(comment);
    if (mode === 'reject') onReject(comment);
    setComment('');
    setMode(null);
    setError('');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      keepMounted
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Requisition Approval — {requisition.id}</DialogTitle>
      <DialogContent dividers>
        <Box className="fade-in" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Department:</strong> {requisition.department}
          </Typography>
          <Typography variant="body2">
            <strong>Requester:</strong> {requisition.requesterName}
          </Typography>
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="right">Qty Requested</TableCell>
              <TableCell>Unit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requisition.items.map((it) => (
              <TableRow key={it.lineId}>
                <TableCell>{it.itemName}</TableCell>
                <TableCell align="right">{it.requestedQuantity}</TableCell>
                <TableCell>{it.unit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {mode && (
          <Box className="scale-in" sx={{ mt: 2 }}>
            <TextField
              label={mode === 'approve' ? 'Approval comment (optional)' : 'Rejection reason'}
              fullWidth
              multiline
              minRows={2}
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                setError('');
              }}
              error={!!error}
              helperText={error}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        {!mode && (
          <>
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => setMode('reject')}
            >
              Reject
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={() => setMode('approve')}
            >
              Approve
            </Button>
          </>
        )}
        {mode && (
          <Button
            variant="contained"
            color={mode === 'approve' ? 'success' : 'error'}
            onClick={handleConfirm}
          >
            Confirm {mode === 'approve' ? 'Approval' : 'Rejection'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
