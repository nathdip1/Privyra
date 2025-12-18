import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Profile() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "80px auto",
        padding: "20px",
        background: "rgba(0, 0, 0, 0.4)",
        borderRadius: "12px",
        color: "#e6ffff",
        position: "relative", // ✅ needed for top-right button
      }}
    >
      {/* ✅ Go Back Button */}
      <button
  onClick={() => navigate("/")}
  style={{
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "rgba(255, 0, 0, 0.12)",
    border: "1px solid #ff4d4f",
    color: "#ff4d4f",
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 0 10px rgba(255, 77, 79, 0.8)",
  }}
>
  Go Back
</button>


      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Profile
      </h2>

      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            fontSize: "13px",
            opacity: 0.8,
            display: "block",
            marginBottom: "6px",
          }}
        >
          Username
        </label>

        <div
          style={{
            padding: "12px",
            borderRadius: "8px",
            background: "rgba(255, 255, 255, 0.08)",
            wordBreak: "break-word",
          }}
        >
          {currentUser.username}
        </div>
      </div>
    </div>
  );
}

export default Profile;
