import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/dashboard.css";

function Dashboard() {
  const { currentUser } = useContext(AuthContext);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/dashboard/my-uploads",
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        setUploads(res.data);
      } catch (err) {
        console.error("Failed to load dashboard data");
      }
      setLoading(false);
    };

    if (currentUser?.token) {
      fetchUploads();
    }
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

    setUploads((prev) =>
      prev.map((u) =>
        u._id === id ? { ...u, revoked: true } : u
      )
    );
  };

  const copyLink = (link) => {
    navigator.clipboard.writeText(link);
    alert("Secure link copied");
  };

  const now = new Date();

  const getStatus = (u) => {
    if (u.revoked) return "revoked";
    if (u.expiresAt && new Date(u.expiresAt) < now)
      return "expired";
    return "active";
  };

  /* 🔹 ANALYTICS */
  const totalUploads = uploads.length;
  const totalViews = uploads.reduce(
    (sum, u) => sum + u.views,
    0
  );
  const activeLinks = uploads.filter(
    (u) => getStatus(u) === "active"
  ).length;

  if (loading) {
    return <p className="loading">Loading dashboard...</p>;
  }

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Dashboard</h2>

      {/* 🔹 ANALYTICS CARDS */}
      <div className="analytics">
        <div className="card">
          <span>Total Uploads</span>
          <strong>{totalUploads}</strong>
        </div>
        <div className="card">
          <span>Total Views</span>
          <strong>{totalViews}</strong>
        </div>
        <div className="card">
          <span>Active Links</span>
          <strong>{activeLinks}</strong>
        </div>
      </div>

      {uploads.length === 0 && (
        <p className="empty-text">No uploads yet</p>
      )}

      {uploads.map((u) => (
        <div key={u._id} className="upload-card">
          {/* HEADER */}
          <div className="upload-header">
            <span className={`badge ${getStatus(u)}`}>
              {getStatus(u).toUpperCase()}
            </span>

            {!u.revoked && (
              <button
                className="revoke-btn"
                onClick={() => revoke(u._id)}
              >
                Revoke
              </button>
            )}
          </div>

          {/* LINK */}
          <div className="link-row">
            <input value={u.secureLink} readOnly />
            <button
              className="copy-btn"
              onClick={() => copyLink(u.secureLink)}
            >
              Copy
            </button>
          </div>

          {/* STATS */}
          <p className="meta">
            Views: {u.views}
            {u.maxViews ? ` / ${u.maxViews}` : ""}
          </p>

          {/* VIEW HISTORY */}
          <div className="views-log">
            <strong>View history</strong>

            {u.viewLogs.length === 0 ? (
              <p className="muted">No views yet</p>
            ) : (
              <ul>
                {u.viewLogs.map((v, i) => (
                  <li key={i}>
                    <span className="viewer">
                      {v.viewerUsername}
                    </span>{" "}
                    → {v.viewCount} time
                    {v.viewCount > 1 ? "s" : ""}
                    <span className="time">
                      {new Date(
                        v.lastViewedAt
                      ).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
