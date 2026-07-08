"use client";

import { useState } from "react";

export default function PasswordField() {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label
        style={{ display: "block", fontSize: 12.5, color: "#5c5c5c", margin: "12px 0 4px" }}
      >
        Password
      </label>
      <div style={{ position: "relative" }}>
        <input
          name="password"
          type={show ? "text" : "password"}
          autoComplete="current-password"
          required
          style={{
            width: "100%",
            padding: "9px 58px 9px 11px",
            borderRadius: 7,
            border: "1px solid #ced0d8",
            background: "#fff",
            color: "#393c41",
            fontSize: 14,
            boxSizing: "border-box",
          }}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          style={{
            position: "absolute",
            right: 6,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#8e8e8e",
            fontSize: 12.5,
            fontWeight: 600,
            padding: "4px 8px",
          }}
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}
