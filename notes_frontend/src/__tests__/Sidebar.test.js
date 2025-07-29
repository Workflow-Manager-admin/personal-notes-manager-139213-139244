import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "../components/Sidebar";

describe("Sidebar Component", () => {
  const folders = [{ id: 1, name: "Work" }, { id: 2, name: "Personal" }];
  const tags = [{ id: 10, name: "urgent" }, { id: 11, name: "idea" }];

  it("renders folders and tags, sets active", () => {
    const setActiveFolder = jest.fn();
    const setActiveTag = jest.fn();
    render(
      <Sidebar
        folders={folders}
        activeFolder={1}
        setActiveFolder={setActiveFolder}
        tags={tags}
        activeTag={11}
        setActiveTag={setActiveTag}
        onCreateNote={jest.fn()}
      />
    );
    // All and both folders
    expect(screen.getByText("Folders")).toBeInTheDocument();
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(screen.getByText("Personal")).toBeInTheDocument();
    expect(screen.getAllByText("All")[1]).toBeInTheDocument();
    expect(screen.getByText("#urgent")).toBeInTheDocument();
    expect(screen.getByText("#idea")).toBeInTheDocument();
    // Click folder All
    fireEvent.click(screen.getAllByText("All")[0]);
    expect(setActiveFolder).toHaveBeenCalledWith(null);
    // Click second folder
    fireEvent.click(screen.getByText("Personal"));
    expect(setActiveFolder).toHaveBeenCalledWith(2);
    // Click tag All
    fireEvent.click(screen.getAllByText("All")[1]);
    expect(setActiveTag).toHaveBeenCalledWith(null);
    // Click tag
    fireEvent.click(screen.getByText("#idea"));
    expect(setActiveTag).toHaveBeenCalledWith(11);
  });

  it("calls onCreateNote from root", () => {
    const onCreate = jest.fn();
    render(
      <Sidebar
        folders={folders}
        activeFolder={null}
        setActiveFolder={jest.fn()}
        tags={tags}
        activeTag={null}
        setActiveTag={jest.fn()}
        onCreateNote={onCreate}
      />
    );
    fireEvent.click(screen.getByTitle("New note in root"));
    expect(onCreate).toHaveBeenCalledWith(null, []);
  });
});
