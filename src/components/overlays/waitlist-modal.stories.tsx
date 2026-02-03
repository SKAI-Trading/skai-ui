import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { WaitlistModal } from "./waitlist-modal";

/**
 * WaitlistModal - "Get early access to Skai" modal for waitlist signup
 *
 * This modal is used on the SKAI landing page to capture user emails for the waitlist.
 * It supports email input with validation, Google/Apple social login options, and loading states.
 *
 * ## Figma Reference
 * - Design System: Skai-Design (TyX8YAtNDEIvsnSLQ3IXId)
 *   - Input Components: 976:871 (Active), 976:872 (Focus)
 *   - CTA Buttons: 801:1059 (Primary Large)
 *   - Colors: 691:87 (Color palette)
 * - App Designs: Skai-Web-App (3sSzw1KewMtUbeLAv7uW0r)
 *   - Desktop (1440px): 2005:9301 (Empty), 2005:10032 (Active)
 *   - Tablet (768px): 2005:17764 (Empty), 2005:18495 (Active)
 *   - Mobile (375px): 2005:27956 (Empty), 2005:28687 (Active)
 * - States: Empty, Active (with "↵ ENTER" hint), Loading
 *
 * ## Usage
 * ```tsx
 * <WaitlistModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   onEmailSubmit={(email) => handleSignup(email)}
 *   onGoogleLogin={handleGoogleLogin}
 *   onAppleLogin={handleAppleLogin}
 * />
 * ```
 */
const meta: Meta<typeof WaitlistModal> = {
  title: "Overlays/WaitlistModal",
  component: WaitlistModal,
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
    onEmailSubmit: {
      action: "emailSubmitted",
      description: "Callback when email is submitted",
    },
    onGoogleLogin: {
      action: "googleLogin",
      description: "Callback for Google login",
    },
    onAppleLogin: {
      action: "appleLogin",
      description: "Callback for Apple login",
    },
    isLoading: {
      control: "boolean",
      description: "Whether in loading state",
    },
    initialEmail: {
      control: "text",
      description: "Initial email value",
    },
  },
};

export default meta;
type Story = StoryObj<typeof WaitlistModal>;

// Interactive wrapper to control modal state
const InteractiveWrapper = ({
  isLoading = false,
  initialEmail = "",
}: {
  isLoading?: boolean;
  initialEmail?: string;
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
        Open Waitlist Modal
      </button>

      <WaitlistModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onEmailSubmit={(email) => {
          console.log("Email submitted:", email);
          alert(`Email submitted: ${email}`);
        }}
        onGoogleLogin={() => {
          console.log("Google login clicked");
          alert("Google login clicked");
        }}
        onAppleLogin={() => {
          console.log("Apple login clicked");
          alert("Apple login clicked");
        }}
        isLoading={isLoading}
        initialEmail={initialEmail}
      />
    </div>
  );
};

/**
 * Default state - modal open with all options
 */
export const Default: Story = {
  render: () => <InteractiveWrapper />,
};

/**
 * Loading state - shows spinner overlay
 */
export const Loading: Story = {
  render: () => <InteractiveWrapper isLoading={true} />,
};

/**
 * With pre-filled email
 */
export const WithInitialEmail: Story = {
  render: () => <InteractiveWrapper initialEmail="user@example.com" />,
};

/**
 * Direct render - for testing props
 */
export const DirectRender: Story = {
  args: {
    isOpen: true,
    isLoading: false,
    initialEmail: "",
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
