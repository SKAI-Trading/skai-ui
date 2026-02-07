import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { PortfolioPageTemplate } from "./portfolio-page";

const meta: Meta<typeof PortfolioPageTemplate> = {
  title: "Templates/Portfolio",
  component: PortfolioPageTemplate,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["stable"],
};

export default meta;
type Story = StoryObj<typeof PortfolioPageTemplate>;

export const Default: Story = {
  args: {
    isConnected: true,
    isLoading: false,
    activeTab: "holdings",
    badgeCount: 7,
    user: {
      id: "user-1",
      displayName: "Casey",
      points: 12500,
      skaiBalance: 4500,
      tier: "Gold",
    },
    onTabChange: () => {},
    onAccountSettingsClick: () => {},
    onGoHome: () => {},
    holdingsContent: React.createElement("div", { className: "p-6 text-muted-foreground text-center" }, "Holdings content area"),
    defiContent: React.createElement("div", { className: "p-6 text-muted-foreground text-center" }, "DeFi content area"),
    socialContent: React.createElement("div", { className: "p-6 text-muted-foreground text-center" }, "Social content area"),
    vaultContent: React.createElement("div", { className: "p-6 text-muted-foreground text-center" }, "Vault content area"),
    badgesContent: React.createElement("div", { className: "p-6 text-muted-foreground text-center" }, "Badges content area"),
  },
};
