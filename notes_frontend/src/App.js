import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import NotesList from "./components/NotesList";
import NoteEditor from "./components/NoteEditor";
import Auth from "./components/Auth";

// Demo: set this to your backend API URL in production
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

// PUBLIC_INTERFACE
function App() {
  // Theme management (dark/light)
  const [theme, setTheme] = useState("dark");

  // Auth state
  const [user, setUser] = useState(null);

  // Notes/folders/tags state
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [folders, setFolders] = useState([]);
  const [activeFolder, setActiveFolder] = useState(null);
  const [tags, setTags] = useState([]);
  const [activeTag, setActiveTag] = useState(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Load user on mount (check localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("notes_user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // ========== AUTH HANDLERS ==========
  // PUBLIC_INTERFACE
  const handleLogin = (userObj, token) => {
    setUser(userObj);
    localStorage.setItem("notes_user", JSON.stringify(userObj));
    localStorage.setItem("notes_token", token);
  };

  // PUBLIC_INTERFACE
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("notes_user");
    localStorage.removeItem("notes_token");
  };

  // ========== DATA FETCH ==========
  // PUBLIC_INTERFACE
  const fetchNotes = useCallback(() => {
    if (!user) return;
    fetch(`${API_BASE_URL}/notes/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("notes_token")}` },
    })
      .then((res) => res.json())
      .then((data) => setNotes(data.notes || []))
      .catch(() => setNotes([]));
  }, [user]);

  // PUBLIC_INTERFACE
  const fetchFoldersAndTags = useCallback(() => {
    if (!user) return;
    fetch(`${API_BASE_URL}/folders/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("notes_token")}` },
    })
      .then((res) => res.json())
      .then((data) => setFolders(data.folders || []))
      .catch(() => setFolders([]));
    fetch(`${API_BASE_URL}/tags/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("notes_token")}` },
    })
      .then((res) => res.json())
      .then((data) => setTags(data.tags || []))
      .catch(() => setTags([]));
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchNotes();
      fetchFoldersAndTags();
    }
  }, [user, fetchNotes, fetchFoldersAndTags]);

  // ========== NOTE CRUD HANDLERS ==========
  // Create new note
  // PUBLIC_INTERFACE
  const handleCreateNote = (folderId = null, tagIds = []) => {
    fetch(`${API_BASE_URL}/notes/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("notes_token")}`,
      },
      body: JSON.stringify({
        title: "Untitled Note",
        content: "",
        folder_id: folderId,
        tags: tagIds,
      }),
    })
      .then((res) => res.json())
      .then((note) => {
        setNotes((prev) => [note, ...prev]);
        setSelectedNoteId(note.id);
      });
  };

  // Update note
  // PUBLIC_INTERFACE
  const handleUpdateNote = (noteId, updateObj) => {
    fetch(`${API_BASE_URL}/notes/${noteId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("notes_token")}`,
      },
      body: JSON.stringify(updateObj),
    })
      .then((res) => res.json())
      .then((updatedNote) => {
        setNotes((prev) => prev.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
      });
  };

  // Delete note
  // PUBLIC_INTERFACE
  const handleDeleteNote = (noteId) => {
    fetch(`${API_BASE_URL}/notes/${noteId}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("notes_token")}`,
      },
    }).then(() => {
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      setSelectedNoteId(null);
    });
  };

  // ========== FOLDER & TAG HANDLERS ==========
  // These can mirror note CRUD pattern (not shown for brevity)

  // Filtered notes list for sidebar/folder/tag/search
  const filteredNotes = notes
    .filter((note) =>
      activeFolder ? note.folder_id === activeFolder : true
    )
    .filter((note) =>
      activeTag ? (note.tags || []).includes(activeTag) : true
    )
    .filter((note) =>
      searchTerm ? (note.title + note.content).toLowerCase().includes(searchTerm.toLowerCase()) : true
    );

  // Get selected note object
  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  // ========== RENDER ==========
  if (!user) {
    return (
      <div className="App">
        <Auth onAuth={handleLogin} />
      </div>
    );
  }

  return (
    <div className="App" style={{ display: "flex", width: "100vw", height: "100vh", flexDirection: "column" }}>
      <Navbar
        user={user}
        onLogout={handleLogout}
        theme={theme}
        setTheme={setTheme}
        onSearch={setSearchTerm}
      />
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <Sidebar
          folders={folders}
          activeFolder={activeFolder}
          setActiveFolder={setActiveFolder}
          tags={tags}
          activeTag={activeTag}
          setActiveTag={setActiveTag}
          onCreateNote={handleCreateNote}
        />
        <main style={{ flex: 1, minHeight: 0, overflow: "auto", backgroundColor: "var(--bg-secondary)" }}>
          <div className="container-notes-area" style={{ display: "flex", height: "100%" }}>
            <NotesList
              notes={filteredNotes}
              selectedNoteId={selectedNoteId}
              setSelectedNoteId={setSelectedNoteId}
              onDeleteNote={handleDeleteNote}
              onCreateNote={handleCreateNote}
            />
            <NoteEditor
              key={selectedNoteId}
              note={selectedNote}
              onChange={(update) => handleUpdateNote(selectedNoteId, update)}
              onDelete={() => handleDeleteNote(selectedNoteId)}
              onRename={(title) => handleUpdateNote(selectedNoteId, { title })}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
