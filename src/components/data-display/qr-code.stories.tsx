import type { Meta, StoryObj } from "@storybook/react";
import { QRCode, WalletQRCode } from "./qr-code";

const meta: Meta<typeof QRCode> = {
  title: "Data Display/QRCode",
  component: QRCode,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: "https://skai.trade" },
};

export const WalletAddress: Story = {
  render: () => (
    <WalletQRCode address="0x1234567890abcdef1234567890abcdef12345678" />
  ),
};
