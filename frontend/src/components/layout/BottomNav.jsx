import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import TableRowsRoundedIcon from '@mui/icons-material/TableRowsRounded';
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';

const BottomNav = ({ activeTab, onTabChange }) => {
  const navItems = [
    { icon: GridViewRoundedIcon, id: 'overview' },
    { icon: TableRowsRoundedIcon, id: 'records' },
    { icon: ShowChartRoundedIcon, id: 'trends' },
  ];

  return (
    <Box
      sx={{
        display: { xs: 'flex', md: 'none' },
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: '#1A1A1A',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        zIndex: 100,
        justifyContent: 'space-around',
        alignItems: 'center',
        pb: 'env(safe-area-inset-bottom, 0px)', // Support for iOS home bar
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <Box
            key={item.id}
            onClick={() => onTabChange(item.id)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              height: '100%',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <Icon
              sx={{
                fontSize: 24,
                color: isActive ? '#D4F53C' : 'rgba(255,255,255,0.4)',
                transition: 'color 0.2s ease',
              }}
            />
            {isActive && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '6px',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: '#D4F53C',
                }}
              />
            )}
          </Box>
        );
      })}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          height: '100%',
        }}
      >
        <Avatar
          sx={{
            width: 28,
            height: 28,
            fontSize: '0.7rem',
            fontWeight: 700,
            background: 'rgba(255,255,255,0.12)',
            color: '#FFFFFF',
            fontFamily: '"DM Sans", sans-serif',
          }}
        >
          VC
        </Avatar>
      </Box>
    </Box>
  );
};

export default BottomNav;
