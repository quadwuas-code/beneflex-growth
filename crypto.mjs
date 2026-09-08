// Standard Web Crypto primitives, shared by the local builder and browser unlocker.
export const ITERATIONS = 600_000;
const encoder = new TextEncoder();
const context = encoder.encode('BeneFlex encrypted website v1');
export function fromBase64(text) {
  return Uint8Array.from(atob(text), char => char.charCodeAt(0));
}
export function toBase64(bytes) {
  let text = '';
  for (let i = 0; i < bytes.length; i += 8192) text += String.fromCharCode(...bytes.subarray(i, i + 8192));
  return btoa(text);
}
async function derive(password, salt, usage) {
  const material = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ITERATIONS }, material,
    { name: 'AES-GCM', length: 256 }, false, [usage]);
}
export async function encryptSite(contents, password) {
  if (!password) throw new Error('A password is required.');
  const salt = crypto.getRandomValues(new Uint8Array(32));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await derive(password, salt, 'encrypt');
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: context }, key, encoder.encode(contents));
  return { version: 1, algorithm: 'AES-256-GCM', kdf: 'PBKDF2-SHA256', iterations: ITERATIONS,
    salt: toBase64(salt), iv: toBase64(iv), ciphertext: toBase64(new Uint8Array(encrypted)) };
}
export async function decryptSite(payload, password) {
  if (payload.version !== 1 || payload.algorithm !== 'AES-256-GCM' || payload.kdf !== 'PBKDF2-SHA256' || payload.iterations !== ITERATIONS) {
    throw new Error('Unsupported encrypted website.');
  }
  const salt = fromBase64(payload.salt);
  const iv = fromBase64(payload.iv);
  if (salt.length !== 32 || iv.length !== 12) throw new Error('Invalid encrypted website.');
  const key = await derive(password, salt, 'decrypt');
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv, additionalData: context }, key, fromBase64(payload.ciphertext));
  return new TextDecoder('utf-8', { fatal: true }).decode(plain);
}
