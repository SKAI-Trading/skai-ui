import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { EmailVerificationModal } from "./email-verification-modal";

/**
 * EmailVerificationModal - OTP verification modal for email authentication
 *
 * This modal is shown after a user enters their email in the waitlist flow.
 * It allows them to enter the OTP code sent to their email.
 *
 * ## Figma Reference
 * - Design System: Skai-Design (TyX8YAtNDEIvsnSLQ3IXId)
 *   - Input Components: 801:1386 (Input section)
 *   - CTA Buttons: 779:57 (CTA section)
 * - App Designs: Skai-Web-App (3sSzw1KewMtUbeLAv7uW0r)
 *   - Desktop (1440px): 2005:10763
 *   - Tablet (768px): 2005:19226
 *   - Mobile (375px): 2005:30148
 *
 * ## Usage
 * ```tsx
 * <EmailVerificationModal
 *   isOpen={showVerification}
 *   onClose={() => setShowVerification(false)}
 *   onBack={() => goBackToEmail()}
 *   email="user@example.com"
 *   onVerify={(code) => verifyCode(code)}
 *   onResendCode={() => resendOTP()}
 * />
 * ```
 */
const meta: Meta<typeof EmailVerificationModal> = {
  title: "Overlays/EmailVerificationModal",
  component: EmailVerificationModal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#001615" },
        { name: "navy", value: "#020717" },
      ],
    },
  },
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Whether the modal is open",
    },
    onClose: {
      action: "closed",
      description: "Callback when modal closes",
    },
    onBack: {
      action: "back",
      description: "Callback when back button is clicked",
    },
    email: {
      control: "text",
      description: "Email address being verified",
    },
    onVerify: {
      action: "verify",
      description: "Callback when code is submitted",
    },
    onResendCode: {
      action: "resend",
      description: "Callback when resend code is clicked",
    },
    error: {
      control: "text",
      description: "Error message to display",
    },
    loading: {
      control: "boolean",
      description: "Whether in loading state",
    },
  },
};

export default meta;
type Story = StoryObj<typeof EmailVerificationModal>;

// Interactive wrapper to control modal state
const InteractiveWrapper = ({
  email = "user@example.com",
  error = "",
  loading = false,
}: {
  email?: string;
  error?: string;
  loading?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div style={{ minHeight: "400px", minWidth: "600px" }}>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          padding: "12px 24px",
          backgroundColor: "#56C7F3",
          color: "#001615",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: 500,
        }}
      >
        Open Verification Modal
      </button>

      <EmailVerificationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onBack={() => {
          console.log("Back clicked");
          alert("Back clicked - would return to email entry");
        }}
        email={email}
        onVerify={(code) => {
          console.log("Code submitted:", code);
          alert(`Code submitted: ${code}`);
        }}
        onResendCode={() => {
          console.log("Resend code clicked");
          alert("Resend code clicked");
        }}
        error={error}
        loading={loading}
      />
    </div>
  );
};

/**
 * Default state - modal open awaiting code entry
 */
export const Default: Story = {
  render: () => <InteractiveWrapper />,
};

/**
 * Loading state - verifying the code
 */
export const Loading: Story = {
  render: () => <InteractiveWrapper loading={true} />,
};

/**
 * Error state - invalid code
 */
export const WithError: Story = {
  render: () => (
    <InteractiveWrapper error="Invalid verification code. Please try again." />
  ),
};

/**
 * Long email address
 */
export const LongEmail: Story = {
  render: () => (
    <InteractiveWrapper email="verylongemailaddress.that.might.wrap@example.com" />
  ),
};

/**
 * Direct render - for testing props
 */
export const DirectRender: Story = {
  args: {
    isOpen: true,
    email: "test@example.com",
    loading: false,
    error: "",
  },
};

/**
 * Mobile viewport
 */
export const Mobile: Story = {
  render: () => <InteractiveWrapper />,
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

/**
 * Tablet viewport
 */
export const Tablet: Story = {
  render: () => <InteractiveWrapper />,
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
};
