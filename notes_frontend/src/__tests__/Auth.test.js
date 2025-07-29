import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Auth from "../components/Auth";

describe("Auth Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function renderAuth(onAuth = jest.fn()) {
    return render(<Auth onAuth={onAuth} />);
  }

  it("renders Sign In by default and switches to Sign Up", () => {
    renderAuth();
    expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    expect(screen.getByRole("heading", { name: /sign up/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument();
  });

  it("disables submit button with empty input and enables with valid input", () => {
    renderAuth();
    const btn = screen.getByRole("button", { name: /sign in/i });
    expect(btn).toBeDisabled();
    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: "user" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "pass123" } });
    expect(screen.getByRole("button", { name: /sign in/i })).not.toBeDisabled();
  });

  it("handles sign in failure (invalid credentials)", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false })
    );
    renderAuth();
    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: "user" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "bad" } });
    fireEvent.submit(screen.getByRole("button", { name: /sign in/i }));
    expect(screen.getByRole("button", { name: /sign in/i })).toBeDisabled();
    await waitFor(() => expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument());
  });

  it("calls onAuth on successful sign in & stores token", async () => {
    const onAuth = jest.fn();
    const token = "test_token1";
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token }),
      })
    );
    renderAuth(onAuth);
    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: "user" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "good" } });
    fireEvent.submit(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() =>
      expect(onAuth).toHaveBeenCalledWith({ username: "user" }, token)
    );
  });
});
