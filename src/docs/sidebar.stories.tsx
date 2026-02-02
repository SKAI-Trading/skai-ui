import type { Meta, StoryObj } from "@storybook/react";
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
} from "../components/layout/sidebar";
import {
  Home,
  TrendingUp,
  Gamepad2,
  Wallet,
  Settings,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { Button } from "../components/core/button";

const meta: Meta<typeof Sidebar> = {
  title: "Layout/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A composable sidebar component with support for collapsible sections, icons, and mobile-responsive behavior.",
      },
    },
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="flex h-[600px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

const mainNavItems = [
  { title: "Dashboard", icon: Home, url: "/" },
  { title: "Trade", icon: TrendingUp, url: "/trade" },
  { title: "Play", icon: Gamepad2, url: "/play" },
  { title: "Wallet", icon: Wallet, url: "/wallet" },
];

const settingsItems = [
  { title: "Settings", icon: Settings, url: "/settings" },
  { title: "Help", icon: HelpCircle, url: "/help" },
];

export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2 text-lg font-bold">
            <span className="from-skai-aqua to-skai-nebula bg-gradient-to-r bg-clip-text text-transparent">
              SKAI
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {settingsItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <div className="text-xs text-muted-foreground">© 2026 SKAI Trading</div>
        </SidebarFooter>
      </Sidebar>
      <main className="flex-1 p-6">
        <div className="mb-4 flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold">Main Content</h1>
        </div>
        <p className="text-muted-foreground">
          Click the trigger button to toggle the sidebar.
        </p>
      </main>
    </SidebarProvider>
  ),
};

export const CollapsedByDefault: Story = {
  render: () => (
    <SidebarProvider defaultOpen={false}>
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4">
          <div className="flex items-center justify-center">
            <span className="text-skai-aqua text-xl font-bold">S</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <a href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 p-6">
        <div className="mb-4 flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold">Icon Collapsed Sidebar</h1>
        </div>
        <p className="text-muted-foreground">
          The sidebar shows only icons when collapsed. Hover to see tooltips.
        </p>
      </main>
    </SidebarProvider>
  ),
};

export const TradingPlatform: Story = {
  name: "Trading Platform Example",
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b p-4">
          <div className="flex items-center gap-2">
            <div className="from-skai-aqua to-skai-nebula flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br font-bold text-white">
              S
            </div>
            <span className="font-semibold">SKAI Trading</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Markets</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <TrendingUp className="h-4 w-4" />
                    <span>Spot</span>
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <TrendingUp className="h-4 w-4" />
                    <span>Perpetuals</span>
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Games</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Gamepad2 className="h-4 w-4" />
                    <span>HiLo</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Gamepad2 className="h-4 w-4" />
                    <span>Crash</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t p-4">
          <Button variant="outline" size="sm" className="w-full">
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        </SidebarFooter>
      </Sidebar>
      <main className="flex-1 p-6">
        <SidebarTrigger />
      </main>
    </SidebarProvider>
  ),
};
