import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { validateUsername, validatePassword } from "../../utils/validators";
import { UserContext } from "../../context/UserContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

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
    } catch (err) {
      setError({ login: "Server error. Try again later." });
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", padding: "1rem", backgroundColor: "#eef2ff" }}>
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
          Welcome back to Privyra
        </h3>
        <p style={{ fontSize: "0.95rem", color: "#555" }}>
          Log in to securely access your Privyra account.
        </p>
      </div>

      <div className="login-container" style={{ width: "100%", maxWidth: "400px", padding: "2rem", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
          Login to Your Privyra Account
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              style={{ width: "100%", padding: "0.5rem", borderRadius: "4px" }}
            />
            {error.username && <p style={{ color: "red" }}>{error.username}</p>}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{ width: "100%", padding: "0.5rem", borderRadius: "4px" }}
            />
            {error.password && <p style={{ color: "red" }}>{error.password}</p>}
          </div>

          {error.login && (
            <p style={{ color: "red", textAlign: "center" }}>{error.login}</p>
          )}

          <button
            type="submit"
            style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", backgroundColor: "#4f46e5", color: "white", fontWeight: "bold", border: "none" }}
          >
            Login
          </button>
        </form>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#4f46e5", fontWeight: "bold" }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
