# BeneFlex protected website

This repository contains the encrypted website and its password screen. Both pages, application code, internal data, and downloadable reports are inside the encrypted payload.

## Free GitHub Pages hosting

In **Settings → Pages**, choose **Deploy from a branch**, **main**, and **/(root)**, then save. Use the website URL shown there. No server or paid hosting account is required.

Enter the separately shared password on the website. Navigation between the Growth Brief and Pipeline Playbook stays unlocked in the same tab. Refresh, close the tab, or choose **Lock site** to lock it again. A new tab requires the password.

## Updates

Edit the separate private source project, rebuild it, and regenerate this encrypted package. Upload only these generated files. Never upload the plaintext source, the unencrypted build folder, or the password here.

## How protection works

The browser derives an AES-256-GCM key from the password using PBKDF2-SHA256 with 600,000 iterations and a random salt. Nothing is decrypted until the password is supplied. Neither the password nor the decryption key is stored in this repository, cookies, or browser storage.

This is shared-password encryption, not individual account authentication. Public encrypted files can be downloaded and passwords guessed offline, so password strength matters. Someone who knows the password can save or share the decrypted reports. Changing the password requires rebuilding and cannot revoke copies of earlier content.

[Web Crypto documentation](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto) · [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
