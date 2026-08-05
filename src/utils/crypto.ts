// Client-Side Zero-Knowledge Encryption Demonstration Utility
// Uses standard Web Crypto API (AES-GCM-256)

export interface EncryptedPayload {
  ciphertextBase64: string;
  ivHex: string;
  saltHex: string;
  timestamp: string;
  version: string;
}

/**
 * Derives a AES-GCM 256 key from a user passphrase using PBKDF2 (100k iterations)
 */
async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts arbitrary JSON string client-side before sync
 */
export async function encryptLocalData(dataObj: unknown, passphrase = 'user-private-master-key'): Promise<EncryptedPayload> {
  const enc = new TextEncoder();
  const jsonStr = JSON.stringify(dataObj);
  const dataBuffer = enc.encode(jsonStr);

  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const key = await deriveKey(passphrase, salt);

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    dataBuffer
  );

  const ciphertextBase64 = btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
  const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');

  return {
    ciphertextBase64,
    ivHex,
    saltHex,
    timestamp: new Date().toISOString(),
    version: '1.0-aes256gcm',
  };
}

/**
 * Decrypts an encrypted payload using the local passphrase
 */
export async function decryptLocalData(payload: EncryptedPayload, passphrase = 'user-private-master-key'): Promise<unknown> {
  const salt = new Uint8Array(payload.saltHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
  const iv = new Uint8Array(payload.ivHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);

  const binaryStr = atob(payload.ciphertextBase64);
  const encryptedBytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    encryptedBytes[i] = binaryStr.charCodeAt(i);
  }

  const key = await deriveKey(passphrase, salt);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encryptedBytes
  );

  const dec = new TextDecoder();
  const jsonStr = dec.decode(decryptedBuffer);
  return JSON.parse(jsonStr);
}
