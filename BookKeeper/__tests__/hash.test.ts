import {simpleHash} from '../src/utils/hash';

describe('simpleHash', () => {
  it('is deterministic for the same input', () => {
    expect(simpleHash('1234')).toBe(simpleHash('1234'));
  });

  it('produces different hashes for different PINs', () => {
    expect(simpleHash('1234')).not.toBe(simpleHash('4321'));
  });

  it('never returns the plain-text input', () => {
    expect(simpleHash('1234')).not.toBe('1234');
  });

  it('produces a 64-character hex digest (SHA-256)', () => {
    expect(simpleHash('0000')).toMatch(/^[0-9a-f]{64}$/);
  });
});
