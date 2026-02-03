import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { WalletChoiceModal } from "./wallet-choice-modal";

/**
 * WalletChoiceModal - Modal for choosing wallet type
 *
 * This modal allows users to choose between using an email-based embedded wallet
 * or connecting their own external wallet (MetaMask, etc.).
 *
 * ## Figma Reference
 * - Design: Skai-Design > Landing > Wallet Choice Modal
 *
 * ## Usage
 * ```tsx
 * <WalletChoiceModal
 *   isOpen={showWalletChoice}
 *   onClose={() => setShowWalletChoice(false)}
 *   onSelectEmailWallet={() => handleEmailWallet()}
 *   onSelectExternalWallet={() => handleExternalWallet()}
 * />
 * ```
 */
const meta: Meta<typeof WalletChoiceModal> = {
  title: "Overlays/WalletChoiceModal",
  component: WalletChoiceModal,
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
    onSelectEmailWallet: {
      action: "emailWalletSelected",
      description: "Callback when email wallet option is selected",
    },
    onSelectExternalWallet: {
      action: "externalWalletSelected",
      description: "Callback when external wallet option is selected",
    },
  },
};

export default meta;
type Story = StoryObj<typeof WalletChoiceModal>;

// Interactive wrapper to control modal state
const InteractiveWrapper = () => {
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
        Open Wallet Choice Modal
      </button>

      <WalletChoiceModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelectEmailWallet={() => {
          console.log("Email wallet selected");
          alert("Email wallet selected - would create embedded wallet");
          setIsOpen(false);
        }}
        onSelectExternalWallet={() => {
          console.log("External wallet selected");
          alert("External wallet selected - would open wallet connect");
          setIsOpen(false);
        }}
      />
    </div>
  );
};

/**
 * Default state - showing both wallet options
 */
export const Default: Story = {
  render: () => <InteractiveWrapper />,
};

/**
 * Direct render - for testing props
 */
export const DirectRender: Story = {
  args: {
    isOpen: true,
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
