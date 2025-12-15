// Client/crypto/encrypt.js

export async function encryptFile(file) {
  // 1️⃣ Read file as ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  // 2️⃣ Generate AES-GCM key
  const cryptoKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  // 3️⃣ Generate IV (12 bytes for AES-GCM)
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // 4️⃣ Encrypt
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    arrayBuffer
  );

  // 5️⃣ Export key
  const rawKey = await crypto.subtle.exportKey("raw", cryptoKey);

  return {
    data: arrayBufferToBase64(encryptedBuffer),
    iv: arrayBufferToBase64(iv.buffer),
    key: arrayBufferToBase64(rawKey),
    mimeType: file.type,
    originalSize: file.size,
  };
}

/* ===============================
   SAFE BASE64 CONVERTER
   (NO RECURSION, NO STACK OVERFLOW)
=============================== */
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000; // 32KB chunks

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(
      ...bytes.subarray(i, i + chunkSize)
    );
  }

  return window.btoa(binary);
}
