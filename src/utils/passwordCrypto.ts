// Cryptographic password hashing & verification using Web Crypto API (PBKDF2-HMAC-SHA256)
// Ensures plaintext passwords are NEVER stored, logged, or recoverable even if storage is compromised.

const PBKDF2_ITERATIONS = 100_000;
const SALT_BYTES = 16;
const HASH_BITS = 256;
const HASH_PREFIX = 'pbkdf2_sha256';

function getCrypto(): Crypto {
  if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.subtle) {
    return globalThis.crypto;
  }
  throw new Error('Web Crypto API is not available in this environment.');
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) {
    throw new Error('Invalid hex string');
  }
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

/**
 * Hashes a plaintext password using PBKDF2-HMAC-SHA256 with a random 16-byte salt.
 * Returns a non-reversible string: `pbkdf2_sha256$100000$<saltHex>$<hashHex>`.
 */
export async function hashPassword(password: string): Promise<string> {
  const cryptoObj = getCrypto();
  const encoder = new TextEncoder();
  const salt = new Uint8Array(SALT_BYTES);
  cryptoObj.getRandomValues(salt);

  const keyMaterial = await cryptoObj.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await cryptoObj.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    HASH_BITS
  );

  const hashBytes = new Uint8Array(derivedBits);
  return `${HASH_PREFIX}$${PBKDF2_ITERATIONS}$${bytesToHex(salt)}$${bytesToHex(hashBytes)}`;
}

/**
 * Verifies a plaintext password against a stored PBKDF2 hash in constant time.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (!password || !storedHash) return false;

  const parts = storedHash.split('$');
  if (parts.length !== 4 || parts[0] !== HASH_PREFIX) {
    return false;
  }

  const iterations = parseInt(parts[1], 10);
  if (!Number.isFinite(iterations) || iterations < 10_000) {
    return false;
  }

  try {
    const cryptoObj = getCrypto();
    const encoder = new TextEncoder();
    const salt = hexToBytes(parts[2]);
    const expectedHash = hexToBytes(parts[3]);

    const keyMaterial = await cryptoObj.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    const derivedBits = await cryptoObj.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt as BufferSource,
        iterations,
        hash: 'SHA-256',
      },
      keyMaterial,
      expectedHash.length * 8
    );

    const actualHash = new Uint8Array(derivedBits);
    return constantTimeEqual(actualHash, expectedHash);
  } catch {
    return false;
  }
}
