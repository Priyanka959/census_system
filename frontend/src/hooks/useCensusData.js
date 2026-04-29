import { useState, useCallback, useEffect } from 'react';
import { fetchAllData } from '../api/census';

export const useCensusData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchAllData(); // ✅ returns array
      setData(result || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch census records. The server might be unreachable.');
      setData([]); // ✅ fallback safety
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

  return { data, loading, error, refetch };
};