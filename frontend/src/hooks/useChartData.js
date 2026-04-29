import { useState, useCallback, useEffect } from 'react';
import { fetchCounts, fetchResults } from '../api/census';
import { buildLineChartData, buildBarChartData } from '../utils/chartHelpers';

export const useChartData = () => {
  const [lineData, setLineData] = useState(null);
  const [barData, setBarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [vaxData, unvaxData, resultsData] = await Promise.all([
        fetchCounts(true),   // ✅ returns array
        fetchCounts(false),  // ✅ returns array
        fetchResults()       // ✅ returns array
      ]);

      setLineData(buildLineChartData(vaxData || [], unvaxData || []));
      setBarData(buildBarChartData(resultsData || []));
    } catch (err) {
      console.error(err);
      setError('Failed to load chart data.');
      setLineData(null);
      setBarData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();

    const handler = () => refetch();
    globalThis.addEventListener('dashboard-refresh', handler);

    return () => globalThis.removeEventListener('dashboard-refresh', handler);
  }, [refetch]);

  return { lineData, barData, loading, error, refetch };
};