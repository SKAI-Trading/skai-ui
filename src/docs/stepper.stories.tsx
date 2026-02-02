import type { Meta, StoryObj } from "@storybook/react";
import { Stepper, StepperContent } from "../components/layout/stepper";
import { useState } from "react";
import { Wallet, Coins, CheckCircle } from "lucide-react";

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
- Accessible with ARIA attributes
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Stepper>;

const defaultSteps = [
  { id: "1", title: "Connect Wallet" },
  { id: "2", title: "Enter Amount" },
  { id: "3", title: "Confirm" },
];

export const Default: Story = {
  render: () => {
    const [step, setStep] = useState(1);
    return (
      <Stepper steps={defaultSteps} currentStep={step} onStepClick={setStep} />
    );
  },
};

export const WithDescriptions: Story = {
  render: () => {
    const [step, setStep] = useState(1);
    const steps = [
      { id: "1", title: "Account", description: "Create your account" },
      { id: "2", title: "Verification", description: "Verify your email" },
      { id: "3", title: "Complete", description: "You're all set!" },
    ];
    return <Stepper steps={steps} currentStep={step} onStepClick={setStep} />;
  },
};

export const WithContent: Story = {
  render: () => {
    const [step, setStep] = useState(0);
    const steps = [
      { id: "1", title: "Account" },
      { id: "2", title: "Verification" },
      { id: "3", title: "Complete" },
    ];
    return (
      <div className="w-full max-w-2xl space-y-6">
        <Stepper steps={steps} currentStep={step} onStepClick={setStep} />

        <StepperContent currentStep={step} step={0}>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Create your account</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enter your email and create a password.
            </p>
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded"
            >
              Continue
            </button>
          </div>
        </StepperContent>

        <StepperContent currentStep={step} step={1}>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Verify your email</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We've sent a code to your email.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setStep(0)}
                className="px-4 py-2 border rounded"
              >
                Back
              </button>
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded"
              >
                Verify
              </button>
            </div>
          </div>
        </StepperContent>

        <StepperContent currentStep={step} step={2}>
          <div className="p-4 border rounded-lg text-center">
            <h3 className="font-semibold mb-2">🎉 All done!</h3>
            <p className="text-sm text-muted-foreground">
              Your account is ready to use.
            </p>
          </div>
        </StepperContent>
      </div>
    );
  },
};

export const Vertical: Story = {
  render: () => {
    const [step, setStep] = useState(1);
    const steps = [
      { id: "1", title: "Select Token", description: "Choose source token" },
      { id: "2", title: "Enter Amount", description: "Specify swap amount" },
      { id: "3", title: "Review Swap", description: "Check the details" },
      { id: "4", title: "Confirm", description: "Complete transaction" },
    ];
    return (
      <div className="w-80">
        <Stepper
          steps={steps}
          currentStep={step}
          onStepClick={setStep}
          orientation="vertical"
        />
      </div>
    );
  },
};

export const WithIcons: Story = {
  render: () => {
    const [step, setStep] = useState(1);
    const steps = [
      { id: "1", title: "Connect", icon: <Wallet className="h-4 w-4" /> },
      { id: "2", title: "Amount", icon: <Coins className="h-4 w-4" /> },
      { id: "3", title: "Confirm", icon: <CheckCircle className="h-4 w-4" /> },
    ];
    return (
      <Stepper
        steps={steps}
        currentStep={step}
        onStepClick={setStep}
        showNumbers={false}
      />
    );
  },
};

export const OptionalSteps: Story = {
  render: () => {
    const [step, setStep] = useState(1);
    const steps = [
      { id: "1", title: "Profile", description: "Basic info" },
      { id: "2", title: "Avatar", description: "Upload photo", optional: true },
      { id: "3", title: "Preferences", description: "Customize settings" },
    ];
    return <Stepper steps={steps} currentStep={step} onStepClick={setStep} />;
  },
};

export const NonClickable: Story = {
  render: () => {
    const [step, setStep] = useState(1);
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Steps can only be navigated via buttons (clickable=false)
        </p>
        <Stepper steps={defaultSteps} currentStep={step} clickable={false} />
        <div className="flex gap-2">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            className="px-3 py-1 border rounded"
            disabled={step === 0}
          >
            Previous
          </button>
          <button
            onClick={() => setStep(Math.min(2, step + 1))}
            className="px-3 py-1 bg-primary text-primary-foreground rounded"
            disabled={step === 2}
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
        <Stepper steps={defaultSteps} currentStep={1} size="sm" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Medium (default)</p>
        <Stepper steps={defaultSteps} currentStep={1} size="md" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Large</p>
        <Stepper steps={defaultSteps} currentStep={1} size="lg" />
      </div>
    </div>
  ),
};

export const TradingWorkflow: Story = {
  render: () => {
    const [step, setStep] = useState(0);
    const steps = [
      {
        id: "wallet",
        title: "Connect Wallet",
        description: "Link your wallet",
      },
      { id: "amount", title: "Enter Amount", description: "Set swap amount" },
      { id: "review", title: "Review", description: "Check details" },
      { id: "confirm", title: "Confirm", description: "Sign transaction" },
    ];
    return (
      <div className="space-y-6 w-full max-w-xl">
        <Stepper steps={steps} currentStep={step} onStepClick={setStep} />

        <StepperContent currentStep={step} step={0}>
          <div className="p-6 border rounded-lg bg-card">
            <div className="flex items-center gap-3 mb-4">
              <Wallet className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Connect your wallet</h3>
                <p className="text-sm text-muted-foreground">
                  Link a wallet to start trading
                </p>
              </div>
            </div>
            <button
              onClick={() => setStep(1)}
              className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
            >
              Connect Wallet
            </button>
          </div>
        </StepperContent>

        <StepperContent currentStep={step} step={1}>
          <div className="p-6 border rounded-lg bg-card">
            <div className="flex items-center gap-3 mb-4">
              <Coins className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Enter swap amount</h3>
                <p className="text-sm text-muted-foreground">
                  How much would you like to swap?
                </p>
              </div>
            </div>
            <input
              type="text"
              placeholder="0.00 ETH"
              className="w-full px-4 py-3 border rounded-lg bg-background mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setStep(0)}
                className="flex-1 px-4 py-3 border rounded-lg"
              >
                Back
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
              >
                Review Swap
              </button>
            </div>
          </div>
        </StepperContent>

        <StepperContent currentStep={step} step={2}>
          <div className="p-6 border rounded-lg bg-card">
            <h3 className="font-semibold mb-4">Review your swap</h3>
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">From</span>
                <span>1.0 ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">To</span>
                <span>3,200 USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fee</span>
                <span>0.05%</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-4 py-3 border rounded-lg"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
              >
                Confirm Swap
              </button>
            </div>
          </div>
        </StepperContent>

        <StepperContent currentStep={step} step={3}>
          <div className="p-6 border rounded-lg bg-card text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Swap Complete!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your transaction has been confirmed
            </p>
            <button
              onClick={() => setStep(0)}
              className="px-4 py-2 border rounded-lg"
            >
              Make Another Swap
            </button>
          </div>
        </StepperContent>
      </div>
    );
  },
};
