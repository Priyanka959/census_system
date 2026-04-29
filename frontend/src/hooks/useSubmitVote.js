import { useState } from 'react';
import { submitVote } from '../api/census';

export const useSubmitVote = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submit = async (payload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await submitVote(payload); // ✅ no unwrap needed here
      setSuccess(true);

      // ✅ trigger dashboard refresh globally
      globalThis.dispatchEvent(new Event('dashboard-refresh'));

      return true;
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.error || 'Failed to submit vote. Try again later.');

      return false;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  return { submit, loading, error, success, reset };
};
