import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "../components/navigation/pagination";

describe("Pagination", () => {
  it("renders a navigation landmark with label", () => {
    render(
      <Pagination>
        <PaginationContent />
      </Pagination>,
    );
    const nav = screen.getByRole("navigation", { name: "Pagination" });
    expect(nav).toBeInTheDocument();
  });

  it("marks the active page with aria-current=page", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );
    expect(screen.getByText("1")).toHaveAttribute("aria-current", "page");
  });

  it("renders Previous and Next labels with aria-labels", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );
    expect(screen.getByLabelText("Go to previous page")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to next page")).toBeInTheDocument();
  });

  it("PaginationEllipsis exposes screen-reader text 'More pages'", () => {
    render(<PaginationEllipsis />);
    expect(screen.getByText("More pages")).toBeInTheDocument();
  });
});
