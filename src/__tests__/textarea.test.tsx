/// <reference types="vitest/globals" />
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Textarea } from "../components/core/textarea";

describe("Textarea a11y", () => {
  it("renders a basic textarea", () => {
    render(<Textarea aria-label="notes" />);
    expect(screen.getByLabelText("notes")).toBeInTheDocument();
  });

  it("sets aria-invalid and exposes error message via aria-describedby", () => {
    render(<Textarea aria-label="msg" error="Too short" />);
    const ta = screen.getByLabelText("msg") as HTMLTextAreaElement;
    expect(ta.getAttribute("aria-invalid")).toBe("true");
    const describedBy = ta.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    const errEl = document.getElementById(describedBy!);
    expect(errEl).not.toBeNull();
    expect(errEl?.textContent).toBe("Too short");
    expect(errEl?.getAttribute("role")).toBe("alert");
  });

  it("renders description when no error and links via aria-describedby", () => {
    render(<Textarea aria-label="msg" description="Up to 500 characters" />);
    const ta = screen.getByLabelText("msg") as HTMLTextAreaElement;
    expect(ta.getAttribute("aria-invalid")).toBeNull();
    const id = ta.getAttribute("aria-describedby")!;
    expect(document.getElementById(id)?.textContent).toBe("Up to 500 characters");
  });

  it("error takes precedence over description for visibility", () => {
    render(
      <Textarea aria-label="msg" description="desc text" error="bad input" />,
    );
    expect(screen.queryByText("desc text")).toBeNull();
    expect(screen.getByText("bad input")).toBeInTheDocument();
  });

  it("merges consumer aria-describedby with internal IDs", () => {
    render(
      <Textarea
        aria-label="msg"
        aria-describedby="consumer-id"
        description="d"
      />,
    );
    const ta = screen.getByLabelText("msg");
    expect(ta.getAttribute("aria-describedby")).toMatch(/^consumer-id /);
  });
});
