import { describe, expect, it } from '@jest/globals';
import { formatDisplay, toApiFormat, fromApiFormat } from './dateUtils';

describe('dateUtils', () => {
  it('formats API dates for display', () => {
    expect(formatDisplay('2024-04-29T00:00:00.000Z')).toBe('29-04-2024');
  });

  it('returns fallback for empty or invalid values', () => {
    expect(formatDisplay('')).toBe('--');
    expect(toApiFormat('invalid')).toBeNull();
    expect(fromApiFormat('')).toBeNull();
  });

  it('parses DD-MM-YYYY values', () => {
    const parsed = fromApiFormat('29-04-2000');
    expect(parsed).toBeInstanceOf(Date);
    expect(parsed.getFullYear()).toBe(2000);
    expect(parsed.getMonth()).toBe(3);
    expect(parsed.getDate()).toBe(29);
  });
});