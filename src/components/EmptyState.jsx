import React from 'react';
import { Box, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/InboxOutlined';

export default function EmptyState({ title = 'No records found', subtitle = 'Try adjusting your search or filters.' }) {
  return (
    <Box
      className="fade-in"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        color: 'text.secondary'
      }}
    >
      <InboxIcon sx={{ fontSize: 56, mb: 1, opacity: 0.4 }} />
      <Typography variant="subtitle1" fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="body2">{subtitle}</Typography>
    </Box>
  );
}
