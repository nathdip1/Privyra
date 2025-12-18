// Client/src/crypto/encrypt.js

export async function encryptFile(file) {
  // Read file as ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  // Generate AES-GCM key
  const cryptoKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  // Generate IV (12 bytes)
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Encrypt (binary → binary)
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    arrayBuffer
  );

  // Export raw key (still binary)
  const rawKey = await crypto.subtle.exportKey("raw", cryptoKey);

  return {
    encryptedBytes: new Uint8Array(encryptedBuffer),
    iv: new Uint8Array(iv),
    key: bufferToBase64(rawKey), // key stays base64 for URL safety
    mimeType: file.type,
    originalSize: file.size,
  };
}

// Base64 ONLY for small key material (safe)
function bufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
