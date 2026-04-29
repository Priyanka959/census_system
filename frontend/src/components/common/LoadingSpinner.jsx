import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100%',
        width: '100%',
        flexGrow: 1,
        py: 8,
      }}
    >
      <CircularProgress
        size={48}
        thickness={4}
        sx={{
          color: 'primary.main',
          filter: 'drop-shadow(0 0 8px rgba(0, 229, 160, 0.4))',
        }}
      />
    </Box>
  );
};

export default LoadingSpinner;
