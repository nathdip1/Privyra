import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

function Home() {
  const [file, setFile] = useState(null);
  const [watermark, setWatermark] = useState("");
  const [secureLink, setSecureLink] = useState("");
  const [linkInput, setLinkInput] = useState("");
  const [displayedImage, setDisplayedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useContext(AuthContext);
  console.log("Current user from AuthContext:", currentUser);

  const handleFileChange = (e) => setFile(e.target.files[0]);

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
        alert("Upload successful!");
      } else {
        alert("Upload failed: No secure link returned");
      }
    } catch (err) {
      console.error("Upload error:", err.response || err.message || err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Upload failed!";
      alert(msg);
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
    } catch (err) {
      console.error("Display error:", err.response || err.message || err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Cannot display image!";
      alert(msg);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Upload a Secure Image</h2>
      <input type="file" onChange={handleFileChange} />
      <input
        type="text"
        placeholder="Add watermark text"
        value={watermark}
        onChange={(e) => setWatermark(e.target.value)}
        style={{ display: "block", margin: "1rem 0", padding: "0.5rem", width: "100%" }}
      />
      <button onClick={handleUpload} disabled={loading} style={{ padding: "0.5rem 1rem" }}>
        {loading ? "Uploading..." : "Generate Secure Link"}
      </button>

      {secureLink && (
        <div style={{ marginTop: "1rem" }}>
          <p>Secure Link (copy & share):</p>
          <input
            type="text"
            value={secureLink}
            readOnly
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
      )}

      <hr style={{ margin: "2rem 0" }} />

      <h2>Display Image from Secure Link</h2>
      <input
        type="text"
        placeholder="Paste secure link here"
        value={linkInput}
        onChange={(e) => setLinkInput(e.target.value)}
        style={{ display: "block", margin: "1rem 0", padding: "0.5rem", width: "100%" }}
      />
      <button onClick={handleDisplay} disabled={loading} style={{ padding: "0.5rem 1rem" }}>
        {loading ? "Loading..." : "Display Image"}
      </button>

      {displayedImage && (
        <div style={{ marginTop: "1rem" }}>
          <img src={displayedImage} alt="Secure" style={{ maxWidth: "100%" }} />
        </div>
      )}
    </div>
  );
}

export default Home;
