import React, { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login, authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const ok = login(email, password);
    if (ok) {
      const redirectTo = location.state?.from || '/';
      navigate(redirectTo, { replace: true });
    }
  };

  const fillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <Box
      className="fade-in"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #3f51b512 0%, #f4f6fb 60%)',
        p: 2
      }}
    >
      <Paper className="scale-in hover-lift" sx={{ p: 4, maxWidth: 420, width: '100%' }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <WarehouseIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h5" fontWeight={700} mt={1}>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Sign in to the Inventory Requisition Management System
          </Typography>
        </Box>

        {authError && (
          <Alert severity="error" className="scale-in" sx={{ mb: 2 }}>
            {authError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Email"
            type="email"
            required
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button type="submit" variant="contained" size="large">
            Log In
          </Button>
        </Box>

        <Divider sx={{ my: 2.5 }}>or try a demo account</Divider>

        <Box display="flex" flexDirection="column" gap={1}>
          <Button size="small" variant="outlined" onClick={() => fillDemo('requester@irms.demo')}>
            Fill Requester demo
          </Button>
          <Button size="small" variant="outlined" onClick={() => fillDemo('approver@irms.demo')}>
            Fill Approver (Manager) demo
          </Button>
          <Button size="small" variant="outlined" onClick={() => fillDemo('issuer@irms.demo')}>
            Fill Issuing Officer demo
          </Button>
          <Typography variant="caption" color="text.secondary" textAlign="center">
            Password for all demo accounts: <strong>password123</strong>
          </Typography>
        </Box>

        <Typography variant="body2" textAlign="center" mt={3}>
          Don't have an account?{' '}
          <Link component={RouterLink} to="/signup" fontWeight={600}>
            Create one
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
