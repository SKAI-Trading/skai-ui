import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Stepper,
  StepperContent,
  type StepperStep,
} from "../components/layout/stepper";

const defaultSteps: StepperStep[] = [
  { id: "1", title: "Account" },
  { id: "2", title: "Profile" },
  { id: "3", title: "Review" },
];

describe("Stepper", () => {
  describe("Rendering", () => {
    it("should render all steps", () => {
      render(<Stepper steps={defaultSteps} currentStep={0} />);

      expect(screen.getByText("Account")).toBeInTheDocument();
      expect(screen.getByText("Profile")).toBeInTheDocument();
      expect(screen.getByText("Review")).toBeInTheDocument();
    });

    it("should render step numbers by default", () => {
      render(<Stepper steps={defaultSteps} currentStep={0} />);

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("should hide step numbers when showNumbers is false", () => {
      render(
        <Stepper steps={defaultSteps} currentStep={0} showNumbers={false} />,
      );

      expect(screen.queryByText("1")).not.toBeInTheDocument();
    });

    it("should render step descriptions", () => {
      const stepsWithDescriptions: StepperStep[] = [
        { id: "1", title: "Account", description: "Create your account" },
        { id: "2", title: "Profile", description: "Set up your profile" },
      ];

      render(<Stepper steps={stepsWithDescriptions} currentStep={0} />);

      expect(screen.getByText("Create your account")).toBeInTheDocument();
      expect(screen.getByText("Set up your profile")).toBeInTheDocument();
    });

    it("should show optional label for optional steps", () => {
      const stepsWithOptional: StepperStep[] = [
        { id: "1", title: "Account" },
        { id: "2", title: "Profile", optional: true },
      ];

      render(<Stepper steps={stepsWithOptional} currentStep={0} />);

      expect(screen.getByText("(optional)")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <Stepper
          steps={defaultSteps}
          currentStep={0}
          className="custom-class"
        />,
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("Step status", () => {
    it("should mark completed steps with checkmark", () => {
      render(<Stepper steps={defaultSteps} currentStep={2} />);

      // First two steps should show checkmarks (completed)
      const buttons = screen.getAllByRole("button");
      expect(buttons[0].querySelector("svg")).toBeInTheDocument(); // Check icon
      expect(buttons[1].querySelector("svg")).toBeInTheDocument(); // Check icon
    });

    it("should highlight current step", () => {
      render(<Stepper steps={defaultSteps} currentStep={1} />);

      // Current step should have aria-current
      const currentStep = screen.getByRole("listitem", { current: "step" });
      expect(currentStep).toBeInTheDocument();
    });

    it("should style upcoming steps differently", () => {
      render(<Stepper steps={defaultSteps} currentStep={0} />);

      // Upcoming steps should have muted styling
      const profileText = screen.getByText("Profile");
      expect(profileText).toHaveClass("text-muted-foreground");
    });
  });

  describe("Navigation", () => {
    it("should call onStepClick when completed step is clicked", () => {
      const handleStepClick = vi.fn();

      render(
        <Stepper
          steps={defaultSteps}
          currentStep={2}
          onStepClick={handleStepClick}
        />,
      );

      const buttons = screen.getAllByRole("button");
      fireEvent.click(buttons[0]); // Click first (completed) step

      expect(handleStepClick).toHaveBeenCalledWith(0);
    });

    it("should not call onStepClick when current step is clicked", () => {
      const handleStepClick = vi.fn();

      render(
        <Stepper
          steps={defaultSteps}
          currentStep={1}
          onStepClick={handleStepClick}
        />,
      );

      const buttons = screen.getAllByRole("button");
      fireEvent.click(buttons[1]); // Click current step

      expect(handleStepClick).not.toHaveBeenCalled();
    });

    it("should not call onStepClick when upcoming step is clicked", () => {
      const handleStepClick = vi.fn();

      render(
        <Stepper
          steps={defaultSteps}
          currentStep={0}
          onStepClick={handleStepClick}
        />,
      );

      const buttons = screen.getAllByRole("button");
      fireEvent.click(buttons[2]); // Click upcoming step

      expect(handleStepClick).not.toHaveBeenCalled();
    });

    it("should disable navigation when clickable is false", () => {
      const handleStepClick = vi.fn();

      render(
        <Stepper
          steps={defaultSteps}
          currentStep={2}
          onStepClick={handleStepClick}
          clickable={false}
        />,
      );

      const buttons = screen.getAllByRole("button");
      fireEvent.click(buttons[0]);

      expect(handleStepClick).not.toHaveBeenCalled();
    });
  });

  describe("Orientation", () => {
    it("should render horizontally by default", () => {
      const { container } = render(
        <Stepper steps={defaultSteps} currentStep={0} />,
      );

      expect(container.firstChild).toHaveClass("flex-row");
    });

    it("should render vertically when orientation is vertical", () => {
      const { container } = render(
        <Stepper steps={defaultSteps} currentStep={0} orientation="vertical" />,
      );

      expect(container.firstChild).toHaveClass("flex-col");
    });
  });

  describe("Size variants", () => {
    it("should render small size", () => {
      render(<Stepper steps={defaultSteps} currentStep={0} size="sm" />);

      const buttons = screen.getAllByRole("button");
      expect(buttons[0]).toHaveClass("h-6", "w-6");
    });

    it("should render medium size by default", () => {
      render(<Stepper steps={defaultSteps} currentStep={0} />);

      const buttons = screen.getAllByRole("button");
      expect(buttons[0]).toHaveClass("h-8", "w-8");
    });

    it("should render large size", () => {
      render(<Stepper steps={defaultSteps} currentStep={0} size="lg" />);

      const buttons = screen.getAllByRole("button");
      expect(buttons[0]).toHaveClass("h-10", "w-10");
    });
  });

  describe("Accessibility", () => {
    it("should have proper list role", () => {
      render(<Stepper steps={defaultSteps} currentStep={0} />);

      expect(screen.getByRole("list")).toBeInTheDocument();
    });

    it("should have proper listitem roles", () => {
      render(<Stepper steps={defaultSteps} currentStep={0} />);

      expect(screen.getAllByRole("listitem")).toHaveLength(3);
    });

    it("should have aria-label on step buttons", () => {
      render(<Stepper steps={defaultSteps} currentStep={1} />);

      expect(
        screen.getByLabelText("Step 1: Account (completed)"),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Step 2: Profile (current)"),
      ).toBeInTheDocument();
    });
  });
});

describe("StepperContent", () => {
  it("should render content for current step", () => {
    render(
      <StepperContent currentStep={1} step={1}>
        <div>Step 2 Content</div>
      </StepperContent>,
    );

    expect(screen.getByText("Step 2 Content")).toBeInTheDocument();
  });

  it("should not render content for non-current step", () => {
    render(
      <StepperContent currentStep={0} step={1}>
        <div>Step 2 Content</div>
      </StepperContent>,
    );

    expect(screen.queryByText("Step 2 Content")).not.toBeInTheDocument();
  });

  it("should apply custom className", () => {
    render(
      <StepperContent currentStep={0} step={0} className="custom-content">
        <div>Content</div>
      </StepperContent>,
    );

    expect(screen.getByRole("tabpanel")).toHaveClass("custom-content");
  });

  it("should have proper aria-label", () => {
    render(
      <StepperContent currentStep={2} step={2}>
        <div>Content</div>
      </StepperContent>,
    );

    expect(screen.getByLabelText("Step 3 content")).toBeInTheDocument();
  });
});
