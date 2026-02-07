import type { Meta, StoryObj } from "@storybook/react";
import { GovernancePageTemplate } from "./governance-page";

const meta: Meta<typeof GovernancePageTemplate> = {
  title: "Templates/Governance",
  component: GovernancePageTemplate,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["stable"],
};

export default meta;
type Story = StoryObj<typeof GovernancePageTemplate>;

export const Default: Story = {
  args: {
    activeTab: "proposals",
    isConnected: true,
    isLoading: false,
    walletAddress: "0x1234...abcd",
    votingPower: 15000,
    lockedBalance: 10000,
    statusFilter: "all",
    stats: {
      totalProposals: 24,
      activeProposals: 3,
      totalVotesCast: 45000,
      uniqueVoters: 1200,
      treasuryValue: 2500000,
      tokenSupply: 100000000,
    },
    delegation: {
      delegatedPower: 15000,
      selfDelegated: true,
      delegators: ["0xaaaa...1111", "0xbbbb...2222"],
      receivedDelegation: 8500,
    },
    proposals: [
      {
        id: "prop-1",
        title: "Increase Staking Rewards by 2%",
        description:
          "This proposal aims to increase the staking APY from 8% to 10% to attract more long-term holders and improve protocol security.",
        status: "active",
        createdAt: "2026-02-01T00:00:00Z",
        endDate: "2026-02-14T23:59:59Z",
        author: "0x1234...5678",
        authorName: "skaidev",
        votesFor: 125000,
        votesAgainst: 45000,
        votesAbstain: 12000,
        quorum: 100000,
        quorumReached: true,
      },
      {
        id: "prop-2",
        title: "Add SOL-USD Perpetual Market",
        description:
          "Proposal to add Solana perpetual trading pairs with up to 50x leverage.",
        status: "active",
        createdAt: "2026-02-03T00:00:00Z",
        endDate: "2026-02-17T23:59:59Z",
        author: "0xabcd...ef01",
        authorName: "community_lead",
        votesFor: 89000,
        votesAgainst: 23000,
        votesAbstain: 5000,
        quorum: 100000,
        quorumReached: false,
      },
      {
        id: "prop-3",
        title: "Treasury Diversification Strategy",
        description:
          "Diversify 20% of treasury holdings into stablecoins for operational runway.",
        status: "passed",
        createdAt: "2026-01-15T00:00:00Z",
        endDate: "2026-01-29T23:59:59Z",
        author: "0x9876...5432",
        authorName: "treasury_mgr",
        votesFor: 180000,
        votesAgainst: 35000,
        votesAbstain: 8000,
        quorum: 100000,
        quorumReached: true,
      },
    ],
  },
};
