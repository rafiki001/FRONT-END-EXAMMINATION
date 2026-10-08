import React from 'react';
import { Card, CardContent, Box, Typography, Avatar } from '@mui/material';

export default function SummaryCard({ title, value, icon, color = '#3f51b5', delayIndex = 0 }) {
  return (
    <Card
      className={`fade-in-up hover-lift stagger-${Math.min(delayIndex + 1, 8)}`}
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${color}12 0%, #ffffff 65%)`,
        border: `1px solid ${color}22`
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ mt: 0.5, color }}>
              {value}
            </Typography>
          </Box>
          <Avatar
            sx={{
              bgcolor: `${color}22`,
              color,
              width: 52,
              height: 52,
              transition: 'transform 0.3s ease'
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}
