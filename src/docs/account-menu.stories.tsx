import type { Meta, StoryObj } from "@storybook/react";
import { AccountMenu } from "../components/account-menu";
import {
  User,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  FileText,
  CreditCard,
  Gift,
  LogOut,
} from "lucide-react";

const meta: Meta<typeof AccountMenu> = {
  title: "Layout/AccountMenu",
  component: AccountMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "User account dropdown menu with avatar, wallet address, and navigation items. Built on Radix DropdownMenu.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outlined", "filled", "glass"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    align: {
      control: "select",
      options: ["start", "center", "end"],
    },
    showLogout: {
      control: "boolean",
    },
    showChevron: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AccountMenu>;

// Basic with flat items
export const Default: Story = {
  args: {
    name: "John Doe",
    avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    items: [
      { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
      {
        id: "settings",
        label: "Settings",
        icon: <Settings className="h-4 w-4" />,
      },
      {
        id: "notifications",
        label: "Notifications",
        icon: <Bell className="h-4 w-4" />,
      },
    ],
    onLogout: () => alert("Logged out"),
  },
};

// With grouped items
export const WithGroups: Story = {
  args: {
    name: "Trader",
    walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
    groups: [
      {
        label: "Account",
        items: [
          {
            id: "profile",
            label: "Profile",
            icon: <User className="h-4 w-4" />,
          },
          {
            id: "security",
            label: "Security",
            icon: <Shield className="h-4 w-4" />,
          },
          {
            id: "billing",
            label: "Billing",
            icon: <CreditCard className="h-4 w-4" />,
          },
        ],
      },
      {
        label: "Preferences",
        items: [
          {
            id: "settings",
            label: "Settings",
            icon: <Settings className="h-4 w-4" />,
          },
          {
            id: "notifications",
            label: "Notifications",
            icon: <Bell className="h-4 w-4" />,
            badge: "3",
          },
        ],
      },
      {
        label: "Support",
        items: [
          {
            id: "help",
            label: "Help Center",
            icon: <HelpCircle className="h-4 w-4" />,
          },
          {
            id: "docs",
            label: "Documentation",
            icon: <FileText className="h-4 w-4" />,
          },
        ],
      },
    ],
    onLogout: () => alert("Logged out"),
  },
};

// Wallet only (no name)
export const WalletOnly: Story = {
  args: {
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    items: [
      { id: "copy", label: "Copy Address" },
      { id: "explorer", label: "View on Explorer" },
      { id: "switch", label: "Switch Wallet" },
    ],
    onLogout: () => alert("Disconnected"),
    logoutLabel: "Disconnect",
  },
};

// With badges and shortcuts
export const WithBadgesAndShortcuts: Story = {
  args: {
    name: "Power User",
    walletAddress: "0xdeadbeef1234567890abcdef1234567890123456",
    items: [
      {
        id: "profile",
        label: "Profile",
        icon: <User className="h-4 w-4" />,
        shortcut: "⌘P",
      },
      {
        id: "settings",
        label: "Settings",
        icon: <Settings className="h-4 w-4" />,
        shortcut: "⌘,",
      },
      {
        id: "rewards",
        label: "Rewards",
        icon: <Gift className="h-4 w-4" />,
        badge: "5 new",
      },
      {
        id: "notifications",
        label: "Notifications",
        icon: <Bell className="h-4 w-4" />,
        badge: "12",
      },
    ],
    onLogout: () => {},
  },
};

// Outlined variant
export const OutlinedVariant: Story = {
  args: {
    name: "Jane Smith",
    walletAddress: "0x9876543210fedcba9876543210fedcba98765432",
    variant: "outlined",
    items: [
      { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
      {
        id: "settings",
        label: "Settings",
        icon: <Settings className="h-4 w-4" />,
      },
    ],
    onLogout: () => {},
  },
};

// Filled variant
export const FilledVariant: Story = {
  args: {
    name: "Alice",
    variant: "filled",
    items: [
      { id: "profile", label: "Profile" },
      { id: "settings", label: "Settings" },
    ],
    onLogout: () => {},
  },
};

// Glass variant (best on gradients)
export const GlassVariant: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-br from-skai-green to-green-coal-800 rounded-lg">
      <AccountMenu
        name="VIP Trader"
        walletAddress="0x1234...5678"
        variant="glass"
        items={[
          {
            id: "profile",
            label: "Profile",
            icon: <User className="h-4 w-4" />,
          },
          {
            id: "settings",
            label: "Settings",
            icon: <Settings className="h-4 w-4" />,
          },
        ]}
        onLogout={() => {}}
      />
    </div>
  ),
};

// Small size
export const SmallSize: Story = {
  args: {
    name: "User",
    size: "sm",
    items: [
      { id: "profile", label: "Profile" },
      { id: "settings", label: "Settings" },
    ],
    onLogout: () => {},
  },
};

// Large size
export const LargeSize: Story = {
  args: {
    name: "Premium Member",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    size: "lg",
    items: [
      { id: "profile", label: "Profile", icon: <User className="h-5 w-5" /> },
      {
        id: "settings",
        label: "Settings",
        icon: <Settings className="h-5 w-5" />,
      },
    ],
    onLogout: () => {},
  },
};

// No chevron
export const NoChevron: Story = {
  args: {
    name: "User",
    showChevron: false,
    items: [
      { id: "profile", label: "Profile" },
      { id: "settings", label: "Settings" },
    ],
    onLogout: () => {},
  },
};

// No logout
export const NoLogout: Story = {
  args: {
    name: "Guest",
    showLogout: false,
    items: [
      { id: "profile", label: "View Profile" },
      { id: "connect", label: "Connect Wallet" },
    ],
  },
};

// With disabled items
export const WithDisabledItems: Story = {
  args: {
    name: "Free User",
    walletAddress: "0x1234...5678",
    items: [
      { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
      {
        id: "premium",
        label: "Premium Features",
        icon: <Gift className="h-4 w-4" />,
        disabled: true,
        badge: "Pro",
      },
      {
        id: "settings",
        label: "Settings",
        icon: <Settings className="h-4 w-4" />,
      },
    ],
    onLogout: () => {},
  },
};

// Avatar fallback (no image)
export const AvatarFallback: Story = {
  args: {
    name: "Bob Johnson",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    items: [
      { id: "profile", label: "Profile" },
      { id: "settings", label: "Settings" },
    ],
    onLogout: () => {},
  },
};

// Custom avatar fallback
export const CustomAvatarFallback: Story = {
  args: {
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    avatarFallback: "🦊",
    items: [
      { id: "profile", label: "Profile" },
      { id: "settings", label: "Settings" },
    ],
    onLogout: () => {},
  },
};

// In header context
export const HeaderContext: Story = {
  render: () => (
    <div className="flex items-center justify-between w-full max-w-4xl p-4 bg-card rounded-lg border">
      <div className="font-bold text-lg">SKAI Trading</div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">$12,450.00</span>
        <AccountMenu
          name="Trader"
          walletAddress="0x1234...5678"
          variant="outlined"
          size="sm"
          items={[
            {
              id: "profile",
              label: "Profile",
              icon: <User className="h-4 w-4" />,
            },
            {
              id: "settings",
              label: "Settings",
              icon: <Settings className="h-4 w-4" />,
            },
          ]}
          onLogout={() => alert("Disconnected")}
          logoutLabel="Disconnect"
        />
      </div>
    </div>
  ),
};
