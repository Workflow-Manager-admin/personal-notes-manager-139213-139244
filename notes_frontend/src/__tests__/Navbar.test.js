import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../components/Navbar";

describe("Navbar Component", () => {
  const user = { username: "alice" };

  it("renders user and calls logout", () => {
    const handleLogout = jest.fn();
    render(
      <Navbar
        user={user}
        onLogout={handleLogout}
        theme="dark"
        setTheme={jest.fn()}
        onSearch={jest.fn()}
      />
    );
    expect(screen.getByText(/alice/i)).toBeInTheDocument();
    fireEvent.click(screen.getByTitle(/sign out/i));
    expect(handleLogout).toHaveBeenCalled();
  });

  it("calls onSearch on input", () => {
    const onSearch = jest.fn();
    render(
      <Navbar
        user={user}
        onLogout={jest.fn()}
        theme="dark"
        setTheme={jest.fn()}
        onSearch={onSearch}
      />
    );
    fireEvent.change(screen.getByPlaceholderText(/search notes/i), {
      target: { value: "foo" },
    });
    expect(onSearch).toHaveBeenCalledWith("foo");
  });

  it("toggles theme", () => {
    const setTheme = jest.fn();
    const { rerender } = render(
      <Navbar
        user={user}
        onLogout={jest.fn()}
        theme="dark"
        setTheme={setTheme}
        onSearch={jest.fn()}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /switch to light mode/i }));
    expect(setTheme).toHaveBeenCalledWith("light");

    rerender(
      <Navbar
        user={user}
        onLogout={jest.fn()}
        theme="light"
        setTheme={setTheme}
        onSearch={jest.fn()}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /switch to dark mode/i }));
    expect(setTheme).toHaveBeenCalledWith("dark");
  });
});
