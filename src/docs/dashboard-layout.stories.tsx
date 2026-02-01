import type { Meta, StoryObj } from "@storybook/react";
import {
  DashboardLayout,
  DashboardSidebar,
  DashboardContent,
} from "../components/dashboard-layout";
import {
  Home,
  BarChart3,
  Wallet,
  Settings,
  HelpCircle,
  User,
  Bell,
  Search,
  ChevronRight,
} from "lucide-react";

const meta: Meta<typeof DashboardLayout> = {
  title: "Layout/DashboardLayout",
  component: DashboardLayout,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Dashboard layout with collapsible sidebar, responsive design, and breadcrumb support.

## Features
- Collapsible sidebar (controlled or uncontrolled)
- Mobile responsive with overlay sidebar
- Header slot for top navigation
- DashboardSidebar component with header/footer slots
- DashboardContent component with title, breadcrumb, actions

## Usage
\`\`\`tsx
import { DashboardLayout, DashboardSidebar, DashboardContent } from "@skai/ui";

<DashboardLayout
  sidebar={
    <DashboardSidebar header={<Logo />} footer={<UserMenu />}>
      <Navigation />
    </DashboardSidebar>
  }
  header={<TopNav />}
>
  <DashboardContent
    title="Dashboard"
    breadcrumb={<Breadcrumb />}
    actions={<Button>New Item</Button>}
  >
    <YourContent />
  </DashboardContent>
</DashboardLayout>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DashboardLayout>;

// =============================================================================
// MOCK COMPONENTS
// =============================================================================

const navItems = [
  { icon: Home, label: "Dashboard", active: true },
  { icon: BarChart3, label: "Analytics", active: false },
  { icon: Wallet, label: "Wallet", active: false },
  { icon: Settings, label: "Settings", active: false },
  { icon: HelpCircle, label: "Help", active: false },
];

const MockSidebarHeader = ({ collapsed }: { collapsed?: boolean }) => (
  <div
    className={`flex items-center ${collapsed ? "justify-center" : "gap-2"}`}
  >
    <div className="w-8 h-8 rounded-lg bg-skai-green flex items-center justify-center text-white font-bold">
      S
    </div>
    {!collapsed && <span className="font-semibold text-foreground">SKAI</span>}
  </div>
);

const MockNavigation = ({ collapsed }: { collapsed?: boolean }) => (
  <div className="space-y-1">
    {navItems.map((item) => (
      <button
        key={item.label}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
          item.active
            ? "bg-skai-green/10 text-skai-green"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        } ${collapsed ? "justify-center" : ""}`}
      >
        <item.icon className="h-5 w-5 shrink-0" />
        {!collapsed && <span className="text-sm">{item.label}</span>}
      </button>
    ))}
  </div>
);

const MockSidebarFooter = ({ collapsed }: { collapsed?: boolean }) => (
  <div
    className={`flex items-center ${collapsed ? "justify-center" : "gap-3"} p-2 rounded-lg bg-muted/50`}
  >
    <div className="w-8 h-8 rounded-full bg-skai-green/20 flex items-center justify-center">
      <User className="h-4 w-4 text-skai-green" />
    </div>
    {!collapsed && (
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">0x1234...5678</div>
        <div className="text-xs text-muted-foreground">Connected</div>
      </div>
    )}
  </div>
);

const MockHeader = () => (
  <div className="flex-1 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search..."
          className="pl-9 pr-4 py-1.5 text-sm bg-muted rounded-lg border border-border w-64"
        />
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button className="p-2 rounded-lg hover:bg-muted relative">
        <Bell className="h-5 w-5" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      </button>
      <button className="p-2 rounded-lg hover:bg-muted">
        <Settings className="h-5 w-5" />
      </button>
    </div>
  </div>
);

const MockBreadcrumb = () => (
  <div className="flex items-center gap-2 text-sm">
    <span className="text-muted-foreground hover:text-foreground cursor-pointer">
      Home
    </span>
    <ChevronRight className="h-4 w-4 text-muted-foreground" />
    <span className="text-foreground">Dashboard</span>
  </div>
);

const MockDashboardCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {[
      { label: "Total Balance", value: "$12,456.78", change: "+12.5%" },
      { label: "24h Volume", value: "$1,234.56", change: "+5.2%" },
      { label: "Open Positions", value: "3", change: "0" },
      { label: "PnL (30d)", value: "+$456.78", change: "+8.3%" },
    ].map((card) => (
      <div
        key={card.label}
        className="p-4 bg-card rounded-lg border border-border"
      >
        <div className="text-sm text-muted-foreground">{card.label}</div>
        <div className="text-2xl font-semibold mt-1">{card.value}</div>
        <div
          className={`text-sm mt-1 ${card.change.startsWith("+") ? "text-green-500" : "text-muted-foreground"}`}
        >
          {card.change}
        </div>
      </div>
    ))}
  </div>
);

// =============================================================================
// STORIES
// =============================================================================

export const Default: Story = {
  render: () => (
    <DashboardLayout
      sidebar={
        <DashboardSidebar
          header={<MockSidebarHeader />}
          footer={<MockSidebarFooter />}
        >
          <MockNavigation />
        </DashboardSidebar>
      }
      header={<MockHeader />}
    >
      <DashboardContent
        title="Dashboard"
        subtitle="Welcome back! Here's an overview of your portfolio."
        breadcrumb={<MockBreadcrumb />}
        actions={
          <button className="px-4 py-2 bg-skai-green text-white rounded-lg text-sm font-medium">
            New Trade
          </button>
        }
      >
        <MockDashboardCards />
      </DashboardContent>
    </DashboardLayout>
  ),
};

export const CollapsedSidebar: Story = {
  render: () => (
    <DashboardLayout
      defaultSidebarCollapsed={true}
      sidebar={
        <DashboardSidebar
          collapsed={true}
          header={<MockSidebarHeader collapsed />}
          footer={<MockSidebarFooter collapsed />}
        >
          <MockNavigation collapsed />
        </DashboardSidebar>
      }
      header={<MockHeader />}
    >
      <DashboardContent title="Dashboard">
        <MockDashboardCards />
      </DashboardContent>
    </DashboardLayout>
  ),
  parameters: {
    docs: {
      description: {
        story: "Sidebar in collapsed state showing only icons.",
      },
    },
  },
};

export const NoSidebar: Story = {
  render: () => (
    <DashboardLayout header={<MockHeader />}>
      <DashboardContent title="Dashboard" breadcrumb={<MockBreadcrumb />}>
        <MockDashboardCards />
      </DashboardContent>
    </DashboardLayout>
  ),
  parameters: {
    docs: {
      description: {
        story: "Dashboard without sidebar, header only.",
      },
    },
  },
};

export const NoHeader: Story = {
  render: () => (
    <DashboardLayout
      sidebar={
        <DashboardSidebar header={<MockSidebarHeader />}>
          <MockNavigation />
        </DashboardSidebar>
      }
    >
      <DashboardContent title="Dashboard">
        <MockDashboardCards />
      </DashboardContent>
    </DashboardLayout>
  ),
  parameters: {
    docs: {
      description: {
        story: "Dashboard without top header, sidebar only.",
      },
    },
  },
};

export const MutedBackground: Story = {
  render: () => (
    <DashboardLayout
      variant="muted"
      sidebar={
        <DashboardSidebar
          header={<MockSidebarHeader />}
          footer={<MockSidebarFooter />}
        >
          <MockNavigation />
        </DashboardSidebar>
      }
      header={<MockHeader />}
    >
      <DashboardContent title="Dashboard">
        <MockDashboardCards />
      </DashboardContent>
    </DashboardLayout>
  ),
  parameters: {
    docs: {
      description: {
        story: "Muted background variant for subtle contrast.",
      },
    },
  },
};

export const ContentMaxWidth: Story = {
  render: () => (
    <DashboardLayout
      sidebar={
        <DashboardSidebar header={<MockSidebarHeader />}>
          <MockNavigation />
        </DashboardSidebar>
      }
    >
      <DashboardContent title="Settings" maxWidth="lg">
        <div className="space-y-4">
          <div className="p-4 bg-card rounded-lg border border-border">
            <h3 className="font-medium mb-2">Profile Settings</h3>
            <p className="text-sm text-muted-foreground">
              Content constrained to large max-width for better readability.
            </p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border">
            <h3 className="font-medium mb-2">Notification Preferences</h3>
            <p className="text-sm text-muted-foreground">
              Useful for settings pages and forms.
            </p>
          </div>
        </div>
      </DashboardContent>
    </DashboardLayout>
  ),
  parameters: {
    docs: {
      description: {
        story: "DashboardContent with max-width constraint for readability.",
      },
    },
  },
};

export const FullWidthContent: Story = {
  render: () => (
    <DashboardLayout
      sidebar={
        <DashboardSidebar header={<MockSidebarHeader />}>
          <MockNavigation />
        </DashboardSidebar>
      }
    >
      <DashboardContent title="Analytics" noPadding>
        <div className="h-96 bg-card border-y border-border flex items-center justify-center">
          <span className="text-muted-foreground">[Full-width Chart]</span>
        </div>
      </DashboardContent>
    </DashboardLayout>
  ),
  parameters: {
    docs: {
      description: {
        story: "Content area without padding for full-bleed elements.",
      },
    },
  },
};
