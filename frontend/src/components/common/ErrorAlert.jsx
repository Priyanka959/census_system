import React from 'react';
import { Alert, AlertTitle, Button, Box } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';

const ErrorAlert = ({ message, onRetry }) => (
  <Box sx={{ width: '100%', py: 4, display: 'flex', justifyContent: 'center' }}>
    <Alert
      severity="error"
      sx={{
        background: 'rgba(255, 77, 109, 0.06)',
        border: '1px solid rgba(255, 77, 109, 0.2)',
        color: '#111111',
        borderRadius: '12px',
        alignItems: 'center',
        maxWidth: '500px',
        width: '100%',
      }}
      action={
        onRetry ? (
          <Button
            color="error"
            size="small"
            onClick={onRetry}
            startIcon={<ReplayIcon />}
            sx={{ fontWeight: 600, mt: { xs: 1, sm: 0 }, borderRadius: '50px' }}
          >
            Retry
          </Button>
        ) : null
      }
    >
      <AlertTitle sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, color: '#FF4D6D' }}>
        Error
      </AlertTitle>
      {message || 'An unexpected error occurred. Please try again.'}
    </Alert>
  </Box>
);

export default ErrorAlert;
