import {formatMoney, isValidISODate, monthKey} from '../src/utils/format';

describe('formatMoney', () => {
  it('formats positive amounts with the given symbol and 2 decimals', () => {
    expect(formatMoney(1234.5, '₦')).toBe('₦1,234.50');
  });

  it('formats negative amounts with a leading minus before the symbol', () => {
    expect(formatMoney(-50, '$')).toBe('-$50.00');
  });
});

describe('isValidISODate', () => {
  it('accepts a well-formed date', () => {
    expect(isValidISODate('2026-09-30')).toBe(true);
  });

  it('rejects malformed input', () => {
    expect(isValidISODate('30-09-2026')).toBe(false);
    expect(isValidISODate('not-a-date')).toBe(false);
  });
});

describe('monthKey', () => {
  it('extracts the yyyy-mm portion of an ISO date', () => {
    expect(monthKey('2026-09-30')).toBe('2026-09');
  });
});
