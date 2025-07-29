import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";

const flushPromises = () => new Promise(setImmediate);

describe("App Integration Flows", () => {
  let realFetch, realLocalStorage;
  beforeAll(() => {
    realFetch = global.fetch;
    realLocalStorage = global.localStorage;
  });
  afterEach(() => {
    global.fetch = realFetch;
    global.localStorage = realLocalStorage;
    jest.clearAllMocks();
  });

  function mockLocalStorage(store = {}) {
    const storage = { ...store };
    return {
      getItem: (k) => storage[k] || null,
      setItem: (k, v) => (storage[k] = v),
      removeItem: (k) => delete storage[k],
    };
  }

  it("auth flow: successful login saves user and renders main UI", async () => {
    global.localStorage = mockLocalStorage();
    global.fetch = jest.fn((url, opts) => {
      if (url.includes("/auth/login/")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ token: "zzz123" }),
        });
      }
      if (url.endsWith("/notes/")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ notes: [] }),
        });
      }
      if (url.endsWith("/folders/")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ folders: [] }),
        });
      }
      if (url.endsWith("/tags/")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ tags: [] }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: "bob" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "pw1234" } });
    fireEvent.submit(screen.getByRole("button", { name: /sign in/i }));
    // Wait for notes UI
    await waitFor(() => expect(screen.getByText("Notes")).toBeInTheDocument());
    expect(global.localStorage.getItem("notes_user")).toContain("bob");
    expect(global.localStorage.getItem("notes_token")).toEqual("zzz123");
  });

  it("creates and selects a new note", async () => {
    global.localStorage = mockLocalStorage({
      notes_user: JSON.stringify({ username: "alice" }),
      notes_token: "tok1",
    });
    // get/fetch stubs
    const testNotes = [{ id: 5, title: "Welcome", content: "hello content" }];
    global.fetch = jest.fn((url, opts) => {
      if (url.endsWith("/notes/") && opts?.method === "POST") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: 6, title: "Untitled Note", content: "" }),
        });
      }
      if (url.endsWith("/notes/")) {
        if (opts && opts.method === "POST") return;
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ notes: testNotes }),
        });
      }
      if (url.endsWith("/folders/")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ folders: [] }) });
      }
      if (url.endsWith("/tags/")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ tags: [] }) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    render(<App />);
    await waitFor(() => expect(screen.getByText("Notes")).toBeInTheDocument());
    fireEvent.click(screen.getByTitle(/add new note/i));
    await waitFor(() => expect(screen.getAllByText("Untitled Note")[0]).toBeInTheDocument());
  });

  it("switches theme from dark to light and back", async () => {
    global.localStorage = mockLocalStorage({
      notes_user: JSON.stringify({ username: "john" }),
      notes_token: "tok2",
    });
    // stubs for fetches
    global.fetch = jest.fn((url, opts) => {
      if (url.endsWith("/notes/")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ notes: [] }) });
      }
      if (url.endsWith("/folders/")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ folders: [] }) });
      }
      if (url.endsWith("/tags/")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ tags: [] }) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
    render(<App />);
    await waitFor(() => expect(screen.getByText("Notes")).toBeInTheDocument());
    const themeBtn = screen.getByRole("button", { name: /switch to light mode/i });
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    fireEvent.click(themeBtn);
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    fireEvent.click(screen.getByRole("button", { name: /switch to dark mode/i }));
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("searches for notes using the Navbar", async () => {
    global.localStorage = mockLocalStorage({
      notes_user: JSON.stringify({ username: "em" }),
      notes_token: "tok3",
    });
    // Two notes with different titles/content
    const notes = [
      { id: 1, title: "Alpha", content: "first" },
      { id: 2, title: "Bravo", content: "second" },
    ];
    global.fetch = jest.fn((url, opts) => {
      if (url.endsWith("/notes/")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ notes }) });
      }
      if (url.endsWith("/folders/")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ folders: [] }) });
      }
      if (url.endsWith("/tags/")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ tags: [] }) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    render(<App />);
    await waitFor(() => expect(screen.getByText("Alpha")).toBeInTheDocument());
    // Initial render: both notes
    expect(screen.getByText("Bravo")).toBeInTheDocument();
    // Search: only Alpha appears
    fireEvent.change(screen.getByPlaceholderText(/search notes/i), { target: { value: "alpha" } });
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Bravo")).not.toBeInTheDocument();
    // Clear search: both present
    fireEvent.change(screen.getByPlaceholderText(/search notes/i), { target: { value: "" } });
    expect(screen.getByText("Bravo")).toBeInTheDocument();
  });
});
