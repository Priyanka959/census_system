import React from 'react';
import { Box, Tooltip, Avatar, Drawer, IconButton } from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import TableChartRoundedIcon from '@mui/icons-material/TableChartRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import VaccinesRoundedIcon from '@mui/icons-material/VaccinesRounded';

const SIDEBAR_WIDTH = 64;

const navItems = [
  { icon: DashboardRoundedIcon, label: 'Overview', id: 'overview' },
  { icon: TableChartRoundedIcon, label: 'Records', id: 'records' },
  { icon: TimelineRoundedIcon, label: 'Trends', id: 'trends' },
];

const SidebarContent = ({ activeTab, onTabChange, onAddClick }) => (
  <Box
    sx={{
      width: SIDEBAR_WIDTH,
      height: '100%',
      minHeight: '100%',
      background: '#1A1A1A',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      py: 2,
    }}
  >
    {/* Logo */}
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: '10px',
        background: '#D4F53C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 1,
      }}
    >
      <VaccinesRoundedIcon sx={{ fontSize: 20, color: '#1A1A1A' }} />
    </Box>

    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        flex: 'auto',
        justifyContent: 'center',
      }}
    >
      {/* Add Button */}
      <Tooltip title="Add Entry" placement="right" arrow>
        <Box
          onClick={onAddClick}
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4,
            mt: 1,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              background: 'rgba(212,245,60,0.2)',
              transform: 'scale(1.1)',
            },
          }}
        >
          <AddRoundedIcon sx={{ fontSize: 20, color: '#FFFFFF' }} />
        </Box>
      </Tooltip>

      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <Tooltip key={item.id} title={item.label} placement="right" arrow>
            <Box
              onClick={() => onTabChange(item.id)}
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: isActive ? '#D4F53C' : 'transparent',
                '&:hover': {
                  background: isActive ? '#D4F53C' : 'rgba(255,255,255,0.08)',
                  transform: 'scale(1.08)',
                },
              }}
            >
              <Icon
                sx={{
                  fontSize: 20,
                  color: isActive ? '#1A1A1A' : 'rgba(255,255,255,0.5)',
                  transition: 'color 0.2s ease',
                }}
              />
            </Box>
          </Tooltip>
        );
      })}
    </Box>

    {/* Avatar at bottom */}
    <Avatar
      sx={{
        width: 32,
        height: 32,
        fontSize: '0.75rem',
        fontWeight: 700,
        background: 'rgba(255,255,255,0.12)',
        color: '#FFFFFF',
        fontFamily: '"DM Sans", sans-serif',
        mt: 'auto',
      }}
    >
      VC
    </Avatar>
  </Box>
);

const Sidebar = ({ activeTab, onTabChange, onAddClick }) => {
  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'block' },
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1200,
        background: '#1A1A1A',
      }}
    >
      <SidebarContent activeTab={activeTab} onTabChange={onTabChange} onAddClick={onAddClick} />
    </Box>
  );
};

export { SIDEBAR_WIDTH };
export default Sidebar;
