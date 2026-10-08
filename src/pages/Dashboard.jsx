import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import EditNoteIcon from '@mui/icons-material/EditNoteOutlined';
import SendIcon from '@mui/icons-material/SendOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import Inventory2Icon from '@mui/icons-material/Inventory2Outlined';
import HourglassIcon from '@mui/icons-material/HourglassBottomOutlined';
import NumbersIcon from '@mui/icons-material/Numbers';

import { useData } from '../context/DataContext.jsx';
import SummaryCard from '../components/SummaryCard.jsx';
import StatusChip from '../components/StatusChip.jsx';
import {
  countByStatus,
  totalItemsRequested,
  requisitionsByStatus,
  requisitionsByDepartment,
  monthlyTrend,
  recentRequisitions,
  pendingApprovals,
  recentlyIssued,
  rejectedRequests
} from '../utils/calculations.js';

const STATUS_COLORS = {
  Draft: '#9e9e9e',
  Submitted: '#0288d1',
  Approved: '#2e7d32',
  Rejected: '#d32f2f',
  Issued: '#00bfa5'
};

export default function Dashboard() {
  const { requisitions, departments } = useData();
  const navigate = useNavigate();

  const stats = useMemo(
    () => ({
      total: requisitions.length,
      draft: countByStatus(requisitions, 'Draft'),
      submitted: countByStatus(requisitions, 'Submitted'),
      approved: countByStatus(requisitions, 'Approved'),
      rejected: countByStatus(requisitions, 'Rejected'),
      issued: countByStatus(requisitions, 'Issued'),
      pending: pendingApprovals(requisitions).length,
      itemsRequested: totalItemsRequested(requisitions)
    }),
    [requisitions]
  );

  const statusData = useMemo(() => requisitionsByStatus(requisitions), [requisitions]);
  const deptData = useMemo(() => requisitionsByDepartment(requisitions, departments), [requisitions, departments]);
  const trendData = useMemo(() => monthlyTrend(requisitions), [requisitions]);
  const recent = useMemo(() => recentRequisitions(requisitions, 5), [requisitions]);
  const pending = useMemo(() => pendingApprovals(requisitions).slice(0, 5), [requisitions]);
  const issued = useMemo(() => recentlyIssued(requisitions, 5), [requisitions]);
  const rejected = useMemo(() => rejectedRequests(requisitions).slice(0, 5), [requisitions]);

  const deptSummary = useMemo(
    () => [...deptData].sort((a, b) => b.count - a.count),
    [deptData]
  );

  const cards = [
    { title: 'Total Requisitions', value: stats.total, icon: <AssignmentIcon />, color: '#3f51b5' },
    { title: 'Draft', value: stats.draft, icon: <EditNoteIcon />, color: '#757575' },
    { title: 'Submitted', value: stats.submitted, icon: <SendIcon />, color: '#0288d1' },
    { title: 'Approved', value: stats.approved, icon: <CheckCircleIcon />, color: '#2e7d32' },
    { title: 'Rejected', value: stats.rejected, icon: <CancelIcon />, color: '#d32f2f' },
    { title: 'Issued', value: stats.issued, icon: <Inventory2Icon />, color: '#00bfa5' },
    { title: 'Pending Approval', value: stats.pending, icon: <HourglassIcon />, color: '#ed6c02' },
    { title: 'Total Items Requested', value: stats.itemsRequested, icon: <NumbersIcon />, color: '#6a1b9a' }
  ];

  return (
    <Box>
      <Typography variant="h5" className="fade-in-up" gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="body2" color="text.secondary" className="fade-in-up" sx={{ mb: 3 }}>
        A live snapshot of requisition activity, calculated directly from stored data.
      </Typography>

      <Grid container spacing={2.5}>
        {cards.map((c, idx) => (
          <Grid item xs={12} sm={6} md={3} key={c.title}>
            <SummaryCard {...c} delayIndex={idx} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
        <Grid item xs={12} md={4}>
          <Card className="fade-in-up hover-lift">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Requisitions by Status
              </Typography>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    animationDuration={900}
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className="fade-in-up hover-lift stagger-2">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Requisitions by Department
              </Typography>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={deptData} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="department" tick={{ fontSize: 10 }} interval={0} angle={-25} textAnchor="end" height={60} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3f51b5" radius={[6, 6, 0, 0]} animationDuration={900} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className="fade-in-up hover-lift stagger-3">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Monthly Requisition Trend
              </Typography>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#00bfa5"
                    fill="#00bfa533"
                    strokeWidth={2.5}
                    animationDuration={900}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
        <Grid item xs={12} md={6}>
          <ActivityList
            title="Recent Requisitions"
            items={recent}
            onClick={(r) => navigate(`/requisitions/${r.id}`)}
            renderSecondary={(r) => `${r.department} • ${r.requestDate}`}
            delay={1}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ActivityList
            title="Pending Approvals"
            items={pending}
            onClick={(r) => navigate(`/requisitions/${r.id}`)}
            renderSecondary={(r) => `${r.department} • ${r.items.length} item(s)`}
            delay={2}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ActivityList
            title="Recently Issued Items"
            items={issued}
            onClick={(r) => navigate(`/requisitions/${r.id}`)}
            renderSecondary={(r) => `Issued on ${r.issue?.date} by ${r.issue?.issuedBy}`}
            delay={3}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ActivityList
            title="Rejected Requests"
            items={rejected}
            onClick={(r) => navigate(`/requisitions/${r.id}`)}
            renderSecondary={(r) => r.rejection?.reason}
            delay={4}
          />
        </Grid>
      </Grid>

      <Card className="fade-in-up hover-lift" sx={{ mt: 2.5 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Department Request Summary
          </Typography>
          <Grid container spacing={2}>
            {deptSummary.map((d, idx) => (
              <Grid item xs={12} sm={6} md={3} key={d.department}>
                <Paper
                  variant="outlined"
                  className="scale-in"
                  style={{ animationDelay: `${idx * 0.06}s` }}
                  sx={{ p: 2, borderRadius: 3 }}
                >
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {d.department}
                  </Typography>
                  <Typography variant="h6">{d.count} requisitions</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

function ActivityList({ title, items, onClick, renderSecondary, delay = 0 }) {
  return (
    <Card className={`fade-in-up hover-lift stagger-${delay}`} sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          {title}
        </Typography>
        {items.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            Nothing to show right now.
          </Typography>
        ) : (
          <List dense disablePadding>
            {items.map((r, idx) => (
              <React.Fragment key={r.id}>
                <ListItem
                  button
                  onClick={() => onClick(r)}
                  className="float-in"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                  sx={{ borderRadius: 2, transition: 'background 0.2s ease' }}
                >
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography fontWeight={600} variant="body2">
                          {r.id}
                        </Typography>
                        <StatusChip status={r.status} />
                      </Box>
                    }
                    secondary={renderSecondary(r)}
                  />
                </ListItem>
                {idx < items.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
