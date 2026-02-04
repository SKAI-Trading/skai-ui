import type { Meta, StoryObj } from "@storybook/react";
import { SpectatorOverlay, type SpectatorInfo, type SpectatorGameState } from "./spectator-overlay";

const meta: Meta<typeof SpectatorOverlay> = {
  title: "Overlays/SpectatorOverlay",
  component: SpectatorOverlay,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
A live spectator overlay for watching other players in gaming contexts.

Features:
- Real-time player information display
- Live game statistics and metrics
- Animated indicators and effects
- Smooth animations and transitions
- Exit spectator mode functionality

Perfect for:
- Live game spectating
- Player following systems
- Real-time stat displays
- Social gaming features
        `,
      },
    },
  },
  argTypes: {
    isActive: {
      control: "boolean",
      description: "Whether the spectator overlay is currently active",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SpectatorOverlay>;

// Demo player data
const demoPlayer: SpectatorInfo = {
  id: "player-123",
  name: "CryptoTrader",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoTrader",
  level: 42,
  badge: "VIP",
};

const demoGameState: SpectatorGameState = {
  betAmount: 100.5,
  lastWin: 250.75,
  currentGame: "Plinko",
  streak: 5,
  totalWins: 89,
};

export const Default: Story = {
  args: {
    isActive: true,
    player: demoPlayer,
    gameState: demoGameState,
    onExit: () => console.log("Exit spectator mode"),
  },
  parameters: {
    docs: {
      description: {
        story: "A basic spectator overlay showing all player information and game stats.",
      },
    },
  },
};

export const MinimalPlayer: Story = {
  args: {
    isActive: true,
    player: {
      id: "player-456",
      name: "NewPlayer",
    },
    gameState: {
      betAmount: 10.0,
      lastWin: 0,
    },
    onExit: () => console.log("Exit spectator mode"),
  },
  parameters: {
    docs: {
      description: {
        story: "Spectator overlay with minimal player information (no avatar, level, or badges).",
      },
    },
  },
};

export const HighRoller: Story = {
  args: {
    isActive: true,
    player: {
      id: "player-789",
      name: "WhalePlayer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=WhalePlayer",
      level: 99,
      badge: "🐋 WHALE",
    },
    gameState: {
      betAmount: 10000,
      lastWin: 25000,
      currentGame: "Crash",
      streak: 12,
      totalWins: 567,
    },
    onExit: () => console.log("Exit spectator mode"),
  },
  parameters: {
    docs: {
      description: {
        story: "Spectator overlay for a high-roller player with large bets and wins.",
      },
    },
  },
};

export const LongStreak: Story = {
  args: {
    isActive: true,
    player: {
      id: "player-streak",
      name: "LuckyStreak",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=LuckyStreak",
      level: 67,
      badge: "🔥 HOT",
    },
    gameState: {
      betAmount: 500,
      lastWin: 1200,
      currentGame: "Dice",
      streak: 25,
      totalWins: 1234,
    },
    onExit: () => console.log("Exit spectator mode"),
  },
  parameters: {
    docs: {
      description: {
        story: "Spectator overlay showing a player on a hot winning streak.",
      },
    },
  },
};

export const NewPlayer: Story = {
  args: {
    isActive: true,
    player: {
      id: "player-new",
      name: "FirstTimer",
      level: 1,
    },
    gameState: {
      betAmount: 1,
      lastWin: 2.5,
      currentGame: "Slots",
      streak: 2,
      totalWins: 3,
    },
    onExit: () => console.log("Exit spectator mode"),
  },
  parameters: {
    docs: {
      description: {
        story: "Spectator overlay for a new player just getting started.",
      },
    },
  },
};

export const Interactive: Story = {
  render: function InteractiveSpectator() {
    return (
      <div className="relative h-[400px] w-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-lg overflow-hidden">
        {/* Mock game content */}
        <div className="p-8 text-white">
          <h1 className="text-3xl font-bold mb-4">🎰 SKAI Casino</h1>
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-2">Plinko</h3>
              <p className="text-sm opacity-80">Drop and win big!</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-2">Crash</h3>
              <p className="text-sm opacity-80">Multiplier mayhem</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-2">Dice</h3>
              <p className="text-sm opacity-80">Roll the dice</p>
            </div>
          </div>
        </div>

        <SpectatorOverlay
          isActive={true}
          player={demoPlayer}
          gameState={demoGameState}
          onExit={() => alert("Exiting spectator mode!")}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Interactive spectator overlay with a realistic gaming background.",
      },
    },
  },
};

export const Inactive: Story = {
  args: {
    isActive: false,
    player: demoPlayer,
    gameState: demoGameState,
    onExit: () => console.log("Exit spectator mode"),
  },
  parameters: {
    docs: {
      description: {
        story: "Spectator overlay in inactive state (not visible).",
      },
    },
  },
};