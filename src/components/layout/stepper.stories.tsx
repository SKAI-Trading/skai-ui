import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Stepper } from "./stepper";

const meta: Meta<typeof Stepper> = {
  title: "Layout/Stepper",
  component: Stepper,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const STEPS = [
  { id: "1", title: "Account", description: "Create your wallet" },
  { id: "2", title: "Verify", description: "Complete KYC" },
  { id: "3", title: "Fund", description: "Deposit assets" },
  { id: "4", title: "Trade", description: "Place your first order" },
];

const Interactive = (args: Partial<React.ComponentProps<typeof Stepper>>) => {
  const [step, setStep] = useState(1);
  return (
    <div className="w-[640px]">
      <Stepper
        steps={STEPS}
        currentStep={step}
        onStepClick={setStep}
        {...args}
      />
    </div>
  );
};

export const Horizontal: Story = {
  render: () => <Interactive orientation="horizontal" />,
};

export const Vertical: Story = {
  render: () => <Interactive orientation="vertical" />,
};

export const FirstStep: Story = {
  render: () => (
    <div className="w-[640px]">
      <Stepper steps={STEPS} currentStep={0} />
    </div>
  ),
};
