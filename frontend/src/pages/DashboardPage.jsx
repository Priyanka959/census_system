import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, IconButton } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import Sidebar, { SIDEBAR_WIDTH } from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import BottomNav from '../components/layout/BottomNav';
import CensusTable from '../components/census/CensusTable';
import VaccinationLineChart from '../components/charts/VaccinationLineChart';
import GenderBarChart from '../components/charts/GenderBarChart';
import AddEntryModal from '../components/census/AddEntryModal';
import { fetchAllData } from '../api/census';
import { calculateDashboardStats } from '../utils/dashboardStats';
import { COLORS } from '../theme';

// ─── Animated Number (count-up) ───
const AnimatedNumber = ({ target, duration = 1500, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (typeof target !== 'number') return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 5);
      setCount(Math.floor(easeOut * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    window.requestAnimationFrame(step);
  }, [target, duration]);

  if (typeof target !== 'number')
    return (
      <span>
        {target}
        {suffix}
      </span>
    );
  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

// ─── Tab Pill ───
const TabPill = ({ label, active, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      px: { xs: 1, md: 2.5 },
      py: 0.8,
      borderRadius: '50px',
      cursor: 'pointer',
      fontFamily: '"DM Sans", sans-serif',
      fontSize: { xs: '12px', md: '0.85rem' },
      fontWeight: 600,
      transition: 'all 0.25s ease',
      background: active ? COLORS.bgDark : 'transparent',
      color: active ? '#FFFFFF' : COLORS.textMuted,
      flex: { xs: 1, md: 'none' },
      textAlign: 'center',
      minWidth: 'fit-content',
      whiteSpace: 'nowrap',
      '&:hover': {
        background: active ? COLORS.bgDark : 'rgba(0,0,0,0.04)',
        color: active ? '#FFFFFF' : COLORS.textPrimary,
      },
    }}
  >
    {label}
  </Box>
);

// ─── KPI Stat Card ───
const StatCard = ({
  value,
  label,
  suffix = '',
  index = 0,
  isText = false,
  fullWidthSm = false,
}) => (
  <Card
    className={`anim-fade-up anim-fade-up-${index + 1}`}
    sx={{
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      gridColumn: fullWidthSm ? { xs: '1', sm: '1 / -1', md: 'auto' } : 'auto',
      '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: COLORS.shadowHover,
      },
    }}
  >
    {/* Left accent bar */}
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '4px',
        background: COLORS.accent,
        borderRadius: '4px 0 0 4px',
      }}
    />
    <CardContent sx={{ pl: { xs: 2.5, md: 3, lg: 3.5 }, pb: '20px !important' }}>
      <Typography
        sx={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: { xs: '32px', sm: '36px', md: '42px', lg: '48px' },
          fontWeight: 700,
          color: COLORS.textPrimary,
          lineHeight: 1.1,
          mb: 0.5,
        }}
      >
        {isText ? value : <AnimatedNumber target={value} suffix={suffix} />}
      </Typography>
      <Typography
        sx={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: { xs: '9px', md: '10px' },
          color: COLORS.textMuted,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontWeight: 500,
        }}
      >
        {label}
      </Typography>
    </CardContent>
  </Card>
);

const DashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    total: 0,
    vaccinatedPercent: 0,
    topAgeGroup: '--',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAllData();
        if (!Array.isArray(data)) return;

        setStats(calculateDashboardStats(data));
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    };

    loadData();

    const handler = () => loadData();
    globalThis.addEventListener('dashboard-refresh', handler);
    return () => globalThis.removeEventListener('dashboard-refresh', handler);
  }, []);

  // Determine which content sections to show
  const showOverview = activeTab === 'overview';
  const showRecords = activeTab === 'overview' || activeTab === 'records';
  const showTrends = activeTab === 'overview' || activeTab === 'trends';

  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh', background: 'transparent' }}>
      <Navbar onAddClick={() => setIsModalOpen(true)} />
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onAddClick={() => setIsModalOpen(true)}
        />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` },
          width: { xs: '100%', md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
          flexGrow: 1,
          minWidth: 0,
          boxSizing: 'border-box',
          px: { xs: 2, md: 5 },
          pt: { xs: '72px', sm: '76px', md: 4 }, // Accounting for app bar on xs/sm
          pb: { xs: '80px', md: 4 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header Row */}
        <Box
          sx={{
            pt: '4px',
            pb: '16px',
            position: 'relative',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: { xs: 2, sm: 0 },
            animation: 'fadeSlideUp 0.5s ease forwards',
            '@keyframes fadeSlideUp': {
              from: { opacity: 0, transform: 'translateY(20px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box>
              {/* MAIN TITLE */}
              <Typography
                sx={{
                  fontFamily: '"Orbitron", sans-serif',
                  fontWeight: 900,
                  fontSize: {
                    xs: 'clamp(20px, 6vw, 26px)',
                    sm: 'clamp(24px, 5vw, 32px)',
                    md: 'clamp(28px, 4vw, 38px)',
                    lg: 'clamp(32px, 3vw, 48px)',
                  },
                  color: '#111111',
                  lineHeight: 1.05,
                  letterSpacing: '-0.02em',
                  margin: 0,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <Box component="span">
                  <Box
                    component="span"
                    sx={{ borderBottom: '3px solid #D4F53C', paddingBottom: '2px' }}
                  >
                    Vax
                  </Box>
                  <Box component="span">Census</Box>
                </Box>
                <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
                  Dashboard
                </Box>
              </Typography>

              {/* SUBTITLE */}
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '14px',
                  color: '#888888',
                  fontWeight: 400,
                  mt: '8px',
                }}
              >
                Managing your census and workflows
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddRoundedIcon />}
            onClick={() => setIsModalOpen(true)}
            sx={{
              display: { xs: 'none', md: 'flex' },
              borderRadius: '50px',
              px: 3,
              py: 1,
              background: COLORS.bgDark,
              color: '#FFFFFF',
              fontWeight: 600,
              minHeight: '44px',
              mt: 1,
              '&:hover': {
                background: COLORS.accent,
                color: COLORS.textPrimary,
                transform: 'translateY(-2px)',
                boxShadow: COLORS.shadowHover,
              },
            }}
          >
            Add Entry
          </Button>
        </Box>

        {/* DIVIDER */}
        <Box
          sx={{
            background: 'linear-gradient(90deg, #D4F53C44, #D4F53C11, transparent)',
            height: '1px',
            mb: '28px',
            animation: 'fadeSlideUp 0.5s ease 0.3s forwards',
            opacity: 0,
          }}
        />

        {/* Tab Bar */}
        <Box
          className="anim-fade-up anim-fade-up-1"
          sx={{
            display: 'flex',
            gap: 0.5,
            mb: 4,
            background: '#FFFFFF',
            borderRadius: '50px',
            p: 0.5,
            width: { xs: '100%', md: 'fit-content' },
            boxShadow: COLORS.shadow,
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <TabPill
            label="Overview"
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          />
          <TabPill
            label="Records"
            active={activeTab === 'records'}
            onClick={() => setActiveTab('records')}
          />
          <TabPill
            label="Trends"
            active={activeTab === 'trends'}
            onClick={() => setActiveTab('trends')}
          />
        </Box>

        {/* KPI Stats */}
        {showOverview && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: { xs: 2, sm: 2, md: 3 },
              mb: 4,
            }}
          >
            <StatCard value={stats.total} label="Total Records" index={0} />
            <StatCard value={stats.vaccinatedPercent} label="Vaccinated" suffix="%" index={1} />
            <StatCard
              value={stats.topAgeGroup}
              label="Most Common Age"
              index={2}
              isText
              fullWidthSm
            />
          </Box>
        )}

        {/* Table Section */}
        {showRecords && (
          <Box className="anim-fade-up anim-fade-up-4" sx={{ mb: 4, overflowX: 'auto' }}>
            <CensusTable />
          </Box>
        )}

        {/* Charts Section */}
        {showTrends && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3,
              mb: 4,
            }}
          >
            <Box className="anim-scale-in anim-fade-up-5">
              <Card
                sx={{
                  height: '100%',
                  background: COLORS.bgDark,
                  borderRadius: '16px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                  overflow: 'hidden',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: { xs: '16px', md: '18px', lg: '20px' },
                      color: '#FFFFFF',
                      fontWeight: 700,
                      mb: 2,
                    }}
                  >
                    Vaccination Trends
                  </Typography>
                  <VaccinationLineChart />
                </CardContent>
              </Card>
            </Box>

            <Box className="anim-scale-in anim-fade-up-6">
              <Card
                sx={{
                  height: '100%',
                  background: COLORS.bgDark,
                  borderRadius: '16px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                  overflow: 'hidden',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: { xs: '16px', md: '18px', lg: '20px' },
                      color: '#FFFFFF',
                      fontWeight: 700,
                      mb: 2,
                    }}
                  >
                    Demographics
                  </Typography>
                  <GenderBarChart />
                </CardContent>
              </Card>
            </Box>
          </Box>
        )}
      </Box>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <AddEntryModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Box>
  );
};

export default DashboardPage;
