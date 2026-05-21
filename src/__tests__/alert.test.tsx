import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Alert, AlertTitle, AlertDescription } from "../components/feedback/alert";

describe("Alert", () => {
  it("uses role=alert and renders title + description", () => {
    render(
      <Alert>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>Be careful.</AlertDescription>
      </Alert>,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Heads up!")).toBeInTheDocument();
    expect(screen.getByText("Be careful.")).toBeInTheDocument();
  });

  it("applies destructive variant class", () => {
    render(<Alert variant="destructive">Bad</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("text-destructive");
  });

  it("applies success variant class", () => {
    render(<Alert variant="success">Good</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("text-green-500");
  });

  it("applies warning variant class", () => {
    render(<Alert variant="warning">Hmm</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("text-yellow-500");
  });

  it("applies info variant class", () => {
    render(<Alert variant="info">FYI</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("text-blue-500");
  });

  it("applies profit/loss variants for trading contexts", () => {
    const { rerender } = render(<Alert variant="profit">Up</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("text-green-400");
    rerender(<Alert variant="loss">Down</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("text-red-400");
  });

  it("renders AlertTitle as h5", () => {
    render(<AlertTitle>Title</AlertTitle>);
    expect(screen.getByText("Title").tagName).toBe("H5");
  });

  it("forwards className on Alert wrapper", () => {
    render(<Alert className="my-extra">Hi</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("my-extra");
  });
});
