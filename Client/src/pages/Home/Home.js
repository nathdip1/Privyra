import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/home.css";
import Header from "../../components/Header";

function Home() {
  const { currentUser } = useContext(AuthContext);

  const [file, setFile] = useState(null);
  const [watermark, setWatermark] = useState("");

  // 🔐 Controls
  const [expiresInMinutes, setExpiresInMinutes] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [oneTimeView] = useState(false); // kept for backend safety

  const [secureLink, setSecureLink] = useState("");
  const [linkInput, setLinkInput] = useState("");
  const [displayedImage, setDisplayedImage] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const onExpiryChange = (val) => {
    setExpiresInMinutes(val);
    if (val) {
      setMaxViews("");
    }
  };

  const onMaxViewsChange = (val) => {
    setMaxViews(val);
    if (val) {
      setExpiresInMinutes("");
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an image");
    if (!currentUser?.token) return alert("Login required");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("watermark", watermark);

      if (expiresInMinutes)
        formData.append("expiresInMinutes", expiresInMinutes);
      if (maxViews)
        formData.append("maxViews", maxViews);

      // oneTimeView intentionally not sent (UI removed)

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

      setSecureLink(res.data.secureLink);
    } catch (err) {
      alert(err.response?.data?.error || "Upload failed");
    }
    setLoading(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(secureLink);
    alert("Secure link copied");
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Privyra Secure Image",
        url: secureLink,
      });
    } else {
      alert("Sharing not supported");
    }
  };

  const handleDisplay = async () => {
    if (!linkInput) return alert("Enter secure link");
    setLoading(true);
    try {
      const res = await axios.get(linkInput, { responseType: "blob" });
      setDisplayedImage(URL.createObjectURL(res.data));
    } catch {
      alert("Cannot display image");
    }
    setLoading(false);
  };

  return (
    <>
      <Header />

      <div className="home-page">
        <div className="home-card">
          <h2 className="home-title">Secure Image Sharing</h2>
          <p className="home-subtitle">Upload • Share • Auto-Delete</p>

          <label className="upload-box">
            <input type="file" hidden onChange={handleFileChange} />
            <span>📁 Upload Image</span>
          </label>

          <p className="file-name">
            {file ? file.name : "No file selected"}
          </p>

          <input
            className="home-input"
            placeholder="Optional watermark text"
            value={watermark}
            onChange={(e) => setWatermark(e.target.value)}
          />

          <input
            className="home-input"
            type="number"
            placeholder="Expire after (minutes)"
            value={expiresInMinutes}
            onChange={(e) => onExpiryChange(e.target.value)}
            disabled={!!maxViews}
          />

          <input
            className="home-input"
            type="number"
            placeholder="Max allowed views"
            value={maxViews}
            onChange={(e) => onMaxViewsChange(e.target.value)}
            disabled={!!expiresInMinutes}
          />

          <button
            className="primary-btn"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Generate Secure Link"}
          </button>

          {secureLink && (
            <div className="secure-link-box">
              <p>Secure Link</p>
              <input value={secureLink} readOnly />

              <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                <button onClick={handleCopy} style={{ flex: 1 }}>
                  Copy Link
                </button>
                <button onClick={handleShare} style={{ flex: 1 }}>
                  Share Link
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
            <img
              src={displayedImage}
              alt="Secure"
              className="preview-image"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              style={{ pointerEvents: "none", userSelect: "none" }}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
