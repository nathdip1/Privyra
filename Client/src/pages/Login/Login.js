// src/pages/Login/Login.js
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { validateUsername, validatePassword } from "../../utils/validators";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/auth.css";

const API_BASE_URL = process.env.REACT_APP_API_URL;

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const [hovered, setHovered] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!username) newErrors.username = "Username is required";
    else if (!validateUsername(username))
      newErrors.username = "Username must be alphanumeric";

    if (!password) newErrors.password = "Password cannot be empty";
    else if (!validatePassword(password))
      newErrors.password =
        "Password must be 8–12 characters with upper, lower, number & special character";

    setError(newErrors);
    if (Object.keys(newErrors).length !== 0) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError({ login: data.message });
        return;
      }

      login({ username: data.username, token: data.token });
      navigate("/");
    } catch (err) {
      setError({ login: "Server error. Try again later." });
    }
  };

  return (
    <div className="auth-page">
      {/* Header */}
      <div className="auth-header">
        <img
          src={process.env.PUBLIC_URL + "/logo.png"}
          alt="Privyra Logo"
          className="auth-logo"
          style={{
            transform: hovered ? "scale(1.08)" : "scale(1)",
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        />

        <h2>Welcome back to Privyra</h2>
        <p>Log in to securely access your account.</p>
      </div>

      <div className="form-container neon-card">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {error.username && <p className="error">{error.username}</p>}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error.password && <p className="error">{error.password}</p>}

          {error.login && (
            <p className="error" style={{ textAlign: "center" }}>
              {error.login}
            </p>
          )}

          <button type="submit" className="primary-btn">
            Login
          </button>
        </form>

        <p className="auth-switch">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
