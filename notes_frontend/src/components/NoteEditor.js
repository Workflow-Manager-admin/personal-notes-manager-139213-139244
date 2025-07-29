import React, { useState, useEffect } from "react";
import "./NoteEditor.css";

// PUBLIC_INTERFACE
export default function NoteEditor({ note, onChange, onDelete, onRename }) {
  const [title, setTitle] = useState(note ? note.title : "");
  const [content, setContent] = useState(note ? note.content : "");

  useEffect(() => {
    setTitle(note ? note.title : "");
    setContent(note ? note.content : "");
  }, [note]);

  if (!note) {
    return (
      <section className="note-editor note-editor-empty">
        <div>Select a note to view or edit</div>
      </section>
    );
  }

  // PUBLIC_INTERFACE
  const handleSave = () => {
    onChange({ title, content });
  };

  // PUBLIC_INTERFACE
  const handleRename = (e) => {
    setTitle(e.target.value);
    onRename(e.target.value);
  };

  return (
    <section className="note-editor">
      <header className="note-editor-header">
        <input
          className="note-title-input"
          value={title}
          onChange={handleRename}
          onBlur={handleSave}
          placeholder="Title"
        />
        <button className="note-delete-btn" title="Delete note" onClick={onDelete}>
          🗑️
        </button>
      </header>
      <textarea
        className="note-content-input"
        value={content}
        placeholder="Your note..."
        onChange={(e) => setContent(e.target.value)}
        onBlur={handleSave}
        rows={18}
      />
    </section>
  );
}
