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
    try {
      await axios.post(
        `http://localhost:5000/api/dashboard/revoke/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      // mark as revoked locally
      setUploads((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, revoked: true } : u
        )
      );
    } catch (err) {
      alert("Failed to revoke link");
    }
  };

  const now = new Date();

  const getStatus = (u) => {
    if (u.revoked) return "Revoked";
    if (u.expiresAt && new Date(u.expiresAt) < now)
      return "Expired";
    return "Active";
  };

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading dashboard...</p>;
  }

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Dashboard</h2>

      {uploads.length === 0 && (
        <p className="empty-text">No uploads yet</p>
      )}

      <div className="table">
        {uploads.map((u) => (
          <div key={u._id} className="table-row">
            {/* FILE / LINK */}
            <div className="cell">
              <strong>Secure Link</strong>
              <input
                value={u.secureLink}
                readOnly
                onClick={(e) => e.target.select()}
                style={{ width: "100%", marginTop: "6px" }}
              />
            </div>

            {/* STATUS */}
            <div
              className={`cell status ${getStatus(u).toLowerCase()}`}
            >
              {getStatus(u)}
            </div>

            {/* VIEWS */}
            <div className="cell">
              {u.views}
              {u.maxViews ? ` / ${u.maxViews}` : ""} views
            </div>

            {/* ACTIONS */}
            <div className="cell actions">
              {!u.revoked && (
                <button
                  className="danger"
                  onClick={() => revoke(u._id)}
                >
                  Revoke
                </button>
              )}
            </div>

            {/* AUDIT LOG */}
            <div className="cell" style={{ gridColumn: "1 / -1" }}>
              <strong>Viewed by:</strong>

              {u.viewLogs && u.viewLogs.length > 0 ? (
                <ul style={{ marginTop: "6px", paddingLeft: "18px" }}>
                  {u.viewLogs.map((v, idx) => (
                    <li key={idx}>
                      <span style={{ color: "#00ffff" }}>
                        {v.viewerUsername}
                      </span>{" "}
                      → {v.viewCount} time
                      {v.viewCount > 1 ? "s" : ""}
                    </li>
                  ))}
                </ul>
              ) : (
                <p
                  style={{
                    marginTop: "6px",
                    color: "#aab0ff",
                  }}
                >
                  No views yet
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
