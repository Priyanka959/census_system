import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Snackbar, 
  Alert, 
  IconButton, 
  Typography,
  Box,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CensusForm from './CensusForm';
import { submitVote } from '../../api/census';

const AddEntryModal = ({ open, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleCloseAttempt = () => {
    if (isDirty) {
      setShowConfirm(true);
    } else {
      handleForceClose();
    }
  };

  const handleForceClose = () => {
    setShowConfirm(false);
    setServerError('');
    setIsDirty(false);
    onClose();
  };

  const handleFormSubmit = async (payload, resetForm) => {
    setIsLoading(true);
    setServerError('');
    try {
      await submitVote(payload);
      setSnackbar({ open: true, message: 'Record added successfully', severity: 'success' });
      resetForm();
      setIsDirty(false);
      
      // Need a slight delay so they can see success before modal unmounts
      setTimeout(() => {
        handleForceClose();
        // Option to pass a callback on DashboardPage to force reloading of charts/tables
        window.dispatchEvent(new Event('dashboard-refresh'));
      }, 800);
      
    } catch (err) {
      if (err.response?.status === 409) {
        setServerError('This record already exists. Please verify details.');
      } else {
        setServerError('Something went wrong. Try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={(_, reason) => {
          if (reason !== 'backdropClick') handleCloseAttempt();
        }}
        maxWidth="sm"
        fullWidth
        fullScreen={fullScreen}
        disableEscapeKeyDown
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h3" component="span" sx={{ fontSize: '1.25rem' }}>Add New Entry</Typography>
          <IconButton onClick={handleCloseAttempt} disabled={isLoading} size="small" sx={{ display: { sm: 'none' } }}>
            <CloseIcon />
          </IconButton>
          <IconButton onClick={handleCloseAttempt} disabled={isLoading} size="small" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers sx={{ pt: 2 }}>
          {showConfirm ? (
            <Box sx={{ py: 3, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Discard unsaved changes?
              </Typography>
              <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary' }}>
                You have entered data that will be lost if you close this modal.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button variant="outlined" onClick={() => setShowConfirm(false)}>
                  Go Back
                </Button>
                <Button variant="contained" color="error" onClick={handleForceClose}>
                  Discard
                </Button>
              </Box>
            </Box>
          ) : (
            <CensusForm 
              onSubmit={handleFormSubmit}
              onCancel={handleCloseAttempt}
              isLoading={isLoading}
              serverError={serverError}
              onDirtyChange={setIsDirty}
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

export default AddEntryModal;
