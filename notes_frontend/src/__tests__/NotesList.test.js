import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NotesList from "../components/NotesList";

describe("NotesList Component", () => {
  const defaultNotes = [
    { id: 1, title: "Note 1", content: "alpha" },
    { id: 2, title: "Note 2", content: "beta" },
  ];

  it("renders the notes and highlights the selected note", () => {
    render(
      <NotesList
        notes={defaultNotes}
        selectedNoteId={1}
        setSelectedNoteId={jest.fn()}
        onDeleteNote={jest.fn()}
        onCreateNote={jest.fn()}
      />
    );
    expect(screen.getByText("Note 1")).toBeInTheDocument();
    expect(screen.getByText("Note 2")).toBeInTheDocument();
    // Selected has class "active"
    const items = screen.getAllByRole("listitem");
    expect(items[0].className).toContain("active");
  });

  it("calls setSelectedNoteId on note click and onDeleteNote on delete click", () => {
    const setSelected = jest.fn();
    const onDelete = jest.fn();
    render(
      <NotesList
        notes={defaultNotes}
        selectedNoteId={2}
        setSelectedNoteId={setSelected}
        onDeleteNote={onDelete}
        onCreateNote={jest.fn()}
      />
    );
    // Click first note item
    const noteItem = screen.getByText("Note 1").closest("li");
    fireEvent.click(noteItem);
    expect(setSelected).toHaveBeenCalledWith(1);

    // Click delete button (stops propagation)
    const deleteBtn = screen.getAllByTitle("Delete note")[0];
    fireEvent.click(deleteBtn, { stopPropagation: jest.fn() });
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it("calls onCreateNote when add button is clicked", () => {
    const onCreate = jest.fn();
    render(
      <NotesList
        notes={defaultNotes}
        selectedNoteId={null}
        setSelectedNoteId={jest.fn()}
        onDeleteNote={jest.fn()}
        onCreateNote={onCreate}
      />
    );
    fireEvent.click(screen.getByTitle(/add new note/i));
    expect(onCreate).toHaveBeenCalled();
  });
});
