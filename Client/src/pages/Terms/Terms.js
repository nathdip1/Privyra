// src/pages/Terms/Terms.js
import React from "react";
import { Link } from "react-router-dom";
import "../../styles/auth.css";

function Terms() {
  return (
    <div className="auth-page">
      {/* Header */}
      <div className="auth-header">
        <h2>Terms & Conditions</h2>
        <p>Last updated: December 2025</p>
      </div>

      {/* Terms Content */}
      <div
        className="form-container neon-card"
        style={{
          maxWidth: "720px",
          textAlign: "left",
          lineHeight: "1.7",
        }}
      >
        <h3>1. Acceptance of Terms</h3>
        <p>
          By accessing and using Privyra, you agree to comply with and be bound by
          these Terms and Conditions. Please read them carefully.
        </p>

        <h3>2. User Accounts</h3>
        <p>
          You must provide accurate information when creating an account. You are
          responsible for safeguarding your credentials and all activities under
          your account.
        </p>

        <h3>3. User Conduct</h3>
        <p>
          You agree not to upload, share, or distribute content that is illegal,
          offensive, abusive, or violates any applicable laws or rights.
        </p>

        <h3>4. Intellectual Property</h3>
        <p>
          All content, branding, and intellectual property on Privyra belongs to
          Privyra or its licensors. Unauthorized use is strictly prohibited.
        </p>

        <h3>5. Termination</h3>
        <p>
          We reserve the right to suspend or terminate your account at our sole
          discretion if you violate these terms.
        </p>

        <h3>6. Limitation of Liability</h3>
        <p>
          Privyra is not liable for any direct, indirect, incidental, or
          consequential damages arising from the use of the platform.
        </p>

        <h3>7. Changes to Terms</h3>
        <p>
          We may update these Terms periodically. Continued use of the platform
          constitutes acceptance of the revised terms.
        </p>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link to="/signup" className="auth-link">
            ← Back to Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Terms;
