/*
  Client-side decryption (ZERO-KNOWLEDGE)
  AES-256-GCM
  - Imports key from URL fragment (base64)
  - Decrypts binary encrypted bytes
  - Returns Uint8Array for rendering
*/

/* ===============================
   HELPERS
=============================== */

// base64 → Uint8Array (ONLY for small key material)
const base64ToBuf = (b64) =>
  Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

/* ===============================
   KEY IMPORT
=============================== */
export const importDecryptionKey = async (base64Key) => {
  if (!base64Key) {
    throw new Error("Missing decryption key");
  }

  const rawKey = base64ToBuf(base64Key);

  return crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );
};

/* ===============================
   DECRYPT DATA (BINARY)
=============================== */
export const decryptData = async ({
  encryptedBytes,
  iv,
  key,
}) => {
  if (!encryptedBytes || !iv || !key) {
    throw new Error("Missing decryption parameters");
  }

  const cryptoKey = await importDecryptionKey(key);

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv instanceof Uint8Array ? iv : new Uint8Array(iv),
    },
    cryptoKey,
    encryptedBytes instanceof Uint8Array
      ? encryptedBytes
      : new Uint8Array(encryptedBytes)
  );

  return new Uint8Array(decryptedBuffer);
};
