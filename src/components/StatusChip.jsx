import React from 'react';
import { Chip } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Inventory2Icon from '@mui/icons-material/Inventory2';

const CONFIG = {
  Draft: { color: 'default', icon: <EditNoteIcon fontSize="small" /> },
  Submitted: { color: 'info', icon: <SendIcon fontSize="small" /> },
  Approved: { color: 'success', icon: <CheckCircleIcon fontSize="small" /> },
  Rejected: { color: 'error', icon: <CancelIcon fontSize="small" /> },
  Issued: { color: 'secondary', icon: <Inventory2Icon fontSize="small" /> },
  'In Stock': { color: 'success', icon: null },
  'Low Stock': { color: 'warning', icon: null },
  'Out of Stock': { color: 'error', icon: null }
};

export default function StatusChip({ status, size = 'small', variant = 'filled' }) {
  const cfg = CONFIG[status] || { color: 'default', icon: null };
  return (
    <Chip
      label={status}
      color={cfg.color}
      icon={cfg.icon || undefined}
      size={size}
      variant={variant}
      sx={{ transition: 'transform 0.2s ease', '&:hover': { transform: 'scale(1.05)' } }}
    />
  );
}
