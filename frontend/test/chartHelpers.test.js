import { describe, expect, it } from '@jest/globals';
import { buildLineChartData, buildBarChartData } from '../src/utils/chartHelpers';

describe('chartHelpers', () => {
  it('builds line chart datasets from age buckets', () => {
    const result = buildLineChartData(
      [{ age: 10, count: 2 }, { age: 20, count: 4 }],
      [{ age: 20, count: 1 }, { age: 30, count: 3 }]
    );

    expect(result.labels).toEqual([10, 20, 30]);
    expect(result.datasets[0].data).toEqual([2, 4, 0]);
    expect(result.datasets[1].data).toEqual([0, 1, 3]);
  });

  it('builds bar chart datasets from age and gender buckets', () => {
    const result = buildBarChartData([
      { age: 18, gender: 'male', count: 2 },
      { age: 18, gender: 'female', count: 1 },
      { age: 22, gender: 'other', count: 5 },
    ]);

    expect(result.labels).toEqual([18, 22]);
    expect(result.datasets[0].data).toEqual([2, 0]);
    expect(result.datasets[1].data).toEqual([1, 0]);
    expect(result.datasets[2].data).toEqual([0, 5]);
  });
});
