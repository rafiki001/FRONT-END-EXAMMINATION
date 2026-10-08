import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/DashboardOutlined';
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import AddCircleIcon from '@mui/icons-material/AddCircleOutlined';
import Inventory2Icon from '@mui/icons-material/Inventory2Outlined';
import AssessmentIcon from '@mui/icons-material/AssessmentOutlined';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import { useAuth } from '../../context/AuthContext.jsx';

export const DRAWER_WIDTH = 250;

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { label: 'Requisitions', path: '/requisitions', icon: <AssignmentIcon /> },
  { label: 'Create Requisition', path: '/requisitions/new', icon: <AddCircleIcon />, requesterOnly: true },
  { label: 'Inventory Items', path: '/inventory', icon: <Inventory2Icon /> },
  { label: 'Reports', path: '/reports', icon: <AssessmentIcon /> }
];

export default function Sidebar({ mobileOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const visibleItems = NAV_ITEMS.filter((i) => !i.requesterOnly || currentUser?.role === 'Requester');

  const content = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar>
        <Box display="flex" alignItems="center" gap={1}>
          <WarehouseIcon sx={{ color: 'primary.main' }} />
          <Typography variant="subtitle1" fontWeight={700} color="primary.dark" noWrap>
            IRMS
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1, pt: 1 }}>
        {visibleItems.map((item, idx) => {
          const selected =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path) &&
                !(item.path === '/requisitions' && location.pathname.startsWith('/requisitions/new'));
          return (
            <ListItemButton
              key={item.path}
              selected={selected}
              onClick={() => {
                navigate(item.path);
                onClose && onClose();
              }}
              className="float-in"
              style={{ animationDelay: `${idx * 0.05}s` }}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                transition: 'all 0.25s ease',
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: '#fff',
                  '& .MuiListItemIcon-root': { color: '#fff' },
                  '&:hover': { bgcolor: 'primary.dark' }
                },
                '&:hover': { transform: 'translateX(4px)' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 38 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
      <Box flexGrow={1} />
      <Divider />
      <Box p={2}>
        <Typography variant="caption" color="text.secondary">
          Frontend simulation — data stored locally in your browser.
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', bgcolor: '#fff' }
        }}
        open
      >
        {content}
      </Drawer>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' }
        }}
      >
        {content}
      </Drawer>
    </>
  );
}
