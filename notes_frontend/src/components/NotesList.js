import React from "react";
import "./NotesList.css";

// PUBLIC_INTERFACE
export default function NotesList({
  notes,
  selectedNoteId,
  setSelectedNoteId,
  onDeleteNote,
  onCreateNote,
}) {
  return (
    <section className="notes-list">
      <header className="notes-list-header">
        <div>Notes</div>
        <button className="notes-new-btn" title="Add new note" onClick={() => onCreateNote()}>
          ＋
        </button>
      </header>
      <ul>
        {notes.map((note) => (
          <li
            key={note.id}
            className={note.id === selectedNoteId ? "active" : ""}
            onClick={() => setSelectedNoteId(note.id)}
          >
            <div className="notes-item-header">
              <span className="notes-title">{note.title || "Untitled"}</span>
              <button
                className="notes-delete-btn"
                title="Delete note"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note.id);
                }}
              >
                🗑️
              </button>
            </div>
            <div className="notes-snippet">
              {note.content ? note.content.substring(0, 45) + (note.content.length > 45 ? "..." : "") : ""}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
