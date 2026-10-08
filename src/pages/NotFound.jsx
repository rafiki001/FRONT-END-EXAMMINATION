import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <Box className="scale-in" textAlign="center" py={10}>
      <Typography variant="h2" fontWeight={700} color="primary.main">
        404
      </Typography>
      <Typography variant="h6" gutterBottom>
        Page not found
      </Typography>
      <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/')}>
        Back to Dashboard
      </Button>
    </Box>
  );
}
