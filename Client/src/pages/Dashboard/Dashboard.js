import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/dashboard.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Dashboard() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/dashboard/my-uploads`,
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

  const goBack = () => {
    navigate("/");
  };

  const now = new Date();

  const getStatus = (u) => {
    if (u.revoked) return "revoked";
    if (u.expiresAt && new Date(u.expiresAt) < now) return "expired";
    return "active";
  };

  /* ===============================
     🔴 REVOKE LINK (RESTORED)
  =============================== */
  const revoke = async (id) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/dashboard/revoke/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      // update UI immediately
      setUploads((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, revoked: true } : u
        )
      );
    } catch (err) {
      alert("Failed to revoke link");
    }
  };

  if (loading) {
    return <p className="loading">Loading dashboard...</p>;
  }

  return (
    <div className="dashboard">
      {/* 🔹 TITLE ROW */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h2 className="dashboard-title" style={{ margin: 0 }}>
          Dashboard
        </h2>

        <button
          className="revoke-btn"
          onClick={goBack}
          style={{ padding: "6px 12px" }}
        >
          Go Back
        </button>
      </div>

      {/* 🔹 ANALYTICS */}
      <div className="analytics">
        <div className="card">
          <span>Total Uploads</span>
          <strong>{uploads.length}</strong>
        </div>
        <div className="card">
          <span>Total Views</span>
          <strong>
            {uploads.reduce((sum, u) => sum + u.views, 0)}
          </strong>
        </div>
        <div className="card">
          <span>Active Links</span>
          <strong>
            {
              uploads.filter((u) => getStatus(u) === "active")
                .length
            }
          </strong>
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

            {/* 🔴 REVOKE BUTTON (ONLY IF ACTIVE) */}
            {getStatus(u) === "active" && (
              <button
                className="revoke-btn"
                onClick={() => revoke(u._id)}
              >
                Revoke
              </button>
            )}
          </div>

          <p className="meta">
            Views: {u.views}
            {u.maxViews ? ` / ${u.maxViews}` : ""}
          </p>

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
