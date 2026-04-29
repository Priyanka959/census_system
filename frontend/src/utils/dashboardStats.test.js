import { describe, expect, it } from '@jest/globals';
import { calculateDashboardStats } from './dashboardStats';

describe('calculateDashboardStats', () => {
  it('returns defaults for missing data', () => {
    expect(calculateDashboardStats(null)).toEqual({
      total: 0,
      vaccinatedPercent: 0,
      topAgeGroup: '--',
    });
  });

  it('computes totals, vaccination percentage, and the dominant age group', () => {
    const result = calculateDashboardStats([
      { is_vaccinated: true, age: 20 },
      { is_vaccinated: false, age: 32 },
      { is_vaccinated: true, birthdate: '2000-04-29T00:00:00.000Z' },
    ]);

    expect(result.total).toBe(3);
    expect(result.vaccinatedPercent).toBe(67);
    expect(result.topAgeGroup).toBe('18-35');
  });
});