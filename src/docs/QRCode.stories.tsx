import type { Meta, StoryObj } from "@storybook/react";
import { QRCode, WalletQRCode } from "../components/data-display/qr-code";

const meta: Meta<typeof QRCode> = {
  title: "Components/QRCode",
  component: QRCode,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "QR Code component for sharing wallet addresses, payment links, and other data. Supports copy and download functionality.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof QRCode>;

export const Default: Story = {
  args: {
    value: "0x742d35Cc6634C0532925a3b844Bc9e7595f1EaAb",
  },
};

export const WithLabel: Story = {
  args: {
    value: "0x742d35Cc6634C0532925a3b844Bc9e7595f1EaAb",
    label: "Deposit Address",
    description: "Scan to send ETH",
  },
};

export const WithActions: Story = {
  args: {
    value: "0x742d35Cc6634C0532925a3b844Bc9e7595f1EaAb",
    label: "Wallet Address",
    showCopy: true,
    showDownload: true,
  },
};

export const LargeSize: Story = {
  args: {
    value: "0x742d35Cc6634C0532925a3b844Bc9e7595f1EaAb",
    size: 256,
    label: "Large QR Code",
  },
};

export const SmallSize: Story = {
  args: {
    value: "0x742d35Cc6634C0532925a3b844Bc9e7595f1EaAb",
    size: 100,
    bordered: false,
  },
};

export const CustomColors: Story = {
  args: {
    value: "0x742d35Cc6634C0532925a3b844Bc9e7595f1EaAb",
    fgColor: "#22c55e",
    bgColor: "#0f172a",
    label: "SKAI Branded",
  },
};

export const HighErrorCorrection: Story = {
  args: {
    value: "0x742d35Cc6634C0532925a3b844Bc9e7595f1EaAb",
    level: "H",
    label: "High Error Correction",
    description: "Can be partially obscured",
  },
};

export const NoBorder: Story = {
  args: {
    value: "https://skai.trade",
    bordered: false,
  },
};

export const WalletAddress: Story = {
  render: () => (
    <WalletQRCode
      address="0x742d35Cc6634C0532925a3b844Bc9e7595f1EaAb"
      chainName="Ethereum"
    />
  ),
};

export const WalletAddressBase: Story = {
  render: () => (
    <WalletQRCode
      address="0x742d35Cc6634C0532925a3b844Bc9e7595f1EaAb"
      chainName="Base"
      showAddress={true}
    />
  ),
};

export const URLQRCode: Story = {
  args: {
    value: "https://app.skai.trade/trade?ref=abc123",
    label: "Referral Link",
    description: "Share to earn rewards",
    showCopy: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      <QRCode value="0x1234...5678" label="Default" size={120} />
      <QRCode value="0x1234...5678" label="Copy" showCopy size={120} />
      <QRCode value="0x1234...5678" label="Download" showDownload size={120} />
      <QRCode
        value="0x1234...5678"
        label="Both"
        showCopy
        showDownload
        size={120}
      />
    </div>
  ),
};
