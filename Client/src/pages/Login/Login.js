import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { validateUsername, validatePassword } from "../../utils/validators";
import { AuthContext } from "../../context/AuthContext";

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

      if (!res.ok) {
        setError({ login: data.message });
        return;
      }

      login({ username: data.username, token: data.token });
      navigate("/");
    } catch {
      setError({ login: "Server error. Try again later." });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem 1rem",
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
            width: "60%",
            marginBottom: "1rem",
          }}
        />
        <h2>Welcome back to Privyra</h2>
        <p style={{ color: "#555" }}>
          Log in to securely access your account.
        </p>
      </div>

      {/* Login Form */}
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
          {error.username && <p style={{ color: "red" }}>{error.username}</p>}

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          {error.password && <p style={{ color: "red" }}>{error.password}</p>}

          {error.login && (
            <p style={{ color: "red", textAlign: "center" }}>
              {error.login}
            </p>
          )}

          <button type="submit" style={{ marginTop: "12px" }}>
            Login
          </button>
        </form>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
