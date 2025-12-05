import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

function Home() {
  const { currentUser, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ position: "relative", padding: "1rem", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      {/* ✅ Fixed Logout Button at Top Right */}
      {currentUser && (
        <button
          onClick={handleLogout}
          style={{
            position: "fixed",
            top: "1rem",
            right: "1rem",
            padding: "0.4rem 0.8rem",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#ef4444",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            zIndex: 1000,
          }}
          title="Logout"
        >
          🚪 Logout
        </button>
      )}

      <h2>Feed</h2>

      {currentUser && (
        <p style={{ marginBottom: "1rem", color: "#555" }}>
          Welcome, <strong>{currentUser}</strong>! 🎉
        </p>
      )}

      <p>Posts will appear here...</p>

      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          style={{
            padding: "1rem",
            marginBottom: "1rem",
            background: "#fff",
            borderRadius: "6px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          }}
        >
          Post #{i + 1}
        </div>
      ))}
    </div>
  );
}

export default Home;
