import React from "react";
import "./Sidebar.css";

// PUBLIC_INTERFACE
export default function Sidebar({
  folders,
  activeFolder,
  setActiveFolder,
  tags,
  activeTag,
  setActiveTag,
  onCreateNote,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-header">
          <span>Folders</span>
          <button onClick={() => onCreateNote(null, [])} className="sidebar-btn" title="New note in root">＋</button>
        </div>
        <ul className="sidebar-list">
          <li
            className={activeFolder == null ? "active" : ""}
            onClick={() => setActiveFolder(null)}
          >
            All
          </li>
          {folders.map((folder) => (
            <li
              key={folder.id}
              className={activeFolder === folder.id ? "active" : ""}
              onClick={() => setActiveFolder(folder.id)}
            >
              {folder.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="sidebar-section">
        <div className="sidebar-header">
          <span>Tags</span>
        </div>
        <ul className="sidebar-list">
          <li
            className={activeTag == null ? "active" : ""}
            onClick={() => setActiveTag(null)}
          >
            All
          </li>
          {tags.map((tag) => (
            <li
              key={tag.id}
              className={activeTag === tag.id ? "active" : ""}
              onClick={() => setActiveTag(tag.id)}
            >
              #{tag.name}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
