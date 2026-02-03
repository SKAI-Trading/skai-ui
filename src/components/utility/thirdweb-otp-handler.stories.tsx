import type { Meta, StoryObj } from "@storybook/react";
import { ThirdwebOTPHandler } from "./thirdweb-otp-handler";

/**
 * ThirdwebOTPHandler - Utility component for Thirdweb OTP UX enhancement
 *
 * This is a **utility component** that renders nothing visually but enhances the
 * Thirdweb OTP (One-Time Password) input experience:
 *
 * 1. Auto-focuses the OTP input when the modal appears
 * 2. Captures keydown events to allow typing immediately
 * 3. Auto-submits when the code is fully entered
 *
 * ## Usage
 * Place this component anywhere in your tree when using Thirdweb's OTP modal:
 *
 * ```tsx
 * // In your app layout or near Thirdweb components
 * <ThirdwebOTPHandler />
 *
 * // With custom configuration
 * <ThirdwebOTPHandler
 *   otpLength={6}
 *   verifyButtonPatterns={['verify', 'continue', 'sign in']}
 *   autoSubmitDelay={300}
 * />
 * ```
 *
 * ## Note
 * This component uses MutationObserver to detect OTP inputs and enhance them.
 * It does not render any visible UI.
 */
const meta: Meta<typeof ThirdwebOTPHandler> = {
  title: "Utility/ThirdwebOTPHandler",
  component: ThirdwebOTPHandler,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A utility component that enhances Thirdweb's OTP input experience.

**Features:**
- Auto-focuses OTP input when it appears
- Captures number key presses even when input isn't focused
- Auto-submits verification when code is complete

**Note:** This component renders nothing - it only adds behavior via MutationObserver.
        `,
      },
    },
  },
  argTypes: {
    otpLength: {
      control: { type: "number", min: 4, max: 8 },
      description: "Expected OTP length",
      defaultValue: 6,
    },
    verifyButtonPatterns: {
      control: "object",
      description: "Button text patterns to look for when auto-submitting",
    },
    autoSubmitDelay: {
      control: { type: "number", min: 0, max: 1000 },
      description: "Delay in ms before auto-clicking verify button",
      defaultValue: 300,
    },
    enabled: {
      control: "boolean",
      description: "Whether the handler is active",
      defaultValue: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThirdwebOTPHandler>;

// Demo wrapper showing a mock OTP input
const DemoWrapper = ({
  otpLength = 6,
  autoSubmitDelay = 300,
  enabled = true,
}: {
  otpLength?: number;
  autoSubmitDelay?: number;
  enabled?: boolean;
}) => {
  return (
    <div
      style={{
        padding: "40px",
        background: "#122524",
        borderRadius: "16px",
        textAlign: "center",
        fontFamily: "Manrope, sans-serif",
        color: "#FFFFFF",
      }}
    >
      <h3 style={{ marginBottom: "16px" }}>ThirdwebOTPHandler Demo</h3>
      <p style={{ color: "#E0E0E0", marginBottom: "24px", fontSize: "14px" }}>
        This component renders nothing visible. It enhances OTP inputs by:
      </p>
      <ul
        style={{
          textAlign: "left",
          color: "#E0E0E0",
          fontSize: "14px",
          marginBottom: "24px",
        }}
      >
        <li>Auto-focusing OTP inputs when they appear</li>
        <li>Capturing number keys even when input isn&apos;t focused</li>
        <li>Auto-submitting when code is complete</li>
      </ul>

      <div
        style={{
          padding: "16px",
          background: "#001615",
          borderRadius: "8px",
          marginBottom: "16px",
        }}
      >
        <p style={{ fontSize: "12px", color: "#95a09f" }}>
          Current Config: OTP Length = {otpLength}, Auto-submit Delay ={" "}
          {autoSubmitDelay}ms, Enabled = {enabled ? "Yes" : "No"}
        </p>
      </div>

      {/* The actual component - renders nothing */}
      <ThirdwebOTPHandler
        otpLength={otpLength}
        autoSubmitDelay={autoSubmitDelay}
        enabled={enabled}
      />

      <p style={{ fontSize: "12px", color: "#95a09f", marginTop: "16px" }}>
        The ThirdwebOTPHandler component is active but invisible.
        <br />
        It will enhance any Thirdweb OTP inputs that appear on the page.
      </p>
    </div>
  );
};

/**
 * Default configuration
 */
export const Default: Story = {
  render: () => <DemoWrapper />,
};

/**
 * Custom OTP length (4 digits)
 */
export const FourDigitOTP: Story = {
  render: () => <DemoWrapper otpLength={4} />,
};

/**
 * Longer auto-submit delay
 */
export const SlowAutoSubmit: Story = {
  render: () => <DemoWrapper autoSubmitDelay={1000} />,
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  render: () => <DemoWrapper enabled={false} />,
};

/**
 * Documentation only - shows component API
 */
export const APIReference: Story = {
  args: {
    otpLength: 6,
    verifyButtonPatterns: ["verify", "submit", "continue", "sign in"],
    autoSubmitDelay: 300,
    enabled: true,
  },
};
