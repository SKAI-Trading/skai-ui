import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatCard } from "../components/data-display/stat-card";
import { DollarSign } from "lucide-react";

describe("StatCard", () => {
  it("renders title and value", () => {
    render(<StatCard title="Total Revenue" value="$1,234" />);
    expect(screen.getByText("Total Revenue")).toBeInTheDocument();
    expect(screen.getByText("$1,234")).toBeInTheDocument();
  });

  it("shows positive change with green color", () => {
    render(<StatCard title="Users" value="100" change={5.5} />);
    // Check that green class is applied to the change container
    const changeSpan = screen.getByText(/\+/).closest("span");
    expect(changeSpan).toHaveClass("text-green-500");
  });

  it("shows negative change with red color", () => {
    render(<StatCard title="Bounce" value="42%" change={-3.2} />);
    // The negative change is split across text nodes: "-3.20" and "%"
    const container = screen.getByText(/24h/).parentElement;
    expect(container).toHaveClass("text-red-500");
  });

  it("displays change period", () => {
    render(
      <StatCard title="Revenue" value="$1,234" change={10} changePeriod="7d" />,
    );
    expect(screen.getByText("7d")).toBeInTheDocument();
  });

  it("renders icon when provided as ReactNode", () => {
    render(
      <StatCard
        title="Revenue"
        value="$5,000"
        icon={<DollarSign data-testid="dollar-icon" className="h-4 w-4" />}
      />,
    );
    expect(screen.getByTestId("dollar-icon")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    render(<StatCard title="Revenue" value="$1,234" loading />);
    // Loading state shows skeleton placeholders
    const skeleton = document.querySelector(".animate-pulse");
    expect(skeleton).toBeInTheDocument();
  });

  it("applies compact variant styles", () => {
    const { container } = render(
      <StatCard title="Price" value="$123.45" compact />,
    );
    // Compact variant uses different layout
    const flexContainer = container.querySelector(
      ".flex.items-center.justify-between",
    );
    expect(flexContainer).toBeInTheDocument();
  });

  it("shows subtitle when provided", () => {
    render(
      <StatCard title="Active Users" value="1,234" subtitle="Monthly active" />,
    );
    expect(screen.getByText("Monthly active")).toBeInTheDocument();
  });

  it("uses default change period of 24h", () => {
    render(<StatCard title="Price" value="$100" change={5} />);
    expect(screen.getByText("24h")).toBeInTheDocument();
  });
});
