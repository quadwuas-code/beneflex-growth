import { decryptSite } from './crypto.mjs';

const base = new URL('.', import.meta.url);
const form = document.getElementById('unlock-form');
const input = document.getElementById('password');
const button = document.getElementById('unlock-button');
const message = document.getElementById('unlock-message');
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (button.disabled) return;
  if (!crypto.subtle) {
    message.textContent = 'Open this website using its secure https:// address.';
    return;
  }
  button.disabled = true;
  button.textContent = 'Unlocking…';
  message.textContent = '';
  let envelope;
  try {
    const response = await fetch(new URL('sealed-site.json', base), { cache: 'no-store' });
    if (!response.ok) throw new Error('Website unavailable');
    envelope = await response.json();
  } catch {
    message.textContent = 'The website could not be loaded. Check your connection and try again.';
    button.disabled = false;
    button.textContent = 'Unlock website';
    return;
  }
  let site;
  try {
    site = JSON.parse(await decryptSite(envelope, input.value));
  } catch {
    input.value = '';
    message.textContent = 'That password did not unlock the website. Please try again.';
    button.disabled = false;
    button.textContent = 'Unlock website';
    input.focus();
    return;
  }
  input.value = '';
  window.__BENEFLEX_BASE__ = base.pathname;
  window.__BENEFLEX_PROTECTED__ = true;
  window.__BENEFLEX_DOWNLOADS__ = Object.fromEntries(Object.entries(site.downloads).map(([path, file]) =>
    [path, URL.createObjectURL(new Blob([file.contents], { type: file.type }))]));
  // Replace the lock screen only after authenticated decryption succeeds. No key is persisted.
  document.open();
  document.write(site.html);
  document.close();
});
