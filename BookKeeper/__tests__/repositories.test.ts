import {computeContactBalance} from '../src/database/repositories';
import type {LedgerEntry} from '../src/types/models';

function entry(overrides: Partial<LedgerEntry>): LedgerEntry {
  return {
    id: Math.random().toString(),
    contactId: 'c1',
    kind: 'charge',
    amount: 0,
    date: '2026-01-01',
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('computeContactBalance', () => {
  it('returns 0 for a contact with no entries', () => {
    expect(computeContactBalance([], 'c1')).toBe(0);
  });

  it('sums charges as positive balance', () => {
    const entries = [entry({amount: 1000}), entry({amount: 500})];
    expect(computeContactBalance(entries, 'c1')).toBe(1500);
  });

  it('subtracts payments from the balance', () => {
    const entries = [
      entry({amount: 1000, kind: 'charge'}),
      entry({amount: 400, kind: 'payment'}),
    ];
    expect(computeContactBalance(entries, 'c1')).toBe(600);
  });

  it('ignores entries belonging to other contacts', () => {
    const entries = [
      entry({amount: 1000, contactId: 'c1'}),
      entry({amount: 5000, contactId: 'c2'}),
    ];
    expect(computeContactBalance(entries, 'c1')).toBe(1000);
  });
});
