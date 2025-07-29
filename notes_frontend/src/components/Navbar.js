import React from "react";
import "./Navbar.css";

// PUBLIC_INTERFACE
export default function Navbar({ user, onLogout, theme, setTheme, onSearch }) {
  return (
    <nav className="navbar">
      <div className="navbar-title">🗒️ Notes</div>
      <input
        className="navbar-search"
        type="search"
        placeholder="Search notes..."
        onChange={(e) => onSearch(e.target.value)}
        aria-label="Search notes"
      />
      <div className="navbar-actions">
        <button
          className="navbar-theme-btn"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        <div className="navbar-user">
          <span>{user && user.username}</span>
          <button className="navbar-logout-btn" onClick={onLogout} title="Sign out">
            ⎋
          </button>
        </div>
      </div>
    </nav>
  );
}
