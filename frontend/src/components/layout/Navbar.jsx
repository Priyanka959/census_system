import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import VaccinesRoundedIcon from '@mui/icons-material/VaccinesRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { COLORS } from '../../theme';

const Navbar = ({ onAddClick }) => {
  return (
    <Box
      sx={{
        display: { xs: 'flex', md: 'none' },
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '56px',
        px: 2,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E2E4DF',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            background: '#D4F53C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <VaccinesRoundedIcon sx={{ fontSize: 18, color: '#1A1A1A' }} />
        </Box>
        <Typography
          sx={{
            fontFamily: '"Orbitron", sans-serif',
            fontSize: '16px',
            fontWeight: 800,
            color: '#111111',
            letterSpacing: '-0.02em',
          }}
        >
          VaxCensus
        </Typography>
      </Box>

      <IconButton
        onClick={onAddClick}
        sx={{
          background: COLORS.bgDark,
          color: '#FFFFFF',
          minWidth: '44px',
          minHeight: '44px',
          p: '10px',
          '&:hover': {
            background: '#333333',
          },
        }}
      >
        <AddRoundedIcon sx={{ fontSize: 20 }} />
      </IconButton>
    </Box>
  );
};

export default Navbar;
