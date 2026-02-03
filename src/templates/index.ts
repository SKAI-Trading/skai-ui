// =============================================================================
// PAGE TEMPLATES
// =============================================================================
// Templates are pure presentational components that receive all data via props.
// They NEVER fetch data, make API calls, or handle routing directly.
// Business logic stays in the page components (SKAI-Trading).
// =============================================================================

// Base Types for all templates
export * from "./base-types";

// Swap Page Template
export { SwapPageTemplate } from "./swap-page";
export type { SwapPageTemplateProps } from "./swap-page";

// Profile Page Template
export {
  ProfilePageTemplate,
  ProfileNotFound,
  ProfilePageSkeleton,
} from "./profile-page";
export type { ProfilePageTemplateProps } from "./profile-page";

// Leaderboard Page Template
export { LeaderboardPageTemplate, LeaderboardPageSkeleton } from "./leaderboard-page";
export type {
  LeaderboardPageTemplateProps,
  LeaderboardToken,
  LeaderboardStats,
  SortMetric,
  TimeFrame,
} from "./leaderboard-page";

// Discover Page Template
export { DiscoverPageTemplate, DiscoverPageSkeleton } from "./discover-page";
export type {
  DiscoverPageTemplateProps,
  DiscoverCreator,
  DiscoverStats,
  DiscoverSortOption,
} from "./discover-page";

// Not Found (404) Page Template
export { NotFoundPageTemplate } from "./not-found-page";
export type { NotFoundPageTemplateProps } from "./not-found-page";

// Account Page Template
export { AccountPageTemplate, AccountPageSkeleton } from "./account-page";
export type { AccountPageTemplateProps, AccountUser, AccountTab } from "./account-page";

// Portfolio Page Template
export { PortfolioPageTemplate, PortfolioPageSkeleton } from "./portfolio-page";
export type {
  PortfolioPageTemplateProps,
  PortfolioStats,
  PortfolioUser,
  PortfolioTab,
} from "./portfolio-page";

// Crypto Details Page Template
export {
  CryptoDetailsPageTemplate,
  CryptoDetailsPageSkeleton,
} from "./crypto-details-page";
export type {
  CryptoDetailsPageTemplateProps,
  CryptoToken,
} from "./crypto-details-page";

// Trading Groups Page Template
export {
  TradingGroupsPageTemplate,
  TradingGroupsPageSkeleton,
} from "./trading-groups-page";
export type {
  TradingGroupsPageTemplateProps,
  TradingGroup,
  TradingGroupOwner,
  TradingGroupsTab,
} from "./trading-groups-page";

// Landing Page Template
export { LandingPageTemplate } from "./landing-page";
export type { LandingPageTemplateProps } from "./landing-page";

// Bridge Page Template
export { BridgePageTemplate, BridgePageSkeleton } from "./bridge-page";
export type {
  BridgePageTemplateProps,
  BridgeChain,
  BridgeToken,
  BridgeStatus,
} from "./bridge-page";

// Help Center Page Template
export {
  HelpCenterPageTemplate,
  HelpCenterPageSkeleton,
} from "./help-center-page";
export type {
  HelpCenterPageTemplateProps,
  HelpCategory,
  HelpArticle,
  HelpCenterView,
} from "./help-center-page";

// Notifications Page Template
export { NotificationsPageTemplate } from "./notifications-page";
export type {
  NotificationsPageProps,
  NotificationItem,
  NotificationType,
  AnnouncementType,
} from "./notifications-page";

// Referral Page Template
export { ReferralPageTemplate } from "./referral-page";
export type {
  ReferralPageProps,
  CommissionTier,
  ReferralRecord,
  ReferralStats,
  SharePlatform,
} from "./referral-page";

// Trade Page Template
export { TradePageTemplate } from "./trade-page";
export type {
  TradePageProps,
  TradeSide,
  OrderType,
  MarketType,
  MarketInfo,
  OpenInterestData,
  KeyboardShortcut,
} from "./trade-page";

// Earn Page Template
export { EarnPageTemplate } from "./earn-page";
export type {
  EarnPageProps,
  FaucetStats,
  LotteryStats,
  EarnTab,
} from "./earn-page";

// Messages Page Template
export { MessagesPageTemplate } from "./messages-page";
export type {
  MessagesPageProps,
  ConversationType,
  MessageStatus,
  InboxFilter,
  ConversationParticipant,
  Conversation,
  MessageAttachment,
  MessageReaction,
  Message,
} from "./messages-page";

// Admin Page Template
export { AdminPageTemplate } from "./admin-page";
export type {
  AdminPageProps,
  AdminTab,
  AdminTabCategory,
  AdminPermissions,
  AdminSystemStatus,
} from "./admin-page";

// AI Agent Page Template
export { AIAgentPageTemplate } from "./ai-agent-page";
export type {
  AIAgentPageProps,
  AIAgentTabType,
  AIMessage,
  AISignal,
  AIAgentInfo,
  IntelligenceMetric,
  AgentStatus,
  SignalType,
  SignalStrength,
} from "./ai-agent-page";

// Exchange Page Template
export { ExchangePageTemplate } from "./exchange-page";
export type {
  ExchangePageProps,
  ExchangeMode,
  ExchangeChain,
  ExchangeToken,
  ExchangeQuote,
  ExchangeStatus,
} from "./exchange-page";

// Streaming Page Template
export { StreamingPageTemplate } from "./streaming-page";
export type {
  StreamingPageProps,
  StreamStatus,
  StreamerInfo,
  LiveStream,
  StreamChatMessage,
  StreamingView,
} from "./streaming-page";

// Copy Trading Page Template
export { CopyTradingPageTemplate } from "./copy-trading-page";
export type {
  CopyTradingPageProps,
  LeaderboardPeriod,
  LeaderboardSortBy,
  TraderStats,
  LeaderboardTrader,
  FollowRelation,
  CopiedTrade,
  CopyTradingTab,
} from "./copy-trading-page";

// Governance Page Template
export { GovernancePageTemplate } from "./governance-page";
export type {
  GovernancePageProps,
  ProposalStatus,
  VoteChoice,
  Proposal,
  GovernanceStats,
  DelegationInfo,
  GovernanceTab,
} from "./governance-page";

// Analytics Dashboard Page Template
export { AnalyticsDashboardPageTemplate } from "./analytics-dashboard-page";
export type {
  AnalyticsDashboardPageProps,
  TimeRange,
  TradeType,
  TradeStatus,
  PortfolioValue,
  PerformanceMetric,
  RiskMetrics,
  TradeRecord,
  AssetAllocation,
  AnalyticsTab,
} from "./analytics-dashboard-page";

// Lending Page Template
export { LendingPageTemplate } from "./lending-page";
export type {
  LendingPageProps,
  LendingProtocol,
  LendingToken,
  LendingMarket,
  UserPosition as LendingUserPosition,
  LendingStats,
  LendingTab,
  LendingAction,
} from "./lending-page";

// Predict Page Template
export { PredictPageTemplate } from "./predict-page";
export type {
  PredictPageProps,
  MarketStatus,
  MarketCategory,
  OutcomeType,
  MarketOutcome,
  PredictionMarket,
  UserPosition as PredictUserPosition,
  PredictStats,
  PredictTab,
  MarketSort,
} from "./predict-page";
