import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card";

describe("Card", () => {
  it("renders Card correctly", () => {
    render(<Card data-testid="card">Card Content</Card>);
    expect(screen.getByTestId("card")).toBeInTheDocument();
    expect(screen.getByText("Card Content")).toBeInTheDocument();
  });

  it("renders CardHeader correctly", () => {
    render(<CardHeader data-testid="header">Header Content</CardHeader>);
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("renders CardTitle correctly", () => {
    render(<CardTitle>My Title</CardTitle>);
    expect(screen.getByText("My Title")).toBeInTheDocument();
  });

  it("renders CardDescription correctly", () => {
    render(<CardDescription>My Description</CardDescription>);
    expect(screen.getByText("My Description")).toBeInTheDocument();
    expect(screen.getByText("My Description")).toHaveClass(
      "text-muted-foreground",
    );
  });

  it("renders CardContent correctly", () => {
    render(<CardContent data-testid="content">Main Content</CardContent>);
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("renders CardFooter correctly", () => {
    render(<CardFooter data-testid="footer">Footer Content</CardFooter>);
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("renders full card structure", () => {
    render(
      <Card data-testid="full-card">
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );

    expect(screen.getByTestId("full-card")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("applies custom className to Card", () => {
    render(
      <Card className="custom-card" data-testid="card">
        Content
      </Card>,
    );
    expect(screen.getByTestId("card")).toHaveClass("custom-card");
  });

  it("applies custom className to CardHeader", () => {
    render(
      <CardHeader className="custom-header" data-testid="header">
        Header
      </CardHeader>,
    );
    expect(screen.getByTestId("header")).toHaveClass("custom-header");
  });

  it("applies custom className to CardTitle", () => {
    render(<CardTitle className="custom-title">Title</CardTitle>);
    expect(screen.getByText("Title")).toHaveClass("custom-title");
  });

  it("applies custom className to CardContent", () => {
    render(
      <CardContent className="custom-content" data-testid="content">
        Content
      </CardContent>,
    );
    expect(screen.getByTestId("content")).toHaveClass("custom-content");
  });

  it("applies custom className to CardFooter", () => {
    render(
      <CardFooter className="custom-footer" data-testid="footer">
        Footer
      </CardFooter>,
    );
    expect(screen.getByTestId("footer")).toHaveClass("custom-footer");
  });

  it("Card has correct base styles", () => {
    render(<Card data-testid="card">Content</Card>);
    const card = screen.getByTestId("card");
    expect(card).toHaveClass("rounded-lg");
    expect(card).toHaveClass("border");
    expect(card).toHaveClass("bg-card");
  });

  it("CardFooter has flex layout", () => {
    render(<CardFooter data-testid="footer">Footer</CardFooter>);
    expect(screen.getByTestId("footer")).toHaveClass("flex");
  });
});
