import type { Meta, StoryObj } from "@storybook/react";
import { Tour, useTour, type TourStep } from "../components/tour";
import { Button } from "../components/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";

const meta: Meta<typeof Tour> = {
  title: "Feedback Extended/Tour",
  component: Tour,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "An onboarding tour/spotlight component for guiding users through UI features with step-by-step instructions.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tour>;

const tourSteps: TourStep[] = [
  {
    target: "#step-1",
    title: "Welcome to SKAI",
    description:
      "This is your dashboard where you can see all your portfolio information.",
    placement: "bottom",
  },
  {
    target: "#step-2",
    title: "Trade Tokens",
    description: "Click here to swap tokens or place limit orders.",
    placement: "bottom",
  },
  {
    target: "#step-3",
    title: "Your Balance",
    description: "View your current wallet balance and recent transactions.",
    placement: "left",
  },
];

const TourDemo = () => {
  const { open, currentStep, start, close, setCurrentStep } = useTour();

  return (
    <div className="p-8 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 id="step-1" className="text-2xl font-bold">
            Dashboard
          </h1>
          <Button onClick={start}>Start Tour</Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card id="step-2" className="col-span-2">
            <CardHeader>
              <CardTitle>Trade</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Swap tokens or place limit orders
              </p>
            </CardContent>
          </Card>

          <Card id="step-3">
            <CardHeader>
              <CardTitle>Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$12,345.67</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tour
        steps={tourSteps}
        open={open}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onClose={close}
        onComplete={() => {
          close();
          alert("Tour completed!");
        }}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <TourDemo />,
};

export const CustomPlacement: Story = {
  render: () => {
    const steps: TourStep[] = [
      {
        target: "#top-element",
        title: "Top Placement",
        description: "This tooltip appears above the element.",
        placement: "top",
      },
      {
        target: "#right-element",
        title: "Right Placement",
        description: "This tooltip appears to the right.",
        placement: "right",
      },
      {
        target: "#bottom-element",
        title: "Bottom Placement",
        description: "This tooltip appears below.",
        placement: "bottom",
      },
      {
        target: "#left-element",
        title: "Left Placement",
        description: "This tooltip appears to the left.",
        placement: "left",
      },
    ];

    const Demo = () => {
      const { open, currentStep, start, close, setCurrentStep } = useTour();

      return (
        <div className="p-8 min-h-screen bg-background">
          <Button onClick={start} className="mb-8">
            Start Tour
          </Button>

          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-32">
            <div />
            <div id="top-element" className="p-4 border rounded text-center">
              Top
            </div>
            <div />
            <div id="left-element" className="p-4 border rounded text-center">
              Left
            </div>
            <div id="bottom-element" className="p-4 border rounded text-center">
              Bottom
            </div>
            <div id="right-element" className="p-4 border rounded text-center">
              Right
            </div>
          </div>

          <Tour
            steps={steps}
            open={open}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            onClose={close}
          />
        </div>
      );
    };

    return <Demo />;
  },
};

export const NoSkipButton: Story = {
  render: () => {
    const steps: TourStep[] = [
      {
        target: "#required-1",
        title: "Step 1",
        description: "You must complete this tour.",
        placement: "bottom",
      },
      {
        target: "#required-2",
        title: "Step 2",
        description: "No skipping allowed!",
        placement: "bottom",
      },
    ];

    const Demo = () => {
      const { open, currentStep, start, close, setCurrentStep } = useTour();

      return (
        <div className="p-8 bg-background">
          <Button onClick={start} className="mb-8">
            Start Required Tour
          </Button>

          <div className="flex gap-4">
            <div id="required-1" className="p-4 border rounded">
              First Step
            </div>
            <div id="required-2" className="p-4 border rounded">
              Second Step
            </div>
          </div>

          <Tour
            steps={steps}
            open={open}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            onClose={close}
            showSkip={false}
          />
        </div>
      );
    };

    return <Demo />;
  },
};
