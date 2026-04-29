import React, { useState, useEffect } from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { fetchCounts } from '../../api/census';
import { buildLineChartData } from '../../utils/chartHelpers';
import ErrorAlert from '../common/ErrorAlert';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const VaccinationLineChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [vaxRes, unvaxRes] = await Promise.all([fetchCounts(true), fetchCounts(false)]);

      // fetchCounts already returns the unwrapped data array
      const formattedData = buildLineChartData(vaxRes || [], unvaxRes || []);
      setChartData(formattedData);
    } catch (err) {
      console.error(err);
      setError('Failed to load age distribution chart.');
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

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        align: 'start',
        labels: {
          color: 'rgba(255,255,255,0.7)',
          font: {
            family: '"DM Sans", sans-serif',
            size: 12,
            weight: '500',
          },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          boxWidth: 8,
          boxHeight: 8,
        },
      },
      tooltip: {
        backgroundColor: '#1A1A1A',
        titleColor: '#FFFFFF',
        bodyColor: 'rgba(255,255,255,0.7)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        cornerRadius: 8,
        titleFont: { family: '"DM Sans", sans-serif', weight: '600' },
        bodyFont: { family: '"DM Sans", sans-serif', size: 12 },
        callbacks: {
          title: (context) => `Age: ${context[0].label}`,
          label: (context) => ` ${context.dataset.label}: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Age',
          color: 'rgba(255,255,255,0.4)',
          font: { family: '"DM Sans", sans-serif', size: 11 },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.06)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255,255,255,0.5)',
          font: {
            family: '"DM Sans", sans-serif',
            size: 11,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of People',
          color: 'rgba(255,255,255,0.4)',
          font: { family: '"DM Sans", sans-serif', size: 11 },
        },
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.06)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255,255,255,0.5)',
          stepSize: 1,
          precision: 0,
          font: {
            family: '"DM Sans", sans-serif',
            size: 11,
          },
        },
      },
    },
  };

  options.maintainAspectRatio = false;

  if (error) {
    return <ErrorAlert message={error} onRetry={loadData} />;
  }

  if (loading) {
    return (
      <Skeleton
        variant="rectangular"
        width="100%"
        height={280}
        sx={{ borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }}
      />
    );
  }

  if (!chartData) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 280,
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '12px',
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: 'rgba(255,255,255,0.4)', fontFamily: '"DM Sans", sans-serif' }}
        >
          Not enough data to display chart yet
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: { xs: 220, md: 280 },
        position: 'relative',
        background: '#242424',
        borderRadius: '12px',
        p: 2,
      }}
    >
      <Line data={chartData} options={options} />
    </Box>
  );
};

export default VaccinationLineChart;
