import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
  MenuItem,
  Grid
} from '@mui/material';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import { useAuth } from '../context/AuthContext.jsx';

const POSITIONS = ['Officer', 'Senior Officer', 'Manager', 'Assistant', 'Coordinator', 'Analyst', 'Store Officer'];
const ROLES = [
  { value: 'Requester', label: 'Requester — create & submit requisitions' },
  { value: 'Approver', label: 'Approver (Manager) — review, approve or reject' },
  { value: 'Issuer', label: 'Issuing Officer — issue approved items' }
];

export default function Signup() {
  const { signup, authError, departments } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    position: '',
    role: 'Requester'
  });
  const [formError, setFormError] = useState('');

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password || !form.department || !form.position) {
      setFormError('Please complete all fields.');
      return;
    }
    if (form.password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    setFormError('');
    const ok = signup({
      name: form.name,
      email: form.email,
      password: form.password,
      department: form.department,
      position: form.position,
      role: form.role
    });
    if (ok) navigate('/', { replace: true });
  };

  return (
    <Box
      className="fade-in"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #00bfa512 0%, #f4f6fb 60%)',
        p: 2
      }}
    >
      <Paper className="scale-in hover-lift" sx={{ p: 4, maxWidth: 480, width: '100%' }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <WarehouseIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h5" fontWeight={700} mt={1}>
            Create your account
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Register yourself to use the Inventory Requisition Management System
          </Typography>
        </Box>

        {(formError || authError) && (
          <Alert severity="error" className="scale-in" sx={{ mb: 2 }}>
            {formError || authError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                fullWidth
                required
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                required
                value={form.confirmPassword}
                onChange={(e) => update('confirmPassword', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                label="Department"
                fullWidth
                required
                value={form.department}
                onChange={(e) => update('department', e.target.value)}
              >
                {departments.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                label="Position"
                fullWidth
                required
                value={form.position}
                onChange={(e) => update('position', e.target.value)}
              >
                {POSITIONS.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Your role in this simulation"
                fullWidth
                required
                helperText="Determines what actions you can perform (this is a simulation, so you choose your own role)"
                value={form.role}
                onChange={(e) => update('role', e.target.value)}
              >
                {ROLES.map((r) => (
                  <MenuItem key={r.value} value={r.value}>
                    {r.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" size="large" fullWidth>
                Create Account & Continue
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Typography variant="body2" textAlign="center" mt={3}>
          Already have an account?{' '}
          <Link component={RouterLink} to="/login" fontWeight={600}>
            Log in
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
