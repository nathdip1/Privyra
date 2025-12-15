/*
  Client-side decryption (ZERO-KNOWLEDGE)
  AES-256-GCM
  - Imports key from URL fragment
  - Decrypts encrypted bytes
  - Returns Uint8Array for rendering
*/

/* ===============================
   HELPERS
=============================== */
const base64ToBuf = (b64) =>
  Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

/* ===============================
   KEY IMPORT
=============================== */
export const importDecryptionKey = async (base64Key) => {
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
   DECRYPT DATA
=============================== */
export const decryptData = async ({
  encryptedData,
  iv,
  key,
}) => {
  if (!encryptedData || !iv || !key) {
    throw new Error("Missing decryption parameters");
  }

  const cryptoKey = await importDecryptionKey(key);

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: base64ToBuf(iv),
    },
    cryptoKey,
    base64ToBuf(encryptedData)
  );

  return new Uint8Array(decryptedBuffer);
};
