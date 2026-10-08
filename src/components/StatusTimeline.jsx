import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export default function StatusTimeline({ timeline }) {
  return (
    <Stack direction="row" spacing={0} alignItems="flex-start" sx={{ overflowX: 'auto', py: 1 }}>
      {timeline.map((step, idx) => {
        const isRejected = step.status.toLowerCase().includes('reject');
        const isLast = idx === timeline.length - 1;
        return (
          <Box
            key={idx}
            className="float-in"
            style={{ animationDelay: `${idx * 0.12}s` }}
            sx={{ display: 'flex', alignItems: 'center', minWidth: isLast ? 120 : 140 }}
          >
            <Stack alignItems="center" spacing={0.5} sx={{ minWidth: 100 }}>
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: isRejected ? 'error.main' : 'primary.main',
                  color: '#fff',
                  boxShadow: '0 3px 8px rgba(63,81,181,0.35)',
                  transition: 'transform 0.3s ease'
                }}
              >
                {isRejected ? <CloseIcon fontSize="small" /> : <CheckIcon fontSize="small" />}
              </Box>
              <Typography variant="caption" fontWeight={600} textAlign="center">
                {step.status}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {step.date}
              </Typography>
            </Stack>
            {!isLast && (
              <Box
                sx={{
                  height: 2,
                  flex: 1,
                  minWidth: 40,
                  bgcolor: 'primary.light',
                  mt: '-20px',
                  opacity: 0.6
                }}
              />
            )}
          </Box>
        );
      })}
    </Stack>
  );
}
