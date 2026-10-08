import React, { useState } from 'react';
import { Box, Toolbar, Snackbar, Alert } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import { useData } from '../../context/DataContext.jsx';

export default function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { snackbar, dispatch } = useData();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Topbar onMenuClick={() => setMobileOpen(true)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          bgcolor: 'background.default',
          minHeight: '100vh'
        }}
      >
        <Toolbar />
        <Box key={location.pathname} className="fade-in-up" sx={{ p: { xs: 2, sm: 3 } }}>
          {children}
        </Box>
      </Box>

      <Snackbar
        key={snackbar?.key}
        open={!!snackbar}
        autoHideDuration={3500}
        onClose={() => dispatch({ type: 'CLEAR_NOTIFY' })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {snackbar ? (
          <Alert
            severity={snackbar.severity}
            variant="filled"
            onClose={() => dispatch({ type: 'CLEAR_NOTIFY' })}
            sx={{ boxShadow: 4 }}
          >
            {snackbar.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
}
