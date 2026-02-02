import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../components/overlays/command";
import { Button } from "../components/core/button";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  TrendingUp,
  Gamepad2,
  Wallet,
  Search,
} from "lucide-react";

const meta: Meta<typeof Command> = {
  title: "Overlays/Command",
  component: Command,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A command menu component for quick actions and search. Press ⌘K to open.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Command>;

export const Default: Story = {
  render: () => (
    <Command className="w-[400px] rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <Smile className="mr-2 h-4 w-4" />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem>
            <Calculator className="mr-2 h-4 w-4" />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const WithDialog: Story = {
  render: function CommandDialogDemo() {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
      const down = (e: KeyboardEvent) => {
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          setOpen((open) => !open);
        }
      };
      document.addEventListener("keydown", down);
      return () => document.removeEventListener("keydown", down);
    }, []);

    return (
      <>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Press{" "}
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>{" "}
            or click the button below
          </p>
          <Button onClick={() => setOpen(true)}>
            <Search className="mr-2 h-4 w-4" />
            Open Command Menu
          </Button>
        </div>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem>
                <Smile className="mr-2 h-4 w-4" />
                <span>Search Emoji</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </>
    );
  },
};

export const TradingCommands: Story = {
  name: "Trading Platform Commands",
  render: () => (
    <Command className="w-[400px] rounded-lg border shadow-md">
      <CommandInput placeholder="Search markets, actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick Actions">
          <CommandItem>
            <TrendingUp className="mr-2 h-4 w-4" />
            <span>New Trade</span>
            <CommandShortcut>⌘T</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Wallet className="mr-2 h-4 w-4" />
            <span>Deposit</span>
            <CommandShortcut>⌘D</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Markets">
          <CommandItem>
            <span className="mr-2">₿</span>
            <span>BTC/USDC</span>
            <span className="ml-auto text-xs text-muted-foreground">$42,150.00</span>
          </CommandItem>
          <CommandItem>
            <span className="mr-2">Ξ</span>
            <span>ETH/USDC</span>
            <span className="ml-auto text-xs text-muted-foreground">$2,250.00</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Games">
          <CommandItem>
            <Gamepad2 className="mr-2 h-4 w-4" />
            <span>Play HiLo</span>
          </CommandItem>
          <CommandItem>
            <Gamepad2 className="mr-2 h-4 w-4" />
            <span>Play Crash</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const SearchResults: Story = {
  name: "With Search Results",
  render: () => (
    <Command className="w-[400px] rounded-lg border shadow-md">
      <CommandInput placeholder="Search tokens..." value="eth" />
      <CommandList>
        <CommandGroup heading="Tokens">
          <CommandItem>
            <div className="flex flex-1 items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                Ξ
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Ethereum</span>
                <span className="text-xs text-muted-foreground">ETH</span>
              </div>
            </div>
            <span className="text-sm">$2,250.00</span>
          </CommandItem>
          <CommandItem>
            <div className="flex flex-1 items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-xs text-white">
                S
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Staked Ethereum</span>
                <span className="text-xs text-muted-foreground">stETH</span>
              </div>
            </div>
            <span className="text-sm">$2,248.50</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};
