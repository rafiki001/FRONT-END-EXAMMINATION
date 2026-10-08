import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Tooltip,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Chip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/NotificationsNoneOutlined';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import { DRAWER_WIDTH } from './Sidebar.jsx';
import { useData } from '../../context/DataContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { pendingApprovals } from '../../utils/calculations.js';

const ROLE_COLOR = {
  Requester: 'primary',
  Approver: 'success',
  Issuer: 'secondary'
};

function initials(name = '') {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function Topbar({ onMenuClick }) {
  const { requisitions } = useData();
  const { currentUser, logout } = useAuth();
  const pending = pendingApprovals(requisitions).length;
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { md: `${DRAWER_WIDTH}px` },
        bgcolor: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(10px)',
        color: 'text.primary',
        borderBottom: '1px solid #ecedf3',
        transition: 'box-shadow 0.3s ease'
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <IconButton edge="start" onClick={onMenuClick} sx={{ display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }} noWrap>
          Inventory Requisition Management System
        </Typography>

        <Tooltip title="Pending approvals">
          <IconButton>
            <Badge badgeContent={pending} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {currentUser && (
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label={currentUser.role}
              color={ROLE_COLOR[currentUser.role] || 'default'}
              size="small"
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            />
            <Tooltip title="Account menu">
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.4 }}>
                <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 14 }}>
                  {initials(currentUser.name)}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
              <Box px={2} py={1}>
                <Typography variant="subtitle2" fontWeight={700}>
                  {currentUser.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {currentUser.email}
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  {currentUser.department} • {currentUser.position}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={logout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Log Out
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
