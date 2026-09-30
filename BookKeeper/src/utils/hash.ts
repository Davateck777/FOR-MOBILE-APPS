import {sha256} from 'js-sha256';

/**
 * SHA-256 hash of a string, using a pure-JS implementation (`js-sha256`)
 * so it works on Android/iOS without any native module — no extra
 * autolinking, no extra CI build risk.
 *
 * Used to store the app-lock PIN as a hash instead of plain text. Note:
 * a 4–6 digit PIN has inherently low entropy (at most 1,000,000
 * combinations) regardless of hash algorithm — the same trade-off every
 * phone's lock-screen PIN makes. This is a local, on-device deterrent
 * against casual snooping, not protection against a determined attacker
 * with access to the device's storage.
 */
export function simpleHash(input: string): string {
  return sha256(input);
}
