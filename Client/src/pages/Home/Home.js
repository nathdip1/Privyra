import React, { useState, useContext, useEffect } from "react";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/home.css";
import Header from "../../components/Header";
import { encryptFile } from "../../crypto/encrypt";
import { decryptData } from "../../crypto/decrypt";
import DisplayImage from "../../components/DisplayImage";

// 🔹 helper to allow only digits or a single leading "-"
const isNumericInput = (val) => /^-?\d*$/.test(val);

function Home() {
  const { currentUser } = useContext(AuthContext);

  const [file, setFile] = useState(null);
  const [expiresInMinutes, setExpiresInMinutes] = useState("");
  const [maxViews, setMaxViews] = useState("");

  const [secureLink, setSecureLink] = useState("");
  const [linkInput, setLinkInput] = useState("");
  const [displayedImage, setDisplayedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [warning, setWarning] = useState("");
  const [watermark, setWatermark] = useState("");
  useEffect(() => {
  return () => {
    if (displayedImage) {
      URL.revokeObjectURL(displayedImage);
    }
  };
}, [displayedImage]);


  useEffect(() => {
    const blur = () => (document.body.style.filter = "blur(12px)");
    const focus = () => (document.body.style.filter = "none");
    window.addEventListener("blur", blur);
    window.addEventListener("focus", focus);
    return () => {
      window.removeEventListener("blur", blur);
      window.removeEventListener("focus", focus);
    };
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  /* ===============================
     INPUT VALIDATION
  =============================== */

  const onExpiryChange = (val) => {
    setExpiresInMinutes(val);
    setMaxViews("");

    if (val === "") {
      setWarning("");
      return;
    }

    if (!isNumericInput(val)) {
      setWarning("Only numeric values are allowed.");
      return;
    }

    if (val === "-") {
      setWarning("Expiry time cannot be negative.");
      return;
    }

    const num = Number(val);

    if (num < 0) {
      setWarning("Expiry time cannot be negative.");
    } else if (num === 0) {
      setWarning("Expiry time must be at least 1 minute.");
    } else if (num > 60) {
      setWarning("Expiry time cannot exceed 60 minutes.");
    } else {
      setWarning("");
    }
  };

  const onMaxViewsChange = (val) => {
    setMaxViews(val);
    setExpiresInMinutes("");

    if (val === "") {
      setWarning("");
      return;
    }

    if (!isNumericInput(val)) {
      setWarning("Only numeric values are allowed.");
      return;
    }

    if (val === "-") {
      setWarning("Maximum views cannot be negative.");
      return;
    }

    const num = Number(val);

    if (num < 0) {
      setWarning("Maximum views cannot be negative.");
    } else if (num === 0) {
      setWarning("At least 1 view must be allowed.");
    } else if (num > 10) {
      setWarning("Maximum allowed views cannot exceed 10.");
    } else {
      setWarning("");
    }
  };

  const isInvalidExpiry =
    expiresInMinutes &&
    (expiresInMinutes === "-" ||
      !isNumericInput(expiresInMinutes) ||
      Number(expiresInMinutes) <= 0 ||
      Number(expiresInMinutes) > 60);

  const isInvalidViews =
    maxViews &&
    (maxViews === "-" ||
      !isNumericInput(maxViews) ||
      Number(maxViews) <= 0 ||
      Number(maxViews) > 10);

  const isGenerateDisabled = loading || isInvalidExpiry || isInvalidViews;

  /* ===============================
     UPLOAD (ENCRYPT → GRIDFS)
  =============================== */
  const handleUpload = async () => {
    if (!file) {
  alert("Please select an image");
  return;
}

if (file.size > 10 * 1024 * 1024) {
  alert("Image too large. Maximum allowed size is 10MB.");
  return;
}

    if (!currentUser?.token) return alert("Login required");

    setLoading(true);
    try {
      const encrypted = await encryptFile(file);

const formData = new FormData();

// 🔐 binary encrypted image
formData.append(
  "encryptedFile",
  new Blob([encrypted.encryptedBytes], {
    type: "application/octet-stream",
  })
);

// 🔐 binary IV
formData.append(
  "iv",
  new Blob([encrypted.iv], {
    type: "application/octet-stream",
  })
);

// metadata (unchanged)
formData.append("mimeType", encrypted.mimeType);
formData.append("originalSize", encrypted.originalSize);

if (expiresInMinutes) {
  formData.append("expiresInMinutes", expiresInMinutes);
}

if (maxViews) {
  formData.append("maxViews", maxViews);
}

// ✅ IMPORTANT: use your api instance if available
const res = await api.post("/api/upload", formData, {
  headers: {
    Authorization: `Bearer ${currentUser.token}`,
  },
});

const encodedWatermark = encodeURIComponent(watermark || "");
const finalLink =
  `${window.location.origin}${res.data.viewLink}#${encrypted.key}|wm=${encodedWatermark}`;

setSecureLink(finalLink);

    } catch (err) {
      console.error("UPLOAD ERROR:", err.response?.data || err);
      alert(err.response?.data?.error || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     SHARE HANDLER
  =============================== */
  const handleShare = async () => {
    if (!secureLink) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Privyra Secure Link",
          text: "View this secure image using Privyra",
          url: secureLink,
        });
      } catch {
        // user cancelled share → no action needed
      }
    } else {
      navigator.clipboard.writeText(secureLink);
      alert("Link copied. You can share it manually.");
    }
  };

  /* ===============================
     VIEW → DECRYPT → DISPLAY
  =============================== */
  const handleDisplay = async () => {
  if (!linkInput) return alert("Enter secure link");

  try {
    const url = new URL(linkInput);
    const hash = url.hash.replace("#", "");
const [key, wmPart] = hash.split("|");

if (!key) {
  alert("Invalid secure link (missing key)");
  return;
}

let extractedWatermark = "";
if (wmPart?.startsWith("wm=")) {
  extractedWatermark = decodeURIComponent(wmPart.slice(3));
}

// store watermark for rendering
setWatermark(extractedWatermark);


    setLoading(true);

    // 🔐 Fetch encrypted bytes as binary
    const res = await api.get(url.pathname, {
  responseType: "arraybuffer",
  headers: {
    Authorization: `Bearer ${currentUser.token}`,
  },
});


    // 🔐 Extract binary encrypted data
    const encryptedBytes = new Uint8Array(res.data);

    // 🔐 Extract IV from headers (base64 → Uint8Array)
   // 🔐 Read IV from exposed headers (axios lowercases keys)
const ivBase64 =
  res.headers["x-iv"] || res.headers["X-IV"];

if (!ivBase64) {
  console.error("Response headers:", res.headers);
  throw new Error("Missing IV header");
}

const ivBytes = Uint8Array.from(atob(ivBase64), (c) =>
  c.charCodeAt(0)
);

// 🔴 AES-GCM requires exactly 12 bytes
if (ivBytes.length !== 12) {
  console.error("Invalid IV length:", ivBytes.length);
  throw new Error("Invalid IV length");
}

const iv = ivBytes;


    // 🔐 Decrypt (binary → binary)
    const decryptedBytes = await decryptData({
      encryptedBytes,
      iv,
      key,
    });

    // 🔐 Render image safely
    const mimeType =
      res.headers["x-mime-type"] || "image/*";

    const imageBlob = new Blob([decryptedBytes], {
      type: mimeType,
    });

    const imageUrl = URL.createObjectURL(imageBlob);
    setDisplayedImage(imageUrl);
  } catch (err) {
    console.error("VIEW ERROR:", err);
    alert("Cannot display image");
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <Header />

      <div className="home-page">
        <div className="home-card">
          <label className="upload-box">
            <input type="file" hidden onChange={handleFileChange} />
            <span>📁 Upload Image</span>
          </label>

          <p className="file-name">{file ? file.name : "No file selected"}</p>
          <input
            className="home-input"
            type="text"
            placeholder="Optional watermark (max 50 characters)"
            maxLength={50}
            value={watermark}
            onChange={(e) => setWatermark(e.target.value)}
          />

          <input
            className="home-input"
            type="text"
            inputMode="numeric"
            placeholder="Expire after (minutes)"
            value={expiresInMinutes}
            onChange={(e) => onExpiryChange(e.target.value)}
            disabled={!!maxViews}
          />

          <input
            className="home-input"
            type="text"
            inputMode="numeric"
            placeholder="Max allowed views"
            value={maxViews}
            onChange={(e) => onMaxViewsChange(e.target.value)}
            disabled={!!expiresInMinutes}
          />

          {warning && (
            <p
              style={{
                color: "#ff4d4f",
                fontSize: "13px",
                marginTop: "6px",
              }}
            >
              {warning}
            </p>
          )}

          <button
            className="primary-btn"
            onClick={handleUpload}
            disabled={isGenerateDisabled}
            style={{
              opacity: isGenerateDisabled ? 0.5 : 1,
              boxShadow: isGenerateDisabled
                ? "none"
                : "0 0 14px rgba(0,255,255,0.8)",
            }}
          >
            {loading ? "Uploading..." : "Generate Secure Link"}
          </button>

          {secureLink && (
            <div className="secure-link-box">
              <p>Secure Link</p>
              <input value={secureLink} readOnly />

              {/* 🔹 BUTTON ROW */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "16px",
                  marginTop: "12px",
                }}
              >
                <button
                  style={{
                    padding: "10px 16px",
                    minWidth: "120px",
                  }}
                  onClick={() => navigator.clipboard.writeText(secureLink)}
                >
                  Copy Link
                </button>

                <button
                  style={{
                    padding: "10px 16px",
                    minWidth: "120px",
                  }}
                  onClick={handleShare}
                >
                  Share
                </button>
              </div>
            </div>
          )}

          <div className="divider" />

          <input
            className="home-input neon"
            placeholder="Paste secure link to view image"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
          />

          <button className="success-btn" onClick={handleDisplay}>
            Display Image
          </button>

          {displayedImage && (
            <DisplayImage imageUrl={displayedImage} watermark={watermark} />
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
