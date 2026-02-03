import type { Meta, StoryObj } from "@storybook/react";
import { EmojiPicker, type EmojiItem, type StickerItem, type GifItem } from "./emoji-picker";
import { Button } from "../core/button";
import { useState } from "react";

const meta: Meta<typeof EmojiPicker> = {
  title: "Overlays/EmojiPicker",
  component: EmojiPicker,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
A comprehensive emoji, GIF, and sticker picker with search functionality.

Features:
- Searchable emoji library with categories
- Custom sticker support
- GIF search integration
- Tabbed interface for different content types
- Quick access to common emojis
- Responsive popover design

Perfect for:
- Message composition
- Reaction systems
- Social interactions
- Comment sections
        `,
      },
    },
  },
  argTypes: {
    enableGifs: {
      control: "boolean",
      description: "Whether to show the GIF search tab",
    },
    enableStickers: {
      control: "boolean",
      description: "Whether to show the stickers tab",
    },
    isGifLoading: {
      control: "boolean",
      description: "Loading state for GIF search",
    },
  },
};

export default meta;
type Story = StoryObj<typeof EmojiPicker>;

export const Default: Story = {
  args: {
    enableGifs: false,
    enableStickers: true,
    onEmojiSelect: (emoji: string) => console.log("Selected emoji:", emoji),
    onStickerSelect: (sticker: StickerItem) => console.log("Selected sticker:", sticker),
  },
  parameters: {
    docs: {
      description: {
        story: "Basic emoji picker with emojis and stickers enabled.",
      },
    },
  },
};

export const WithGifs: Story = {
  args: {
    enableGifs: true,
    enableStickers: true,
    onEmojiSelect: (emoji: string) => console.log("Selected emoji:", emoji),
    onStickerSelect: (sticker: StickerItem) => console.log("Selected sticker:", sticker),
    onGifSelect: (gif: GifItem) => console.log("Selected GIF:", gif),
    onGifSearch: async (query: string) => {
      // Mock GIF search
      console.log("Searching GIFs for:", query);
      return [
        {
          id: "1",
          url: "https://media.giphy.com/media/3o7aCSPqXE5C6T8tBC/giphy.gif",
          title: `${query} GIF 1`,
          preview: "https://media.giphy.com/media/3o7aCSPqXE5C6T8tBC/giphy_s.gif",
        },
        {
          id: "2", 
          url: "https://media.giphy.com/media/26gspjl5bxzhSdJtK/giphy.gif",
          title: `${query} GIF 2`,
          preview: "https://media.giphy.com/media/26gspjl5bxzhSdJtK/giphy_s.gif",
        },
      ];
    },
    isGifLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Emoji picker with GIF search functionality enabled.",
      },
    },
  },
};

export const CustomTrigger: Story = {
  args: {
    enableGifs: false,
    enableStickers: true,
    onEmojiSelect: (emoji: string) => console.log("Selected emoji:", emoji),
    trigger: (
      <Button variant="outline" size="sm" className="gap-2">
        😀 Add Reaction
      </Button>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Emoji picker with a custom trigger button.",
      },
    },
  },
};

export const EmojisOnly: Story = {
  args: {
    enableGifs: false,
    enableStickers: false,
    onEmojiSelect: (emoji: string) => console.log("Selected emoji:", emoji),
  },
  parameters: {
    docs: {
      description: {
        story: "Simplified emoji picker with only emoji support.",
      },
    },
  },
};

export const CustomEmojis: Story = {
  args: {
    enableGifs: false,
    enableStickers: false,
    customEmojis: [
      { emoji: "🚀", name: "rocket", category: "skai" },
      { emoji: "💎", name: "diamond", category: "skai" },
      { emoji: "📈", name: "chart up", category: "trading" },
      { emoji: "📉", name: "chart down", category: "trading" },
      { emoji: "💰", name: "money bag", category: "trading" },
      { emoji: "⚡", name: "lightning", category: "energy" },
      { emoji: "🔥", name: "fire", category: "energy" },
      { emoji: "💪", name: "muscle", category: "power" },
    ] as EmojiItem[],
    onEmojiSelect: (emoji: string) => console.log("Selected emoji:", emoji),
  },
  parameters: {
    docs: {
      description: {
        story: "Emoji picker with custom emoji set organized by categories.",
      },
    },
  },
};

export const Interactive: Story = {
  render: function InteractiveEmojiPicker() {
    const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
    const [selectedStickers, setSelectedStickers] = useState<StickerItem[]>([]);

    const handleEmojiSelect = (emoji: string) => {
      setSelectedEmojis(prev => [...prev, emoji]);
    };

    const handleStickerSelect = (sticker: StickerItem) => {
      setSelectedStickers(prev => [...prev, sticker]);
    };

    const handleGifSearch = async (query: string): Promise<GifItem[]> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return [
        {
          id: `${query}-1`,
          url: "https://media.giphy.com/media/3o7aCSPqXE5C6T8tBC/giphy.gif",
          title: `${query} result 1`,
          preview: "https://media.giphy.com/media/3o7aCSPqXE5C6T8tBC/giphy_s.gif",
        },
        {
          id: `${query}-2`,
          url: "https://media.giphy.com/media/26gspjl5bxzhSdJtK/giphy.gif", 
          title: `${query} result 2`,
          preview: "https://media.giphy.com/media/26gspjl5bxzhSdJtK/giphy_s.gif",
        },
        {
          id: `${query}-3`,
          url: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
          title: `${query} result 3`,
          preview: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy_s.gif",
        },
      ];
    };

    return (
      <div className="space-y-4 p-6">
        <div className="flex items-center gap-4">
          <EmojiPicker
            enableGifs={true}
            enableStickers={true}
            onEmojiSelect={handleEmojiSelect}
            onStickerSelect={handleStickerSelect}
            onGifSelect={(gif) => console.log("Selected GIF:", gif)}
            onGifSearch={handleGifSearch}
            trigger={
              <Button variant="outline" size="sm" className="gap-2">
                😀 Pick Emoji
              </Button>
            }
          />
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setSelectedEmojis([]);
              setSelectedStickers([]);
            }}
          >
            Clear All
          </Button>
        </div>

        {selectedEmojis.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Selected Emojis:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedEmojis.map((emoji, index) => (
                <span 
                  key={index}
                  className="text-2xl p-2 bg-gray-100 dark:bg-gray-800 rounded-lg"
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        )}

        {selectedStickers.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Selected Stickers:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedStickers.map((sticker) => (
                <div 
                  key={sticker.id}
                  className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-center"
                >
                  <div className="text-2xl">{sticker.emoji}</div>
                  <div className="text-xs text-gray-600">{sticker.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Interactive demo showing emoji and sticker selection with real-time display.",
      },
    },
  },
};