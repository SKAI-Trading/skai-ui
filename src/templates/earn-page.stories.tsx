import type { Meta, StoryObj } from "@storybook/react";
import { EarnPageTemplate } from "./earn-page";

const meta: Meta<typeof EarnPageTemplate> = {
  title: "Templates/Earn",
  component: EarnPageTemplate,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["stable"],
};

export default meta;
type Story = StoryObj<typeof EarnPageTemplate>;

export const Default: Story = {
  args: {
    activeTab: "faucet",
    isConnected: true,
    isLoading: false,
    vaultBalance: 4500,
    walletBalance: 1200,
    referralLink: "https://skai.trade/ref/casey123",
    faucetStats: {
      totalClaims: 45,
      totalEarned: 4500,
      currentStreak: 7,
      bestStreak: 14,
      nextClaimIn: 0,
    },
    lotteryStats: {
      jackpot: 50000,
      userTickets: 12,
      totalTickets: 8500,
      nextDrawIn: 43200,
      totalWinnings: 250,
    },
    referralStats: {
      totalReferrals: 8,
      activeReferrals: 5,
      totalEarnings: 1200,
    },
  },
};
