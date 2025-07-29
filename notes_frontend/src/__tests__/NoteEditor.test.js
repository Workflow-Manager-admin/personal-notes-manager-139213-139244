import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NoteEditor from "../components/NoteEditor";

describe("NoteEditor Component", () => {
  const note = { id: 42, title: "Foo Note", content: "Bar content" };

  it("shows message when no note is selected", () => {
    render(
      <NoteEditor note={null} onChange={jest.fn()} onDelete={jest.fn()} onRename={jest.fn()} />
    );
    expect(screen.getByText(/select a note to view or edit/i)).toBeInTheDocument();
  });

  it("renders title and content input", () => {
    render(
      <NoteEditor note={note} onChange={jest.fn()} onDelete={jest.fn()} onRename={jest.fn()} />
    );
    expect(screen.getByDisplayValue("Foo Note")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Bar content")).toBeInTheDocument();
  });

  it("calls onRename as title changes and onChange as blur is triggered", () => {
    const onRename = jest.fn();
    const onChange = jest.fn();
    render(
      <NoteEditor note={note} onChange={onChange} onDelete={jest.fn()} onRename={onRename} />
    );
    fireEvent.change(screen.getByPlaceholderText("Title"), { target: { value: "New title" } });
    expect(onRename).toHaveBeenCalledWith("New title");
    fireEvent.blur(screen.getByPlaceholderText("Title"));
    expect(onChange).toHaveBeenCalledWith({ title: "New title", content: "Bar content" });
  });

  it("calls onChange for content edit and blur, and onDelete when delete clicked", () => {
    const onChange = jest.fn();
    const onDelete = jest.fn();
    render(
      <NoteEditor note={note} onChange={onChange} onDelete={onDelete} onRename={jest.fn()} />
    );
    const contentInput = screen.getByPlaceholderText("Your note...");
    fireEvent.change(contentInput, { target: { value: "New Content" } });
    fireEvent.blur(contentInput);
    expect(onChange).toHaveBeenCalledWith({ title: "Foo Note", content: "New Content" });
    fireEvent.click(screen.getByTitle(/delete note/i));
    expect(onDelete).toHaveBeenCalled();
  });
});
