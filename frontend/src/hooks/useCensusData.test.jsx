import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { useCensusData } from './useCensusData';
import { fetchAllData } from '../api/census';

jest.mock('../api/census', () => ({
  fetchAllData: jest.fn(),
}));

describe('useCensusData', () => {
  beforeEach(() => {
    fetchAllData.mockReset();
  });

  it('loads census data on mount', async () => {
    fetchAllData.mockResolvedValue([{ id: 1 }]);

    const { result } = renderHook(() => useCensusData());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual([{ id: 1 }]);
    expect(result.current.error).toBeNull();
  });

  it('falls back to empty data when loading fails', async () => {
    fetchAllData.mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useCensusData());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toMatch(/Failed to fetch census records/i);
  });
});