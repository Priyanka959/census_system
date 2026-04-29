import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { useChartData } from './useChartData';
import { fetchCounts, fetchResults } from '../api/census';
import { buildLineChartData, buildBarChartData } from '../utils/chartHelpers';

jest.mock('../api/census', () => ({
  fetchCounts: jest.fn(),
  fetchResults: jest.fn(),
}));

jest.mock('../utils/chartHelpers', () => ({
  buildLineChartData: jest.fn(),
  buildBarChartData: jest.fn(),
}));

describe('useChartData', () => {
  beforeEach(() => {
    fetchCounts.mockReset();
    fetchResults.mockReset();
    buildLineChartData.mockReset();
    buildBarChartData.mockReset();
  });

  it('loads and formats chart data', async () => {
    fetchCounts.mockResolvedValueOnce([{ age: 10, count: 1 }]);
    fetchCounts.mockResolvedValueOnce([{ age: 10, count: 2 }]);
    fetchResults.mockResolvedValue([{ age: 10, gender: 'male', count: 3 }]);
    buildLineChartData.mockReturnValue({ line: true });
    buildBarChartData.mockReturnValue({ bar: true });

    const { result } = renderHook(() => useChartData());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.lineData).toEqual({ line: true });
    expect(result.current.barData).toEqual({ bar: true });
    expect(result.current.error).toBeNull();
  });

  it('captures load errors', async () => {
    fetchCounts.mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useChartData());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.lineData).toBeNull();
    expect(result.current.barData).toBeNull();
    expect(result.current.error).toMatch(/Failed to load chart data/i);
  });
});