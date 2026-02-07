import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { AccountPageTemplate } from "./account-page";

const meta: Meta<typeof AccountPageTemplate> = {
  title: "Templates/Account",
  component: AccountPageTemplate,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["stable"],
};

export default meta;
type Story = StoryObj<typeof AccountPageTemplate>;

export const Default: Story = {
  args: {
    isConnected: true,
    isLoading: false,
    activeTab: "profile",
    user: {
      id: "user-1",
      displayName: "Casey",
      username: "casey",
      tier: "Gold",
      email: "casey@skai.trade",
      walletAddress: "0x1234...abcd",
    },
    onTabChange: () => {},
    onPortfolioClick: () => {},
    profileContent: React.createElement("div", { className: "p-6 text-muted-foreground text-center" }, "Profile settings content area"),
    analyticsContent: React.createElement("div", { className: "p-6 text-muted-foreground text-center" }, "Analytics dashboard content area"),
    activityContent: React.createElement("div", { className: "p-6 text-muted-foreground text-center" }, "Activity history content area"),
    settingsContent: React.createElement("div", { className: "p-6 text-muted-foreground text-center" }, "Settings content area"),
  },
};
