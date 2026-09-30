/**
 * Deterministic, dependency-free string hash (djb2 variant).
 *
 * ⚠️ This is NOT cryptographically secure. It exists to keep the MVP's
 * "app lock" PIN from being stored in plain text without pulling in a
 * native crypto dependency (which would add build risk for a first CI
 * pass). For a production release, replace this with a vetted hashing
 * library (e.g. via `react-native-keychain` + OS secure storage) — see
 * the Roadmap section of the README.
 */
/* eslint-disable no-bitwise -- bitwise ops are intentional for this hash algorithm */
export function simpleHash(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}
/* eslint-enable no-bitwise */
