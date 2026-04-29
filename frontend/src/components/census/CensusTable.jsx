import React, { useState, useEffect } from 'react';
import {
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper, 
  Typography, 
  IconButton, 
  Chip, 
  Box, 
  Skeleton, 
  Dialog, 
  DialogTitle,
  DialogContent, 
  DialogActions, 
  Button, 
  Snackbar, 
  Alert
} from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { fetchAllData, deleteVote, updateVote } from '../../api/census';
import ErrorAlert from '../common/ErrorAlert';
import CensusForm from './CensusForm';
import { formatDisplay, fromApiFormat } from '../../utils/dateUtils';
import { COLORS } from '../../theme';

const CensusTable = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modals state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  // Progress states
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await fetchAllData();
      setRecords(records || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch census records. The server might be unreachable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleRefresh = () => loadData();
    globalThis.addEventListener('dashboard-refresh', handleRefresh);
    return () => globalThis.removeEventListener('dashboard-refresh', handleRefresh);
  }, []);

  const handleDeleteConfirm = async () => {
    setActionLoading(true);
    try {
      await deleteVote(selectedRecord.id);
      setSnackbar({ open: true, message: 'Record deleted successfully', severity: 'info' });
      setDeleteModalOpen(false);
      loadData();
      globalThis.dispatchEvent(new Event('dashboard-refresh'));
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to delete record. Please try again.', severity: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubmit = async (payload, resetForm) => {
    setActionLoading(true);
    setActionError('');
    try {
      await updateVote(selectedRecord.id, payload);
      setSnackbar({ open: true, message: 'Record updated successfully', severity: 'success' });
      setEditModalOpen(false);
      loadData();
      globalThis.dispatchEvent(new Event('dashboard-refresh'));
    } catch (err) {
      console.error(err);
      setActionError('Failed to update record. Try again later.');
    } finally {
      setActionLoading(false);
    }
  };

  const openEdit = (record) => {
    const parsedDate = fromApiFormat(record.birthdate);
    setSelectedRecord({
      ...record,
      birthdate: parsedDate ? parsedDate.toISOString().split('T')[0] : '',
      is_vaccinated: record.is_vaccinated != null ? record.is_vaccinated.toString() : ''
    });
    setEditModalOpen(true);
  };

  const openDelete = (record) => {
    setSelectedRecord(record);
    setDeleteModalOpen(true);
  };

  const getGenderDotColor = (gender) => {
    const g = gender?.toLowerCase();
    if (g === 'male') return COLORS.blue;
    if (g === 'female') return COLORS.coral;
    if (g === 'other') return COLORS.amber;
    return COLORS.textMuted;
  };

  const isVaccinated = (row) =>
    row.is_vaccinated === true || row.is_vaccinated === 1 || row.is_vaccinated === 'true';

  if (error) {
    return <ErrorAlert message={error} onRetry={loadData} />;
  }

  const renderTableContent = () => {
    if (loading) {
      return Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={`skeleton-${index}`} sx={{ animation: 'fadeIn 0.3s ease both', animationDelay: `${index * 0.05}s` }}>
          <TableCell><Skeleton variant="text" width={50} /></TableCell>
          <TableCell><Skeleton variant="text" width={140} /></TableCell>
          <TableCell><Skeleton variant="text" width={70} /></TableCell>
          <TableCell><Skeleton variant="text" width={90} /></TableCell>
          <TableCell><Skeleton variant="rectangular" width={56} height={26} sx={{ borderRadius: '6px' }} /></TableCell>
          <TableCell align="right">
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Skeleton variant="circular" width={28} height={28} />
              <Skeleton variant="circular" width={28} height={28} />
            </Box>
          </TableCell>
        </TableRow>
      ));
    }

    if (records.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} align="center">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, color: COLORS.textMuted }}>
              <AssignmentLateIcon sx={{ fontSize: 56, mb: 2, opacity: 0.25, color: COLORS.textMuted }} />
              <Typography variant="h5" sx={{ mb: 1, fontFamily: '"Syne", sans-serif', color: COLORS.textPrimary, fontWeight: 700 }}>
                No records yet
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                Add your first entry using the button above.
              </Typography>
            </Box>
          </TableCell>
        </TableRow>
      );
    }

    return records.map((row, i) => (
      <TableRow
        key={row.id}
        sx={{
          animation: 'fadeUp 0.4s ease both',
          animationDelay: `${i * 0.04}s`,
          '&:hover .action-icons': {
            '& .MuiIconButton-root': {
              color: COLORS.accent,
            },
          },
        }}
      >
        <TableCell sx={{ fontFamily: '"DM Sans", sans-serif', color: COLORS.textMuted, fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
          #{ (i + 1).toString().padStart(4, '0') }
        </TableCell>
        <TableCell sx={{ fontWeight: 500, color: COLORS.textPrimary, fontSize: { xs: '0.85rem', md: '1rem' }, whiteSpace: 'nowrap' }}>{row.name}</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, whiteSpace: 'nowrap' }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: getGenderDotColor(row.gender),
                flexShrink: 0,
              }}
            />
            <Typography variant="body2" sx={{ textTransform: 'capitalize', color: COLORS.textSecond, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
              {row.gender}
            </Typography>
          </Box>
        </TableCell>
        <TableCell sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.8rem', color: COLORS.textSecond, whiteSpace: 'nowrap' }}>
          {formatDisplay(row.birthdate)}
        </TableCell>
        <TableCell>
          <Chip
            label={isVaccinated(row) ? 'Yes' : 'No'}
            size="small"
            className={isVaccinated(row) ? 'anim-pulse' : ''}
            sx={{
              background: isVaccinated(row) ? COLORS.bgDark : '#F0F0F0',
              color: isVaccinated(row) ? COLORS.accent : COLORS.textSecond,
              fontWeight: 700,
              fontSize: { xs: '0.65rem', md: '0.7rem' },
              fontFamily: '"DM Sans", sans-serif',
              border: 'none',
              letterSpacing: '0.04em',
            }}
          />
        </TableCell>
        <TableCell align="right">
          <Box className="action-icons" sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => openEdit(row)}
              sx={{
                color: COLORS.textMuted,
                transition: 'all 0.2s ease',
                '&:hover': { background: COLORS.accentDim, color: COLORS.accent },
              }}
            >
              <EditRoundedIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => openDelete(row)}
              sx={{
                color: COLORS.textMuted,
                transition: 'all 0.2s ease',
                '&:hover': { background: 'rgba(255,77,109,0.08)', color: COLORS.coral },
              }}
            >
              <DeleteRoundedIcon fontSize="small" />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ 
        borderRadius: { xs: '12px', md: '16px' }, 
        boxShadow: COLORS.shadow, 
        border: 'none',
        width: '100%',
        overflowX: 'auto',
      }}>
        <Table sx={{ minWidth: { xs: 700, md: '100%' } }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>ID</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>Name</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>Gender</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>Birth Date</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>Vaccinated</TableCell>
              <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderTableContent()}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Modal */}
      <Dialog 
        open={deleteModalOpen} 
        onClose={() => !actionLoading && setDeleteModalOpen(false)} 
        PaperProps={{ sx: { maxWidth: '400px', p: 1, borderRadius: '16px' } }}
      >
         <DialogTitle>Confirm Delete</DialogTitle>
         <DialogContent>
            <Typography>Are you sure you want to delete the record for <Typography component="span" sx={{ fontWeight: 700, color: COLORS.textPrimary }}>{selectedRecord?.name}</Typography>?</Typography>
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>This action cannot be undone.</Typography>
         </DialogContent>
         <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDeleteModalOpen(false)} disabled={actionLoading}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={actionLoading}>
               {actionLoading ? 'Deleting...' : 'Delete'}
            </Button>
         </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <Dialog 
        open={editModalOpen} 
        onClose={() => !actionLoading && setEditModalOpen(false)}
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h3" component="span" sx={{ fontSize: '1.25rem' }}>Edit Entry</Typography>
          <IconButton onClick={() => setEditModalOpen(false)} disabled={actionLoading} size="small">
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 2, borderColor: COLORS.border }}>
          {selectedRecord && editModalOpen && (
            <CensusForm 
              initialData={selectedRecord}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditModalOpen(false)}
              isLoading={actionLoading}
              serverError={actionError}
            />
          )}
        </DialogContent>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CensusTable;
