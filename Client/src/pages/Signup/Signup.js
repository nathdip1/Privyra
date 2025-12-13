// src/pages/Signup/Signup.js
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { validateUsername, validatePassword } from "../../utils/validators";
import { AuthContext } from "../../context/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState({});
  const [hovered, setHovered] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!username) newErrors.username = "Username is required";
    else if (!validateUsername(username))
      newErrors.username = "Only letters and numbers are allowed";

    if (!password) newErrors.password = "Password cannot be empty";
    else if (!validatePassword(password))
      newErrors.password =
        "Password must be 8–12 characters with upper, lower, number & special character";

    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!termsAccepted)
      newErrors.terms = "You must accept the terms and conditions";

    setErrors(newErrors);
    if (Object.keys(newErrors).length !== 0) return;

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ username: data.message });
        return;
      }

      login({ username: data.username, token: data.token });
      navigate("/login");
    } catch (err) {
      setErrors({ server: "Server error. Try again later." });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "1rem",
        backgroundColor: "#eef2ff",
      }}
    >
      {/* Logo + Heading */}
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <img
          src={process.env.PUBLIC_URL + "/logo.png"}
          alt="Privyra Logo"
          style={{
            maxWidth: "160px",
            width: "50%",
            height: "auto",
            marginBottom: "1rem",
            transition: "transform 0.3s ease",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            cursor: "pointer",
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        />
        <h2>Create your Privyra Account</h2>
        <p style={{ color: "#555" }}>
          Join Privyra to manage secure access.
        </p>
      </div>

      {/* Form */}
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && <p style={{ color: "red" }}>{errors.username}</p>}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginTop: "0.75rem" }}
          />
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ marginTop: "0.75rem" }}
          />
          {errors.confirmPassword && (
            <p style={{ color: "red" }}>{errors.confirmPassword}</p>
          )}

          {/* ✅ FIXED CHECKBOX ALIGNMENT */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginTop: "1rem",
            }}
          >
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              style={{
                width: "18px",
                height: "18px",
                flexShrink: 0,
              }}
            />
            <span>
              I accept the{" "}
              <Link to="/terms" style={{ fontWeight: "bold" }}>
                Terms & Conditions
              </Link>
            </span>
          </div>

          {errors.terms && <p style={{ color: "red" }}>{errors.terms}</p>}
          {errors.server && <p style={{ color: "red" }}>{errors.server}</p>}

          <button type="submit" style={{ marginTop: "1rem", width: "100%" }}>
            Sign Up
          </button>
        </form>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ fontWeight: "bold" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
