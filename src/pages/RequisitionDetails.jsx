import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Alert,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBackOutlined';
import SendIcon from '@mui/icons-material/SendOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FactCheckIcon from '@mui/icons-material/FactCheckOutlined';
import Inventory2Icon from '@mui/icons-material/Inventory2Outlined';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import { useData } from '../context/DataContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import StatusChip from '../components/StatusChip.jsx';
import StatusTimeline from '../components/StatusTimeline.jsx';
import ApprovalDialog from '../components/ApprovalDialog.jsx';
import IssueDialog from '../components/IssueDialog.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { findRequisition, remainingQuantity } from '../utils/calculations.js';

export default function RequisitionDetails() {
  const { requisitionId } = useParams();
  const navigate = useNavigate();
  const { requisitions, inventoryItems, dispatch, notify } = useData();
  const { currentUser } = useAuth();
  const role = currentUser?.role;

  const requisition = useMemo(() => findRequisition(requisitions, requisitionId), [requisitions, requisitionId]);

  const [approvalOpen, setApprovalOpen] = useState(false);
  const [issueOpen, setIssueOpen] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!requisition) {
    return <Alert severity="error">Requisition {requisitionId} was not found.</Alert>;
  }

  const totalRequested = requisition.items.reduce((s, it) => s + it.requestedQuantity, 0);
  const totalIssued = requisition.items.reduce((s, it) => s + (it.issuedQuantity || 0), 0);

  const canEdit = requisition.status === 'Draft' && role === 'Requester';
  const canSubmit = requisition.status === 'Draft' && role === 'Requester';
  const canApprove = requisition.status === 'Submitted' && role === 'Approver';
  const canIssue = requisition.status === 'Approved' && role === 'Issuer';
  const canRevise = requisition.status === 'Rejected' && role === 'Requester';

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} className="fade-in-up" mb={2}>
        <IconButton onClick={() => navigate('/requisitions')}>
          <ArrowBackIcon />
        </IconButton>
        <Box flexGrow={1}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Typography variant="h5">{requisition.id}</Typography>
            <StatusChip status={requisition.status} />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {requisition.department} • Requested by {requisition.requesterName}
          </Typography>
        </Box>

        {canEdit && (
          <Button startIcon={<EditIcon />} onClick={() => navigate(`/requisitions/${requisition.id}/edit`)}>
            Edit
          </Button>
        )}
        {canSubmit && (
          <Button variant="contained" startIcon={<SendIcon />} onClick={() => setConfirmSubmit(true)}>
            Submit
          </Button>
        )}
        {canEdit && (
          <Button color="error" startIcon={<DeleteIcon />} onClick={() => setConfirmDelete(true)}>
            Delete
          </Button>
        )}
        {canApprove && (
          <Button variant="contained" color="success" startIcon={<FactCheckIcon />} onClick={() => setApprovalOpen(true)}>
            Review
          </Button>
        )}
        {canIssue && (
          <Button variant="contained" color="secondary" startIcon={<Inventory2Icon />} onClick={() => setIssueOpen(true)}>
            Issue Items
          </Button>
        )}
        {canRevise && (
          <Button
            variant="outlined"
            startIcon={<RestartAltIcon />}
            onClick={() => {
              dispatch({ type: 'REVISE_REQUISITION', payload: requisition.id });
              notify('Requisition moved back to Draft for revision.', 'info');
            }}
          >
            Revise
          </Button>
        )}
      </Box>

      <Paper className="fade-in-up hover-lift" sx={{ p: 3, mb: 2.5 }}>
        <Typography variant="subtitle1" gutterBottom>
          Status Timeline
        </Typography>
        <StatusTimeline timeline={requisition.timeline} />
      </Paper>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={7}>
          <Paper className="fade-in-up hover-lift stagger-2" sx={{ p: 3, mb: 2.5 }}>
            <Typography variant="subtitle1" gutterBottom>
              Requisition Information
            </Typography>
            <Grid container spacing={1.5}>
              <InfoItem label="Requisition Number" value={requisition.id} />
              <InfoItem label="Department" value={requisition.department} />
              <InfoItem label="Requester" value={requisition.requesterName} />
              <InfoItem label="Request Date" value={requisition.requestDate} />
              <InfoItem label="Required Date" value={requisition.requiredDate} />
              <InfoItem label="Priority" value={<Chip size="small" label={requisition.priority} />} />
              <InfoItem label="Purpose" value={requisition.purpose} full />
              <InfoItem label="Remarks" value={requisition.remarks || '—'} full />
            </Grid>
          </Paper>

          <Paper className="fade-in-up hover-lift stagger-3" sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="subtitle1">Requested Items</Typography>
              <Typography variant="body2" color="text.secondary">
                Total requested: {totalRequested} {requisition.status === 'Issued' && `• Issued: ${totalIssued}`}
              </Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Requested</TableCell>
                  {requisition.status === 'Issued' && <TableCell align="right">Issued</TableCell>}
                  {requisition.status === 'Issued' && <TableCell align="right">Remaining</TableCell>}
                  <TableCell>Justification</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requisition.items.map((it) => (
                  <TableRow key={it.lineId} hover>
                    <TableCell>{it.itemName}</TableCell>
                    <TableCell>{it.category}</TableCell>
                    <TableCell align="right">
                      {it.requestedQuantity} {it.unit}
                    </TableCell>
                    {requisition.status === 'Issued' && <TableCell align="right">{it.issuedQuantity}</TableCell>}
                    {requisition.status === 'Issued' && (
                      <TableCell align="right">{remainingQuantity(it)}</TableCell>
                    )}
                    <TableCell>{it.justification}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          {requisition.approval && (
            <Paper className="fade-in-up hover-lift stagger-2" sx={{ p: 3, mb: 2.5 }}>
              <Typography variant="subtitle1" gutterBottom color="success.main">
                Approval Information
              </Typography>
              <InfoLine label="Approval Date" value={requisition.approval.date} />
              <InfoLine label="Approved By" value={requisition.approval.approvedBy} />
              <InfoLine label="Comment" value={requisition.approval.comment || '—'} />
            </Paper>
          )}

          {requisition.rejection && (
            <Paper className="fade-in-up hover-lift stagger-2" sx={{ p: 3, mb: 2.5 }}>
              <Typography variant="subtitle1" gutterBottom color="error.main">
                Rejection Information
              </Typography>
              <InfoLine label="Rejection Date" value={requisition.rejection.date} />
              <InfoLine label="Rejected By" value={requisition.rejection.rejectedBy} />
              <InfoLine label="Reason" value={requisition.rejection.reason} />
            </Paper>
          )}

          {requisition.issue && (
            <Paper className="fade-in-up hover-lift stagger-3" sx={{ p: 3 }}>
              <Typography variant="subtitle1" gutterBottom color="secondary.main">
                Issuing Information
              </Typography>
              <InfoLine label="Issue Date" value={requisition.issue.date} />
              <InfoLine label="Issued By" value={requisition.issue.issuedBy} />
              <InfoLine label="Remarks" value={requisition.issue.remarks || '—'} />
            </Paper>
          )}

          {!requisition.approval && !requisition.rejection && !requisition.issue && (
            <Paper className="fade-in-up hover-lift stagger-2" sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary">
                No approval, rejection, or issuing activity yet for this requisition.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      <ApprovalDialog
        open={approvalOpen}
        onClose={() => setApprovalOpen(false)}
        requisition={requisition}
        onApprove={(comment) => {
          dispatch({
            type: 'APPROVE_REQUISITION',
            payload: { id: requisition.id, approvedBy: currentUser?.name || 'Approver', comment }
          });
          notify(`Requisition ${requisition.id} approved.`, 'success');
          setApprovalOpen(false);
        }}
        onReject={(reason) => {
          dispatch({
            type: 'REJECT_REQUISITION',
            payload: { id: requisition.id, rejectedBy: currentUser?.name || 'Approver', reason }
          });
          notify(`Requisition ${requisition.id} rejected.`, 'warning');
          setApprovalOpen(false);
        }}
      />

      <IssueDialog
        open={issueOpen}
        onClose={() => setIssueOpen(false)}
        requisition={requisition}
        inventoryItems={inventoryItems}
        onIssue={(quantities, remarks) => {
          dispatch({
            type: 'ISSUE_REQUISITION',
            payload: { id: requisition.id, issuedBy: currentUser?.name || 'Issuing Officer', remarks, itemIssues: quantities }
          });
          notify(`Items issued for ${requisition.id}.`, 'success');
          setIssueOpen(false);
        }}
      />

      <ConfirmDialog
        open={confirmSubmit}
        title="Submit requisition?"
        message="Once submitted, this requisition will be sent for approval and can no longer be edited directly."
        confirmLabel="Submit"
        onClose={() => setConfirmSubmit(false)}
        onConfirm={() => {
          dispatch({ type: 'SUBMIT_REQUISITION', payload: requisition.id });
          notify(`Requisition ${requisition.id} submitted.`, 'success');
          setConfirmSubmit(false);
        }}
      />

      <ConfirmDialog
        open={confirmDelete}
        title="Delete requisition?"
        message="This action cannot be undone."
        confirmLabel="Delete"
        confirmColor="error"
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          dispatch({ type: 'DELETE_REQUISITION', payload: requisition.id });
          notify('Requisition deleted.', 'info');
          navigate('/requisitions');
        }}
      />
    </Box>
  );
}

function InfoItem({ label, value, full }) {
  return (
    <Grid item xs={12} sm={full ? 12 : 6}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {value}
      </Typography>
    </Grid>
  );
}

function InfoLine({ label, value }) {
  return (
    <Box mb={1}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {value}
      </Typography>
    </Box>
  );
}
