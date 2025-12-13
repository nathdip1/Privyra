import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/home.css";

function Home() {
  const [file, setFile] = useState(null);
  const [watermark, setWatermark] = useState("");
  const [secureLink, setSecureLink] = useState("");
  const [linkInput, setLinkInput] = useState("");
  const [displayedImage, setDisplayedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useContext(AuthContext);

  /* =========================================================
     🔐 SECURITY: Blur page when tab / app switches
  ========================================================= */
  useEffect(() => {
    const blur = () => {
      document.body.style.filter = "blur(12px)";
    };
    const focus = () => {
      document.body.style.filter = "none";
    };

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

  const handleUpload = async () => {
    if (!file) return alert("Please select an image!");
    if (!currentUser?.token) return alert("Please login first!");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("watermark", watermark);

      const res = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.secureLink) {
        setSecureLink(res.data.secureLink);
      } else {
        alert("Upload failed!");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Upload failed!");
    }
    setLoading(false);
  };

  const handleDisplay = async () => {
    if (!linkInput) return alert("Please enter a secure link!");
    setLoading(true);
    try {
      const res = await axios.get(linkInput, { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      setDisplayedImage(url);
    } catch {
      alert("Cannot display image!");
    }
    setLoading(false);
  };

  /* =========================
     Copy Secure Link
  ========================= */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(secureLink);
      alert("Secure link copied!");
    } catch {
      alert("Failed to copy link");
    }
  };

  /* =========================
     Share Secure Link
  ========================= */
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Privyra Secure Image",
          text: "View this secure image",
          url: secureLink,
        });
      } catch {
        // user cancelled share
      }
    } else {
      alert("Sharing not supported on this device");
    }
  };

  return (
    <div className="home-page">
      <div className="home-card">
        <h2 className="home-title">Secure Image Sharing</h2>
        <p className="home-subtitle">Upload • Share • Auto-delete</p>

        <label className="upload-box">
          <input type="file" hidden onChange={handleFileChange} />
          <span>📁 Upload Image</span>
        </label>

        <p className="file-name">
          {file ? file.name : "No file selected"}
        </p>

        <input
          type="text"
          placeholder="Optional watermark text"
          value={watermark}
          onChange={(e) => setWatermark(e.target.value)}
          className="home-input"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="primary-btn"
        >
          {loading ? "Uploading..." : "Generate Secure Link"}
        </button>

        {secureLink && (
          <div className="secure-link-box">
            <p>Secure Link</p>
            <input value={secureLink} readOnly />

            {/* ✅ Copy + Share buttons (unchanged styling) */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "12px",
              }}
            >
              <button
                onClick={handleCopy}
                style={{
                  flex: 1,
                  padding: "0.6rem",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.12)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.25)",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Copy Link
              </button>

              <button
                onClick={handleShare}
                style={{
                  flex: 1,
                  padding: "0.6rem",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(135deg, #7f7cff, #22d3ee)",
                  color: "#fff",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 0 10px rgba(34,211,238,0.5)",
                }}
              >
                Share Link
              </button>
            </div>
          </div>
        )}

        <div className="divider" />

        <input
          type="text"
          placeholder="Paste secure link to view image"
          value={linkInput}
          onChange={(e) => setLinkInput(e.target.value)}
          className="home-input neon"
        />

        <button
          onClick={handleDisplay}
          disabled={loading}
          className="success-btn"
        >
          {loading ? "Loading..." : "Display Image"}
        </button>

        {/* =========================================================
            🔐 SECURITY: Block right-click, drag, download
        ========================================================= */}
        {displayedImage && (
          <img
            src={displayedImage}
            alt="Secure"
            className="preview-image"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            style={{
              userSelect: "none",
              pointerEvents: "none",
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Home;
