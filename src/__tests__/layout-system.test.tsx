import * as React from "react";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  AppShell,
  AppShellContent,
  LAYOUT_HEIGHTS,
  FULL_HEIGHT_CLASS,
} from "../components/layout/app-shell";
import { AppHeader } from "../components/layout/app-header";
import { AppFooter, FooterLinkGroup } from "../components/layout/app-footer";
import {
  MobileNav,
  MobileNavSpacer,
  type MobileNavItem,
} from "../components/navigation/mobile-nav";
import { DockBar, DockBarIcon, DockBarSpacer } from "../components/navigation/dock-bar";

// =============================================================================
// MOCK WINDOW.MATCHMEDIA
// =============================================================================

const mockMatchMedia = (matches: boolean = false) => {
  return (query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
};

beforeAll(() => {
  window.matchMedia = mockMatchMedia(
    false,
  ) as unknown as typeof window.matchMedia;
});

afterAll(() => {
  // @ts-expect-error - Reset mock
  delete window.matchMedia;
});

// =============================================================================
// LAYOUT CONSTANTS TESTS
// =============================================================================

describe("Layout Constants", () => {
  it("exports correct LAYOUT_HEIGHTS values", () => {
    expect(LAYOUT_HEIGHTS.header).toBe(56);
    expect(LAYOUT_HEIGHTS.bottomBar).toBe(48);
    expect(LAYOUT_HEIGHTS.mobileNav).toBe(64);
    expect(LAYOUT_HEIGHTS.total).toBe(104);
  });

  it("exports FULL_HEIGHT_CLASS with correct calculation", () => {
    expect(FULL_HEIGHT_CLASS).toBe("h-[calc(100vh-104px)]");
  });
});

// =============================================================================
// APP SHELL TESTS
// =============================================================================

describe("AppShell", () => {
  it("renders children correctly", () => {
    render(
      <AppShell>
        <div data-testid="child">Test Content</div>
      </AppShell>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders with header slot", () => {
    render(
      <AppShell header={<header data-testid="header">Header</header>}>
        <div>Content</div>
      </AppShell>,
    );
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("renders with footer slot", () => {
    render(
      <AppShell footer={<footer data-testid="footer">Footer</footer>}>
        <div>Content</div>
      </AppShell>,
    );
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("renders with bottomBar slot", () => {
    render(
      <AppShell bottomBar={<div data-testid="bottom-bar">Bottom Bar</div>}>
        <div>Content</div>
      </AppShell>,
    );
    expect(screen.getByTestId("bottom-bar")).toBeInTheDocument();
  });

  it("renders with sidebar slot in dashboard variant", () => {
    render(
      <AppShell
        variant="dashboard"
        sidebar={<aside data-testid="sidebar">Sidebar</aside>}
      >
        <div>Content</div>
      </AppShell>,
    );
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });
});

describe("AppShellContent", () => {
  it("renders with centered variant", () => {
    render(
      <AppShellContent variant="centered" data-testid="content">
        Centered Content
      </AppShellContent>,
    );
    const content = screen.getByTestId("content");
    expect(content).toBeInTheDocument();
  });

  it("renders with fullHeight prop", () => {
    render(
      <AppShellContent fullHeight data-testid="content">
        Full Height Content
      </AppShellContent>,
    );
    const content = screen.getByTestId("content");
    expect(content).toHaveClass("h-[calc(100vh-104px)]");
  });
});

// =============================================================================
// APP HEADER TESTS
// =============================================================================

describe("AppHeader", () => {
  it("renders with logo", () => {
    render(<AppHeader logo={<div data-testid="logo">Logo</div>} />);
    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });

  it("renders with navigation", () => {
    render(<AppHeader navigation={<nav data-testid="nav">Nav</nav>} />);
    expect(screen.getByTestId("nav")).toBeInTheDocument();
  });

  it("renders with actions", () => {
    render(<AppHeader actions={<div data-testid="actions">Actions</div>} />);
    expect(screen.getByTestId("actions")).toBeInTheDocument();
  });

  it("applies glass variant", () => {
    const { container } = render(<AppHeader variant="glass" />);
    const header = container.querySelector("header");
    expect(header).toHaveClass("border-white/5");
  });

  it("applies transparent variant", () => {
    const { container } = render(<AppHeader variant="transparent" />);
    const header = container.querySelector("header");
    expect(header).toHaveClass("border-transparent");
  });
});

// =============================================================================
// APP FOOTER TESTS
// =============================================================================

describe("AppFooter", () => {
  it("renders with copyright", () => {
    render(<AppFooter copyright="© 2026 SKAI" />);
    expect(screen.getByText("© 2026 SKAI")).toBeInTheDocument();
  });

  it("renders with logo", () => {
    render(<AppFooter logo={<div data-testid="footer-logo">Logo</div>} />);
    expect(screen.getByTestId("footer-logo")).toBeInTheDocument();
  });

  it("renders FooterLinkGroup", () => {
    const links = [
      { label: "Link 1", href: "/link1" },
      { label: "Link 2", href: "/link2" },
    ];
    render(
      <FooterLinkGroup title="Links" links={links} data-testid="link-group" />,
    );
    expect(screen.getByTestId("link-group")).toBeInTheDocument();
    expect(screen.getByText("Links")).toBeInTheDocument();
    expect(screen.getByText("Link 1")).toBeInTheDocument();
    expect(screen.getByText("Link 2")).toBeInTheDocument();
  });
});

// =============================================================================
// MOBILE NAV TESTS
// =============================================================================

describe("MobileNav", () => {
  const mockItems: MobileNavItem[] = [
    { id: "home", label: "Home", icon: <span>🏠</span>, href: "/" },
    { id: "trade", label: "Trade", icon: <span>📈</span>, href: "/trade" },
    {
      id: "profile",
      label: "Profile",
      icon: <span>👤</span>,
      href: "/profile",
    },
  ];

  it("renders navigation items", () => {
    render(<MobileNav items={mockItems} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Trade")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("highlights active item", () => {
    render(<MobileNav items={mockItems} activeItem="trade" />);
    const tradeItem = screen.getByText("Trade").closest("a");
    expect(tradeItem).toHaveClass("text-primary");
  });

  it("renders badges", () => {
    const itemsWithBadge: MobileNavItem[] = [
      {
        id: "notifications",
        label: "Alerts",
        icon: <span>🔔</span>,
        badge: "5",
      },
    ];
    render(<MobileNav items={itemsWithBadge} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("applies glass variant", () => {
    const { container } = render(
      <MobileNav items={mockItems} variant="glass" />,
    );
    const nav = container.querySelector("nav");
    expect(nav).toHaveClass("backdrop-blur-xl");
  });
});

describe("MobileNavSpacer", () => {
  it("renders spacer with correct height and hidden on desktop", () => {
    const { container } = render(<MobileNavSpacer />);
    const spacer = container.firstChild as HTMLElement;
    // Uses inline style for height instead of class
    expect(spacer).toHaveStyle({ height: "64px" });
    expect(spacer).toHaveClass("md:hidden");
  });
});

// =============================================================================
// DOCK BAR TESTS
// =============================================================================

describe("DockBar", () => {
  it("renders children", () => {
    render(
      <DockBar>
        <div data-testid="dock-content">Content</div>
      </DockBar>,
    );
    expect(screen.getByTestId("dock-content")).toBeInTheDocument();
  });

  it("applies glass variant", () => {
    const { container } = render(<DockBar variant="glass">Content</DockBar>);
    // DockBar uses div, not footer
    const dockbar = container.firstChild as HTMLElement;
    expect(dockbar).toHaveClass("backdrop-blur-xl");
  });

  it("renders ticker slot", () => {
    render(
      <DockBar ticker={<span data-testid="ticker">BTC $45,000</span>}>
        Content
      </DockBar>,
    );
    expect(screen.getByTestId("ticker")).toBeInTheDocument();
  });

  it("renders dock slot", () => {
    render(
      <DockBar dock={<button data-testid="dock-icon">Icon</button>}>
        Content
      </DockBar>,
    );
    expect(screen.getByTestId("dock-icon")).toBeInTheDocument();
  });
});

describe("DockBarIcon", () => {
  it("renders with label", () => {
    render(<DockBarIcon label="Settings" icon={<span>⚙️</span>} />);
    expect(screen.getByLabelText("Settings")).toBeInTheDocument();
  });

  it("renders badge", () => {
    render(<DockBarIcon label="Alerts" icon={<span>🔔</span>} badge="3" />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders active state with bg-accent", () => {
    const { container } = render(
      <DockBarIcon label="Active" icon={<span>✓</span>} active />,
    );
    const button = container.querySelector("button");
    // Active state uses bg-accent text-accent-foreground (not text-primary)
    expect(button).toHaveClass("bg-accent");
    expect(button).toHaveClass("text-accent-foreground");
  });
});

describe("DockBarSpacer", () => {
  it("renders spacer with correct height", () => {
    const { container } = render(<DockBarSpacer />);
    const spacer = container.firstChild as HTMLElement;
    // Uses inline style for height instead of class
    expect(spacer).toHaveStyle({ height: "48px" });
  });
});

// =============================================================================
// INTEGRATION TESTS
// =============================================================================

describe("Layout System Integration", () => {
  it("renders complete layout with all slots", () => {
    render(
      <AppShell
        header={<AppHeader logo={<span>SKAI</span>} />}
        footer={<AppFooter copyright="© 2026" />}
        bottomBar={<DockBar>Ticker</DockBar>}
      >
        <AppShellContent>Main Content</AppShellContent>
      </AppShell>,
    );

    expect(screen.getByText("SKAI")).toBeInTheDocument();
    expect(screen.getByText("© 2026")).toBeInTheDocument();
    expect(screen.getByText("Ticker")).toBeInTheDocument();
    expect(screen.getByText("Main Content")).toBeInTheDocument();
  });

  it("renders trading layout with full height content", () => {
    render(
      <AppShell
        header={<AppHeader variant="glass" />}
        bottomBar={<DockBar variant="glass">BTC $45,000</DockBar>}
      >
        <AppShellContent fullHeight>
          <div data-testid="trading-panel">Trading Panel</div>
        </AppShellContent>
      </AppShell>,
    );

    expect(screen.getByTestId("trading-panel")).toBeInTheDocument();
    expect(screen.getByText("BTC $45,000")).toBeInTheDocument();
  });

  it("renders mobile layout with mobile nav", () => {
    const navItems: MobileNavItem[] = [
      { id: "home", label: "Home", icon: <span>🏠</span> },
      { id: "trade", label: "Trade", icon: <span>📊</span> },
    ];

    render(
      <div>
        <AppShell header={<AppHeader />}>
          <AppShellContent>Content</AppShellContent>
        </AppShell>
        <MobileNav items={navItems} activeItem="home" />
        <MobileNavSpacer />
      </div>,
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Trade")).toBeInTheDocument();
  });
});
