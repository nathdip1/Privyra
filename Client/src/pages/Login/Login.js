import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { validateUsername, validatePassword } from "../../utils/validators";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/auth.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});

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
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) return setError({ login: data.message });

      login({ username: data.username, token: data.token });
      navigate("/");
    } catch {
      setError({ login: "Server error. Try again later." });
    }
  };

  return (
    <div className="auth-page">
      <img src="/logo.png" alt="Privyra" className="auth-logo" />
      <h2 className="auth-title">Welcome back to Privyra</h2>
      <p className="auth-subtitle">Log in to securely access your account.</p>

      <div className="auth-card">
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {error.username && <p style={{ color: "red" }}>{error.username}</p>}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginTop: "10px" }}
          />
          {error.password && <p style={{ color: "red" }}>{error.password}</p>}

          {error.login && <p style={{ color: "red" }}>{error.login}</p>}

          <button type="submit" style={{ marginTop: "14px", width: "100%" }}>
            Login
          </button>
        </form>

        <p style={{ marginTop: "12px", textAlign: "center" }}>
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
