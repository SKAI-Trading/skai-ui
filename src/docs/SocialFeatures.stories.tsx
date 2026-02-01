/**
 * Social Features Documentation
 *
 * UI patterns for social functionality including user profiles,
 * chat interfaces, activity feeds, and community features.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/avatar";
import { Input } from "../components/input";
import {
  MessageSquare,
  Send,
  Heart,
  Share2,
  MoreHorizontal,
  Bell,
  Users,
  TrendingUp,
  TrendingDown,
  Repeat2,
  Bookmark,
  Verified,
  Trophy,
  Flame,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

const meta: Meta = {
  title: "Documentation/Social Features",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# 👥 Social Features

UI patterns for SKAI's social trading and community features.

## Social Components

- **User Profiles** - Trading stats, achievements, follow system
- **Activity Feed** - Real-time trade sharing
- **Chat** - Community messaging
- **Leaderboards** - Competition and rankings
        `,
      },
    },
  },
};

export default meta;

// ============================================================================
// USER PROFILE CARD
// ============================================================================

export const UserProfileCard: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">User Profile Cards</h2>
        <p className="text-muted-foreground mb-6">
          Profile displays with trading stats, achievements, and social
          connections.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Profile Card */}
        <Card className="overflow-hidden">
          {/* Banner */}
          <div className="h-24 bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-cyan-500/20" />

          <CardContent className="relative pt-0">
            {/* Avatar */}
            <Avatar className="absolute -top-12 left-6 h-24 w-24 border-4 border-background">
              <AvatarImage src="https://i.pravatar.cc/150?u=trader1" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>

            <div className="pt-16 space-y-4">
              {/* Name & Username */}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold">John Doe</h3>
                  <Verified className="h-5 w-5 text-cyan-400" />
                </div>
                <p className="text-sm text-muted-foreground">@johndoe</p>
              </div>

              {/* Bio */}
              <p className="text-sm">
                Full-time crypto trader. Focus on DeFi and L2s. Diamond hands
                since 2017 💎
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 py-4 border-y border-white/10">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-400">+234%</div>
                  <div className="text-xs text-muted-foreground">PnL (30d)</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">1.2K</div>
                  <div className="text-xs text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">89</div>
                  <div className="text-xs text-muted-foreground">Following</div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-amber-500/20 text-amber-400">
                  <Trophy className="h-3 w-3 mr-1" />
                  Top 10
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-400">
                  <Flame className="h-3 w-3 mr-1" />
                  12 Streak
                </Badge>
                <Badge variant="outline">Since 2021</Badge>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button className="flex-1">Follow</Button>
                <Button variant="outline" className="flex-1">
                  Copy Trades
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compact Profile */}
        <div className="space-y-4">
          <h4 className="font-semibold text-muted-foreground">
            Compact Variants
          </h4>

          {/* List Item */}
          {[
            {
              name: "CryptoQueen",
              pnl: "+156%",
              followers: "2.3K",
              verified: true,
            },
            {
              name: "DeFi_Master",
              pnl: "+89%",
              followers: "1.8K",
              verified: false,
            },
            {
              name: "WhaleHunter",
              pnl: "+234%",
              followers: "5.1K",
              verified: true,
            },
          ].map((user, i) => (
            <Card key={i}>
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage
                      src={`https://i.pravatar.cc/150?u=${user.name}`}
                    />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{user.name}</span>
                      {user.verified && (
                        <Verified className="h-4 w-4 text-cyan-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="text-green-400">{user.pnl}</span>
                      <span>{user.followers} followers</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Follow
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  ),
};

// ============================================================================
// ACTIVITY FEED
// ============================================================================

const feedItems = [
  {
    type: "trade",
    user: "CryptoKing",
    avatar: "https://i.pravatar.cc/150?u=king",
    verified: true,
    action: "swapped",
    from: "1.5 ETH",
    to: "4,523 USDC",
    time: "2m ago",
    profit: "+$234",
    likes: 23,
    comments: 5,
  },
  {
    type: "prediction",
    user: "TradeMaster",
    avatar: "https://i.pravatar.cc/150?u=master",
    verified: false,
    action: "predicted YES",
    market: "BTC > $100k EOY",
    amount: "$500",
    time: "5m ago",
    likes: 45,
    comments: 12,
  },
  {
    type: "win",
    user: "LuckyTrader",
    avatar: "https://i.pravatar.cc/150?u=lucky",
    verified: true,
    action: "won HiLo",
    amount: "$1,234",
    multiplier: "5.2x",
    time: "12m ago",
    likes: 89,
    comments: 24,
  },
];

export const ActivityFeed: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Activity Feed</h2>
        <p className="text-muted-foreground mb-6">
          Real-time feed of trades, predictions, and community activity.
        </p>
      </div>

      <div className="max-w-2xl space-y-4">
        {feedItems.map((item, i) => (
          <Card key={i} className="hover:border-cyan-500/30 transition-colors">
            <CardContent className="py-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={item.avatar} />
                    <AvatarFallback>{item.user[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{item.user}</span>
                      {item.verified && (
                        <Verified className="h-4 w-4 text-cyan-400" />
                      )}
                      <span className="text-muted-foreground">·</span>
                      <span className="text-sm text-muted-foreground">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.action}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="mb-4 p-4 rounded-lg bg-black/20">
                {item.type === "trade" && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-red-400" />
                      <span className="font-mono">{item.from}</span>
                    </div>
                    <span className="text-muted-foreground">→</span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="font-mono">{item.to}</span>
                    </div>
                    <Badge className="ml-auto bg-green-500/20 text-green-400">
                      {item.profit}
                    </Badge>
                  </div>
                )}
                {item.type === "prediction" && (
                  <div>
                    <p className="font-semibold mb-2">{item.market}</p>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-cyan-500/20 text-cyan-400">
                        YES
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {item.amount}
                      </span>
                    </div>
                  </div>
                )}
                {item.type === "win" && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-amber-400" />
                      <span className="font-bold text-green-400">
                        {item.amount}
                      </span>
                    </div>
                    <Badge className="bg-amber-500/20 text-amber-400">
                      {item.multiplier}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-red-400 transition-colors">
                  <Heart className="h-4 w-4" />
                  {item.likes}
                </button>
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-cyan-400 transition-colors">
                  <MessageSquare className="h-4 w-4" />
                  {item.comments}
                </button>
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-green-400 transition-colors">
                  <Repeat2 className="h-4 w-4" />
                  Copy
                </button>
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-amber-400 transition-colors ml-auto">
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  ),
};

// ============================================================================
// CHAT INTERFACE
// ============================================================================

const chatMessages = [
  {
    id: 1,
    user: "Alice",
    message: "Anyone else bullish on ETH?",
    time: "2:34 PM",
    isOwn: false,
  },
  {
    id: 2,
    user: "You",
    message: "Yeah, I'm loading up below $3k",
    time: "2:35 PM",
    isOwn: true,
  },
  {
    id: 3,
    user: "Bob",
    message: "Just made a nice swap on the dip 📈",
    time: "2:36 PM",
    isOwn: false,
  },
  {
    id: 4,
    user: "Alice",
    message: "What's your price target?",
    time: "2:37 PM",
    isOwn: false,
  },
];

export const ChatInterface: StoryObj = {
  render: () => {
    const [message, setMessage] = useState("");

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Chat Interface</h2>
          <p className="text-muted-foreground mb-6">
            Community chat for real-time discussions and trade sharing.
          </p>
        </div>

        <div className="max-w-2xl">
          <Card className="h-[500px] flex flex-col">
            {/* Chat Header */}
            <CardHeader className="border-b border-white/10 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Trading Lounge</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-400" />
                      234 online
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Users className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Bell className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto py-4 space-y-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] ${msg.isOwn ? "order-2" : ""}`}>
                    {!msg.isOwn && (
                      <span className="text-xs text-cyan-400 ml-2 mb-1 block">
                        {msg.user}
                      </span>
                    )}
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        msg.isOwn
                          ? "bg-cyan-500/20 text-cyan-50 rounded-br-md"
                          : "bg-white/10 rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2 mt-1 block">
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  },
};

// ============================================================================
// NOTIFICATION PATTERNS
// ============================================================================

const notifications = [
  {
    type: "follow",
    icon: Users,
    color: "cyan",
    title: "New Follower",
    message: "CryptoKing started following you",
    time: "2m ago",
    unread: true,
  },
  {
    type: "trade_copy",
    icon: Repeat2,
    color: "green",
    title: "Trade Copied",
    message: "Your ETH swap was copied by 12 traders",
    time: "15m ago",
    unread: true,
  },
  {
    type: "win",
    icon: Trophy,
    color: "amber",
    title: "HiLo Win!",
    message: "You won $234 with a 5x multiplier",
    time: "1h ago",
    unread: false,
  },
  {
    type: "mention",
    icon: MessageSquare,
    color: "purple",
    title: "Mentioned",
    message: "@TradeMaster mentioned you in a comment",
    time: "2h ago",
    unread: false,
  },
];

export const NotificationPatterns: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Notification Patterns</h2>
        <p className="text-muted-foreground mb-6">
          Notification list items, badges, and alert styles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notification List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <Badge className="bg-cyan-500/20 text-cyan-400">2 new</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {notifications.map((notif, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                  notif.unread ? "bg-cyan-500/5" : "hover:bg-white/5"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full bg-${notif.color}-500/20 flex items-center justify-center flex-shrink-0`}
                >
                  <notif.icon className={`h-5 w-5 text-${notif.color}-400`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{notif.title}</span>
                    {notif.unread && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {notif.message}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {notif.time}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notification Bell Badge */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bell Badge States</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                {/* No notifications */}
                <div className="text-center">
                  <Button variant="ghost" size="lg" className="relative">
                    <Bell className="h-6 w-6" />
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">None</p>
                </div>

                {/* With count */}
                <div className="text-center">
                  <Button variant="ghost" size="lg" className="relative">
                    <Bell className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyan-500 text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">Count</p>
                </div>

                {/* Many */}
                <div className="text-center">
                  <Button variant="ghost" size="lg" className="relative">
                    <Bell className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 w-6 h-5 rounded-full bg-red-500 text-xs font-bold flex items-center justify-center">
                      99+
                    </span>
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">Many</p>
                </div>

                {/* Dot only */}
                <div className="text-center">
                  <Button variant="ghost" size="lg" className="relative">
                    <Bell className="h-6 w-6" />
                    <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">Dot</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Toast Notification */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Toast Notification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-black/40 border border-white/10 flex items-start gap-3 max-w-sm">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Trophy className="h-5 w-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">Trade Executed!</h4>
                  <p className="text-sm text-muted-foreground">
                    Swapped 1.5 ETH for 4,523 USDC
                  </p>
                </div>
                <button className="text-muted-foreground hover:text-white">
                  ×
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  ),
};

// ============================================================================
// FOLLOW / UNFOLLOW
// ============================================================================

export const FollowSystem: StoryObj = {
  render: () => {
    const [following, setFollowing] = useState(false);

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Follow System</h2>
          <p className="text-muted-foreground mb-6">
            Follow button states and follower/following lists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Button States */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Follow Button States</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
                <span>Default</span>
                <Button size="sm">Follow</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
                <span>Following</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-cyan-500/50"
                >
                  <span className="text-cyan-400">Following</span>
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
                <span>Hover (unfollow)</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-500/50 text-red-400"
                >
                  Unfollow
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
                <span>Loading</span>
                <Button size="sm" disabled>
                  <span className="animate-pulse">...</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Interactive Demo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-black/20">
                <Avatar className="h-14 w-14">
                  <AvatarImage src="https://i.pravatar.cc/150?u=demo" />
                  <AvatarFallback>DM</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">DemoTrader</span>
                    <Verified className="h-4 w-4 text-cyan-400" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {following
                      ? "You're following this trader"
                      : "Follow to see their trades"}
                  </p>
                </div>
                <Button
                  onClick={() => setFollowing(!following)}
                  variant={following ? "outline" : "default"}
                  className={following ? "border-cyan-500/50" : ""}
                >
                  {following ? "Following" : "Follow"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Copy Trading */}
        <Card>
          <CardHeader>
            <CardTitle>Copy Trading Toggle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Repeat2 className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-semibold">Copy Trading</h4>
                  <p className="text-sm text-muted-foreground">
                    Automatically copy this trader's swaps
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right text-sm">
                  <div className="text-green-400 font-semibold">+234%</div>
                  <div className="text-muted-foreground">30d PnL</div>
                </div>
                <Button className="bg-gradient-to-r from-cyan-500 to-teal-500 text-black">
                  Enable Copy
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
};

// ============================================================================
// PRIVACY CONTROLS
// ============================================================================

export const PrivacyControls: StoryObj = {
  render: () => {
    const [showBalance, setShowBalance] = useState(true);
    const [publicProfile, setPublicProfile] = useState(true);

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Privacy Controls</h2>
          <p className="text-muted-foreground mb-6">
            Settings for controlling profile visibility and data sharing.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Balance Visibility */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-black/20">
              <div className="flex items-center gap-4">
                {showBalance ? (
                  <Eye className="h-5 w-5 text-cyan-400" />
                ) : (
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <h4 className="font-semibold">Show Balance</h4>
                  <p className="text-sm text-muted-foreground">
                    Display your portfolio balance
                  </p>
                </div>
              </div>
              <Button
                variant={showBalance ? "default" : "outline"}
                onClick={() => setShowBalance(!showBalance)}
                className={showBalance ? "bg-cyan-500 text-black" : ""}
              >
                {showBalance ? "Visible" : "Hidden"}
              </Button>
            </div>

            {/* Profile Visibility */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-black/20">
              <div className="flex items-center gap-4">
                <Users
                  className={`h-5 w-5 ${publicProfile ? "text-green-400" : "text-muted-foreground"}`}
                />
                <div>
                  <h4 className="font-semibold">Public Profile</h4>
                  <p className="text-sm text-muted-foreground">
                    Allow others to view your trades
                  </p>
                </div>
              </div>
              <Button
                variant={publicProfile ? "default" : "outline"}
                onClick={() => setPublicProfile(!publicProfile)}
                className={publicProfile ? "bg-green-500 text-black" : ""}
              >
                {publicProfile ? "Public" : "Private"}
              </Button>
            </div>

            {/* Balance Preview */}
            <div className="p-4 rounded-lg bg-black/30 border border-white/10">
              <p className="text-sm text-muted-foreground mb-2">
                Balance Preview:
              </p>
              <div className="text-3xl font-bold font-mono">
                {showBalance ? "$12,345.67" : "••••••••"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
};
