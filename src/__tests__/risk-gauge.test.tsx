import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  RiskGauge,
  calculateRiskLevel,
  riskColors,
  riskLabels,
} from "../components/risk-gauge";

describe("RiskGauge", () => {
  describe("Score Display", () => {
    it("renders with score", () => {
      render(<RiskGauge score={50} showScore />);
      expect(screen.getByText("50")).toBeInTheDocument();
    });

    it("clamps score to 0-100 range", () => {
      const { rerender } = render(<RiskGauge score={150} showScore />);
      // Should still render (clamped to 100)
      expect(screen.getByRole("meter")).toBeInTheDocument();

      rerender(<RiskGauge score={-50} showScore />);
      expect(screen.getByRole("meter")).toBeInTheDocument();
    });

    it("hides score when showScore is false", () => {
      render(<RiskGauge score={50} showScore={false} />);
      expect(screen.queryByText("50")).not.toBeInTheDocument();
    });
  });

  describe("Risk Level Calculation", () => {
    it("shows low risk for scores 0-25", () => {
      render(<RiskGauge score={20} showLabel />);
      expect(screen.getByText(/low risk/i)).toBeInTheDocument();
    });

    it("shows medium risk for scores 26-50", () => {
      render(<RiskGauge score={40} showLabel />);
      expect(screen.getByText(/medium risk/i)).toBeInTheDocument();
    });

    it("shows high risk for scores 51-75", () => {
      render(<RiskGauge score={65} showLabel />);
      expect(screen.getByText(/high risk/i)).toBeInTheDocument();
    });

    it("shows critical risk for scores 76-100", () => {
      render(<RiskGauge score={85} showLabel />);
      expect(screen.getByText(/critical risk/i)).toBeInTheDocument();
    });

    it("uses custom level when provided", () => {
      render(<RiskGauge score={20} level="critical" showLabel />);
      expect(screen.getByText(/critical risk/i)).toBeInTheDocument();
    });
  });

  describe("Variant: Arc", () => {
    it("renders arc gauge by default", () => {
      const { container } = render(<RiskGauge score={50} variant="arc" />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders SVG with path elements for arc", () => {
      const { container } = render(<RiskGauge score={50} variant="arc" />);
      expect(container.querySelectorAll("path").length).toBeGreaterThanOrEqual(
        2,
      );
    });
  });

  describe("Variant: Bar", () => {
    it("renders bar gauge when variant is bar", () => {
      const { container } = render(<RiskGauge score={50} variant="bar" />);
      expect(container.querySelector(".rounded-full")).toBeInTheDocument();
    });

    it("shows markers for bar gauge", () => {
      render(<RiskGauge score={50} variant="bar" />);
      expect(screen.getByText("0")).toBeInTheDocument();
      expect(screen.getByText("25")).toBeInTheDocument();
      expect(screen.getByText("50")).toBeInTheDocument();
      expect(screen.getByText("75")).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument();
    });

    it("shows percentage for bar gauge", () => {
      render(<RiskGauge score={45} variant="bar" showScore />);
      expect(screen.getByText("45%")).toBeInTheDocument();
    });
  });

  describe("Variant: Circle", () => {
    it("renders circle gauge when variant is circle", () => {
      const { container } = render(<RiskGauge score={50} variant="circle" />);
      expect(container.querySelector("svg")).toBeInTheDocument();
      expect(
        container.querySelectorAll("circle").length,
      ).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Size Variants", () => {
    it("applies sm size class", () => {
      const { container } = render(
        <RiskGauge score={50} size="sm" variant="circle" />,
      );
      expect(container.querySelector(".h-16.w-16")).toBeInTheDocument();
    });

    it("applies md size class (default)", () => {
      const { container } = render(
        <RiskGauge score={50} size="md" variant="circle" />,
      );
      expect(container.querySelector(".h-24.w-24")).toBeInTheDocument();
    });

    it("applies lg size class", () => {
      const { container } = render(
        <RiskGauge score={50} size="lg" variant="circle" />,
      );
      expect(container.querySelector(".h-32.w-32")).toBeInTheDocument();
    });

    it("applies xl size class", () => {
      const { container } = render(
        <RiskGauge score={50} size="xl" variant="circle" />,
      );
      expect(container.querySelector(".h-40.w-40")).toBeInTheDocument();
    });
  });

  describe("Animation", () => {
    it("applies transition class when animated is true", () => {
      const { container } = render(
        <RiskGauge score={50} animated variant="circle" />,
      );
      expect(container.querySelector(".transition-all")).toBeInTheDocument();
    });
  });

  describe("Custom Label", () => {
    it("shows custom label when provided", () => {
      render(<RiskGauge score={50} showLabel label="Portfolio Risk" />);
      expect(screen.getByText("Portfolio Risk")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has role=meter", () => {
      render(<RiskGauge score={50} />);
      expect(screen.getByRole("meter")).toBeInTheDocument();
    });

    it("has aria-valuenow set to score", () => {
      render(<RiskGauge score={65} />);
      expect(screen.getByRole("meter")).toHaveAttribute("aria-valuenow", "65");
    });

    it("has aria-valuemin set to 0", () => {
      render(<RiskGauge score={50} />);
      expect(screen.getByRole("meter")).toHaveAttribute("aria-valuemin", "0");
    });

    it("has aria-valuemax set to 100", () => {
      render(<RiskGauge score={50} />);
      expect(screen.getByRole("meter")).toHaveAttribute("aria-valuemax", "100");
    });

    it("has aria-label with score description", () => {
      render(<RiskGauge score={75} />);
      expect(screen.getByRole("meter")).toHaveAttribute("aria-label");
    });

    it("uses custom label for aria-label when provided", () => {
      render(<RiskGauge score={75} label="Custom risk label" />);
      expect(screen.getByRole("meter")).toHaveAttribute(
        "aria-label",
        "Custom risk label",
      );
    });
  });

  describe("Custom Styling", () => {
    it("applies custom className", () => {
      const { container } = render(
        <RiskGauge score={50} className="custom-class" />,
      );
      // className is passed to inner gauge component, check if it exists somewhere
      expect(container.querySelector(".custom-class")).toBeInTheDocument();
    });

    it("spreads additional props", () => {
      render(<RiskGauge score={50} data-testid="risk-gauge" />);
      expect(screen.getByTestId("risk-gauge")).toBeInTheDocument();
    });
  });
});

describe("calculateRiskLevel", () => {
  it("returns low for scores 0-25", () => {
    expect(calculateRiskLevel(0)).toBe("low");
    expect(calculateRiskLevel(15)).toBe("low");
    expect(calculateRiskLevel(25)).toBe("low");
  });

  it("returns medium for scores 26-50", () => {
    expect(calculateRiskLevel(26)).toBe("medium");
    expect(calculateRiskLevel(40)).toBe("medium");
    expect(calculateRiskLevel(50)).toBe("medium");
  });

  it("returns high for scores 51-75", () => {
    expect(calculateRiskLevel(51)).toBe("high");
    expect(calculateRiskLevel(65)).toBe("high");
    expect(calculateRiskLevel(75)).toBe("high");
  });

  it("returns critical for scores 76-100", () => {
    expect(calculateRiskLevel(76)).toBe("critical");
    expect(calculateRiskLevel(90)).toBe("critical");
    expect(calculateRiskLevel(100)).toBe("critical");
  });
});

describe("riskColors", () => {
  it("has colors for all risk levels", () => {
    expect(riskColors.low).toBeDefined();
    expect(riskColors.medium).toBeDefined();
    expect(riskColors.high).toBeDefined();
    expect(riskColors.critical).toBeDefined();
  });

  it("each level has bg, text, and fill properties", () => {
    Object.values(riskColors).forEach((color) => {
      expect(color).toHaveProperty("bg");
      expect(color).toHaveProperty("text");
      expect(color).toHaveProperty("fill");
    });
  });
});

describe("riskLabels", () => {
  it("has labels for all risk levels", () => {
    expect(riskLabels.low).toBe("Low Risk");
    expect(riskLabels.medium).toBe("Medium Risk");
    expect(riskLabels.high).toBe("High Risk");
    expect(riskLabels.critical).toBe("Critical Risk");
  });
});
