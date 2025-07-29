import React, { useState } from "react";
import "./Auth.css";

// PUBLIC_INTERFACE
export default function Auth({ onAuth }) {
  const [form, setForm] = useState("signin"); // or "signup"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // PUBLIC_INTERFACE
  const handleSwitch = () => {
    setError("");
    setForm(form === "signin" ? "signup" : "signin");
  };

  // PUBLIC_INTERFACE
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const url =
      form === "signin"
        ? (process.env.REACT_APP_API_BASE_URL || "http://localhost:8000") + "/auth/login/"
        : (process.env.REACT_APP_API_BASE_URL || "http://localhost:8000") + "/auth/signup/";

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Authentication failed");
        return res.json();
      })
      .then((data) => {
        if (data && data.token) {
          onAuth({ username }, data.token);
        } else {
          setError("Failed to authenticate.");
        }
      })
      .catch(() => setError("Invalid credentials or server error."))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="auth-panel">
      <h2>{form === "signin" ? "Sign In" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="auth-input"
          placeholder="Username"
          value={username}
          minLength={3}
          autoFocus
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="auth-input"
          placeholder="Password"
          value={password}
          minLength={4}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="auth-error">{error}</div>}
        <button className="auth-btn" type="submit" disabled={isLoading || !username || !password}>
          {isLoading ? "..." : form === "signin" ? "Sign In" : "Sign Up"}
        </button>
      </form>
      <div className="auth-switch">
        {form === "signin" ? (
          <>
            New here?{" "}
            <button type="button" onClick={handleSwitch}>
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button type="button" onClick={handleSwitch}>
              Sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
}
