import { describe, expect, it } from '@jest/globals';
import { calculateDashboardStats } from '../src/utils/dashboardStats';

describe('dashboardStats', () => {
  it('calculates totals and percentages', () => {
    const people = [
      { is_vaccinated: true, birthdate: '2000-01-01' },
      { is_vaccinated: false, birthdate: '1990-01-01' },
    ];

    const stats = calculateDashboardStats(people);

    expect(stats.total).toBe(2);
    expect(stats.vaccinatedPercent).toBe('50%');
  });
});
