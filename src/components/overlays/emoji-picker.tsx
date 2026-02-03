/**
 * Emoji Picker Component
 *
 * A comprehensive emoji, GIF, and sticker picker with search functionality.
 * Features tabs for different content types and quick access to common emojis.
 * 
 * Used for:
 * - Message composition
 * - Reaction selection
 * - Social interactions
 */

import * as React from "react";
import { Smile, Image, Sticker, Loader2, Search } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../core/button";
import { Input } from "../core/input";
import { ScrollArea } from "../layout/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../navigation/tabs";

// ============================================================================
// TYPES & DATA
// ============================================================================

export interface EmojiItem {
  emoji: string;
  name: string;
  category?: string;
}

export interface StickerItem {
  id: string;
  emoji: string;
  name: string;
}

export interface GifItem {
  id: string;
  url: string;
  title: string;
  preview?: string;
}

export interface EmojiPickerProps {
  /** Callback when emoji is selected */
  onEmojiSelect?: (emoji: string) => void;
  /** Callback when sticker is selected */
  onStickerSelect?: (sticker: StickerItem) => void;
  /** Callback when GIF is selected */
  onGifSelect?: (gif: GifItem) => void;
  /** Whether to show GIF tab */
  enableGifs?: boolean;
  /** Whether to show sticker tab */
  enableStickers?: boolean;
  /** Custom emoji data */
  customEmojis?: EmojiItem[];
  /** Custom stickers */
  customStickers?: StickerItem[];
  /** GIF search function */
  onGifSearch?: (query: string) => Promise<GifItem[]>;
  /** Loading state for GIFs */
  isGifLoading?: boolean;
  /** Trigger button content */
  trigger?: React.ReactNode;
  /** Additional CSS class */
  className?: string;
}

// Default emoji data
const DEFAULT_EMOJIS: EmojiItem[] = [
  // Smileys
  { emoji: "😀", name: "grinning face", category: "smileys" },
  { emoji: "😂", name: "face with tears of joy", category: "smileys" },
  { emoji: "🥹", name: "face holding back tears", category: "smileys" },
  { emoji: "😍", name: "smiling face with heart-eyes", category: "smileys" },
  { emoji: "🥰", name: "smiling face with hearts", category: "smileys" },
  { emoji: "😎", name: "smiling face with sunglasses", category: "smileys" },
  { emoji: "🤔", name: "thinking face", category: "smileys" },
  { emoji: "😅", name: "grinning face with sweat", category: "smileys" },
  { emoji: "😊", name: "smiling face with smiling eyes", category: "smileys" },
  { emoji: "🥺", name: "pleading face", category: "smileys" },
  { emoji: "😤", name: "face with steam from nose", category: "smileys" },
  { emoji: "😭", name: "loudly crying face", category: "smileys" },
  { emoji: "🤣", name: "rolling on the floor laughing", category: "smileys" },
  { emoji: "💀", name: "skull", category: "smileys" },
  
  // Gestures
  { emoji: "👍", name: "thumbs up", category: "gestures" },
  { emoji: "👎", name: "thumbs down", category: "gestures" },
  { emoji: "💪", name: "flexed biceps", category: "gestures" },
  { emoji: "🙏", name: "folded hands", category: "gestures" },
  { emoji: "👀", name: "eyes", category: "gestures" },
  
  // Hearts & Symbols
  { emoji: "❤️", name: "red heart", category: "hearts" },
  { emoji: "🔥", name: "fire", category: "symbols" },
  { emoji: "💯", name: "hundred points", category: "symbols" },
  { emoji: "🎉", name: "party popper", category: "symbols" },
  { emoji: "✨", name: "sparkles", category: "symbols" },
  { emoji: "🚀", name: "rocket", category: "symbols" },
  { emoji: "💎", name: "gem stone", category: "symbols" },
  { emoji: "⚡", name: "high voltage", category: "symbols" },
  { emoji: "🎯", name: "direct hit", category: "symbols" },
  
  // Money & Trading
  { emoji: "📈", name: "chart increasing", category: "trading" },
  { emoji: "📉", name: "chart decreasing", category: "trading" },
  { emoji: "💰", name: "money bag", category: "trading" },
  { emoji: "🏆", name: "trophy", category: "trading" },
]

const DEFAULT_STICKERS: StickerItem[] = [
  { id: "party", emoji: "🎊", name: "Party" },
  { id: "gift", emoji: "🎁", name: "Gift" },
  { id: "balloon", emoji: "🎈", name: "Balloon" },
  { id: "piñata", emoji: "🪅", name: "Piñata" },
  { id: "confetti", emoji: "🎉", name: "Confetti" },
  { id: "sparkles", emoji: "✨", name: "Sparkles" },
  { id: "star", emoji: "⭐", name: "Star" },
  { id: "rainbow", emoji: "🌈", name: "Rainbow" },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const EmojiPicker = React.forwardRef<HTMLDivElement, EmojiPickerProps>(
  ({
    onEmojiSelect,
    onStickerSelect,
    onGifSelect,
    enableGifs = false,
    enableStickers = true,
    customEmojis,
    customStickers,
    onGifSearch,
    isGifLoading = false,
    trigger,
    className,
  }, ref) => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [gifs, setGifs] = React.useState<GifItem[]>([]);
    const [activeTab, setActiveTab] = React.useState("emojis");

    const emojis = customEmojis || DEFAULT_EMOJIS;
    const stickers = customStickers || DEFAULT_STICKERS;

    // Filter emojis based on search
    const filteredEmojis = React.useMemo(() => {
      if (!searchQuery) return emojis;
      return emojis.filter(
        item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.emoji.includes(searchQuery)
      );
    }, [emojis, searchQuery]);

    // Group emojis by category
    const emojisByCategory = React.useMemo(() => {
      const grouped: Record<string, EmojiItem[]> = {};
      filteredEmojis.forEach(emoji => {
        const category = emoji.category || "other";
        if (!grouped[category]) grouped[category] = [];
        grouped[category].push(emoji);
      });
      return grouped;
    }, [filteredEmojis]);

    // Handle GIF search with debouncing
    React.useEffect(() => {
      if (!onGifSearch || !searchQuery || activeTab !== "gifs") return;
      
      const timeout = setTimeout(async () => {
        try {
          const results = await onGifSearch(searchQuery);
          setGifs(results);
        } catch (error) {
          console.error("GIF search failed:", error);
        }
      }, 500);

      return () => clearTimeout(timeout);
    }, [searchQuery, onGifSearch, activeTab]);

    return (
      <div ref={ref} className={cn("inline-block", className)}>
        <Popover>
          <PopoverTrigger asChild>
            {trigger || (
              <Button variant="ghost" size="sm">
                <Smile className="w-4 h-4" />
              </Button>
            )}
          </PopoverTrigger>
          <PopoverContent 
            className="w-80 p-0"
            side="top"
            sideOffset={5}
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              {/* Tab Navigation */}
              <div className="border-b p-2">
                <div className="flex items-center gap-2 mb-2">
                  <Search className="w-4 h-4 text-gray-500" />
                  <Input
                    placeholder={
                      activeTab === "gifs" ? "Search GIFs..." : 
                      activeTab === "stickers" ? "Search stickers..." :
                      "Search emojis..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 h-8 text-sm"
                  />
                </div>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="emojis">
                    <Smile className="w-4 h-4" />
                  </TabsTrigger>
                  {enableStickers && (
                    <TabsTrigger value="stickers">
                      <Sticker className="w-4 h-4" />
                    </TabsTrigger>
                  )}
                  {enableGifs && (
                    <TabsTrigger value="gifs">
                      <Image className="w-4 h-4" />
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>

              {/* Emoji Tab */}
              <TabsContent value="emojis" className="m-0">
                <ScrollArea className="h-64 p-2">
                  {Object.entries(emojisByCategory).map(([category, categoryEmojis]) => (
                    <div key={category} className="mb-4">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 capitalize">
                        {category}
                      </h3>
                      <div className="grid grid-cols-8 gap-1">
                        {categoryEmojis.map((item, index) => (
                          <Button
                            key={`${item.emoji}-${index}`}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={() => onEmojiSelect?.(item.emoji)}
                            title={item.name}
                          >
                            <span className="text-lg">{item.emoji}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {filteredEmojis.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      No emojis found
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              {/* Stickers Tab */}
              {enableStickers && (
                <TabsContent value="stickers" className="m-0">
                  <ScrollArea className="h-64 p-2">
                    <div className="grid grid-cols-4 gap-2">
                      {stickers
                        .filter(sticker => 
                          !searchQuery || 
                          sticker.name.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((sticker) => (
                          <Button
                            key={sticker.id}
                            variant="ghost"
                            className="h-16 w-16 flex-col gap-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={() => onStickerSelect?.(sticker)}
                          >
                            <span className="text-2xl">{sticker.emoji}</span>
                            <span className="text-xs text-gray-500">{sticker.name}</span>
                          </Button>
                        ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              )}

              {/* GIFs Tab */}
              {enableGifs && (
                <TabsContent value="gifs" className="m-0">
                  <ScrollArea className="h-64 p-2">
                    {isGifLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                        <span className="ml-2 text-sm text-gray-500">Searching...</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {gifs.map((gif) => (
                          <Button
                            key={gif.id}
                            variant="ghost"
                            className="h-24 w-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={() => onGifSelect?.(gif)}
                          >
                            <img
                              src={gif.preview || gif.url}
                              alt={gif.title}
                              className="w-full h-full object-cover rounded"
                              loading="lazy"
                            />
                          </Button>
                        ))}
                      </div>
                    )}
                    {!isGifLoading && gifs.length === 0 && searchQuery && (
                      <div className="text-center text-gray-500 py-8">
                        No GIFs found for "{searchQuery}"
                      </div>
                    )}
                    {!searchQuery && !isGifLoading && (
                      <div className="text-center text-gray-500 py-8">
                        Type to search for GIFs
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
              )}
            </Tabs>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

EmojiPicker.displayName = "EmojiPicker";

export { EmojiPicker };