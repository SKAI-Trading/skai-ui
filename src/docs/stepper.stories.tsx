import type { Meta, StoryObj } from "@storybook/react";
import { 
  Stepper, 
  StepperItem, 
  StepperContent, 
  StepperTrigger,
  StepperSeparator,
} from "../components/stepper";
import { useState } from "react";

const meta: Meta<typeof Stepper> = {
  title: "Layout/Stepper",
  component: Stepper,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
The Stepper component creates multi-step wizards and progress indicators.

## Features
- Horizontal and vertical orientations
- Active, completed, and upcoming states
- Optional step content panels
- Clickable step navigation
- Custom step icons
- Animated transitions
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Stepper>;

export const Default: Story = {
  render: () => {
    const [step, setStep] = useState(1);
    return (
      <Stepper value={step} onValueChange={setStep}>
        <StepperItem value={1}>
          <StepperTrigger>Connect Wallet</StepperTrigger>
        </StepperItem>
        <StepperSeparator />
        <StepperItem value={2}>
          <StepperTrigger>Enter Amount</StepperTrigger>
        </StepperItem>
        <StepperSeparator />
        <StepperItem value={3}>
          <StepperTrigger>Confirm</StepperTrigger>
        </StepperItem>
      </Stepper>
    );
  },
};

export const WithContent: Story = {
  render: () => {
    const [step, setStep] = useState(1);
    return (
      <div className="w-full max-w-2xl">
        <Stepper value={step} onValueChange={setStep}>
          <StepperItem value={1}>
            <StepperTrigger>Account</StepperTrigger>
            <StepperContent>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Create your account</h3>
                <p className="text-sm text-muted-foreground">
                  Enter your email and create a password.
                </p>
                <button 
                  onClick={() => setStep(2)}
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded"
                >
                  Continue
                </button>
              </div>
            </StepperContent>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value={2}>
            <StepperTrigger>Verification</StepperTrigger>
            <StepperContent>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Verify your email</h3>
                <p className="text-sm text-muted-foreground">
                  We've sent a code to your email.
                </p>
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => setStep(1)}
                    className="px-4 py-2 border rounded"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setStep(3)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </StepperContent>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value={3}>
            <StepperTrigger>Complete</StepperTrigger>
            <StepperContent>
              <div className="p-4 border rounded-lg text-center">
                <h3 className="font-semibold mb-2">🎉 All done!</h3>
                <p className="text-sm text-muted-foreground">
                  Your account is ready to use.
                </p>
              </div>
            </StepperContent>
          </StepperItem>
        </Stepper>
      </div>
    );
  },
};

export const Vertical: Story = {
  render: () => {
    const [step, setStep] = useState(2);
    return (
      <div className="w-64">
        <Stepper value={step} onValueChange={setStep} orientation="vertical">
          <StepperItem value={1}>
            <StepperTrigger>Select Token</StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value={2}>
            <StepperTrigger>Enter Amount</StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value={3}>
            <StepperTrigger>Review Swap</StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value={4}>
            <StepperTrigger>Confirm</StepperTrigger>
          </StepperItem>
        </Stepper>
      </div>
    );
  },
};

export const CompletedSteps: Story = {
  render: () => {
    const [step, setStep] = useState(3);
    return (
      <Stepper value={step} onValueChange={setStep}>
        <StepperItem value={1} completed>
          <StepperTrigger>Wallet Connected</StepperTrigger>
        </StepperItem>
        <StepperSeparator />
        <StepperItem value={2} completed>
          <StepperTrigger>Amount Set</StepperTrigger>
        </StepperItem>
        <StepperSeparator />
        <StepperItem value={3}>
          <StepperTrigger>Pending Confirmation</StepperTrigger>
        </StepperItem>
      </Stepper>
    );
  },
};

export const NonClickable: Story = {
  render: () => {
    const [step, setStep] = useState(2);
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Steps can only be navigated via buttons
        </p>
        <Stepper value={step} onValueChange={setStep} clickable={false}>
          <StepperItem value={1}>
            <StepperTrigger>Step 1</StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value={2}>
            <StepperTrigger>Step 2</StepperTrigger>
          </StepperItem>
          <StepperSeparator />
          <StepperItem value={3}>
            <StepperTrigger>Step 3</StepperTrigger>
          </StepperItem>
        </Stepper>
        <div className="flex gap-2">
          <button 
            onClick={() => setStep(Math.max(1, step - 1))}
            className="px-3 py-1 border rounded"
          >
            Previous
          </button>
          <button 
            onClick={() => setStep(Math.min(3, step + 1))}
            className="px-3 py-1 bg-primary text-primary-foreground rounded"
          >
            Next
          </button>
        </div>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Small</p>
        <Stepper value={2} size="sm">
          <StepperItem value={1}><StepperTrigger>Step 1</StepperTrigger></StepperItem>
          <StepperSeparator />
          <StepperItem value={2}><StepperTrigger>Step 2</StepperTrigger></StepperItem>
          <StepperSeparator />
          <StepperItem value={3}><StepperTrigger>Step 3</StepperTrigger></StepperItem>
        </Stepper>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Default</p>
        <Stepper value={2} size="default">
          <StepperItem value={1}><StepperTrigger>Step 1</StepperTrigger></StepperItem>
          <StepperSeparator />
          <StepperItem value={2}><StepperTrigger>Step 2</StepperTrigger></StepperItem>
          <StepperSeparator />
          <StepperItem value={3}><StepperTrigger>Step 3</StepperTrigger></StepperItem>
        </Stepper>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Large</p>
        <Stepper value={2} size="lg">
          <StepperItem value={1}><StepperTrigger>Step 1</StepperTrigger></StepperItem>
          <StepperSeparator />
          <StepperItem value={2}><StepperTrigger>Step 2</StepperTrigger></StepperItem>
          <StepperSeparator />
          <StepperItem value={3}><StepperTrigger>Step 3</StepperTrigger></StepperItem>
        </Stepper>
      </div>
    </div>
  ),
};
