import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

function Dashboard() {
  const { currentUser } = useContext(AuthContext);
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    const fetchUploads = async () => {
      const res = await axios.get(
        "http://localhost:5000/api/dashboard/my-uploads",
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      setUploads(res.data);
    };
    fetchUploads();
  }, [currentUser]);

  const revoke = async (id) => {
    await axios.post(
      `http://localhost:5000/api/dashboard/revoke/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      }
    );
    setUploads((prev) => prev.filter((i) => i._id !== id));
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "auto" }}>
      <h2>My Uploads</h2>

      {uploads.length === 0 && <p>No uploads yet</p>}

      {uploads.map((img) => (
        <div
          key={img._id}
          style={{
            marginBottom: "1rem",
            padding: "1rem",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <p>
            <strong>Views:</strong>{" "}
            {img.views}
            {img.maxViews ? ` / ${img.maxViews}` : ""}
          </p>

          <p>
            <strong>Expires:</strong>{" "}
            {img.expiresAt
              ? new Date(img.expiresAt).toLocaleString()
              : "Never"}
          </p>

          <input
            value={img.secureLink}
            readOnly
            style={{ width: "100%", marginBottom: "8px" }}
          />

          <button onClick={() => revoke(img._id)}>
            Revoke Link
          </button>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
