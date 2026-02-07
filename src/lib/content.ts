/**
 * SKAI Content System
 *
 * Centralized text/copy management for the entire SKAI platform.
 * Designers can modify text content here without touching component code.
 *
 * Usage:
 *   import { content } from '@skai/ui';
 *   <h1>{content.landing.hero.title}</h1>
 *
 * Structure:
 *   - Organized by page/feature
 *   - All text is editable
 *   - Supports interpolation with {{variable}} syntax
 */

export const content = {
  /**
   * Global content used across the site
   */
  global: {
    brand: {
      name: "SKAI",
      tagline: "Trade Smarter, Not Harder",
      description:
        "AI-powered trading platform for the next generation of traders",
    },

    navigation: {
      home: "Home",
      trade: "Trade",
      portfolio: "Portfolio",
      earn: "Earn",
      play: "Play",
      ai: "AI Agent",
      aiShort: "AI",
      settings: "Settings",
      predict: "Predict",
      swap: "Swap",
      leaderboard: "Leaders",
      account: "Account",
      discover: "Discover",
      streaming: "Live",
      tradingGroups: "Trading Groups",
      governance: "Governance",
      learn: "Learn",
      launchpad: "Launchpad",
      dao: "DAO",
      docs: "Documentation",
    },

    actions: {
      connect: "Connect Wallet",
      disconnect: "Disconnect",
      swap: "Swap",
      buy: "Buy",
      sell: "Sell",
      confirm: "Confirm",
      cancel: "Cancel",
      continue: "Continue",
      back: "Back",
      close: "Close",
      save: "Save",
      copy: "Copy",
      copied: "Copied!",
      loading: "Loading...",
      submit: "Submit",
      retry: "Retry",
    },

    status: {
      success: "Success",
      error: "Error",
      warning: "Warning",
      info: "Info",
      pending: "Pending",
      processing: "Processing...",
      completed: "Completed",
      failed: "Failed",
    },

    errors: {
      generic: "Something went wrong. Please try again.",
      network: "Network error. Please check your connection.",
      walletNotConnected: "Please connect your wallet to continue.",
      insufficientBalance: "Insufficient balance",
      transactionFailed: "Transaction failed",
      invalidInput: "Invalid input",
    },
  },

  /**
   * Landing page content
   */
  landing: {
    hero: {
      title: "The Future of Trading",
      subtitle: "Trade smarter with AI-powered insights",
      cta: "Get Started",
      ctaSecondary: "Learn More",
    },

    features: {
      title: "Why Choose SKAI?",
      subtitle: "Everything you need to trade like a pro",
      items: [
        {
          title: "AI-Powered Analysis",
          description:
            "Get real-time market insights powered by advanced AI algorithms",
          icon: "brain",
        },
        {
          title: "Lightning Fast Swaps",
          description:
            "Execute trades instantly with the best rates across DEXs",
          icon: "zap",
        },
        {
          title: "Play & Earn",
          description:
            "Gamified trading experience with rewards and competitions",
          icon: "gamepad",
        },
        {
          title: "Portfolio Tracking",
          description: "Track your holdings and performance in real-time",
          icon: "chart",
        },
      ],
    },

    stats: {
      volume: "Total Volume",
      users: "Active Users",
      trades: "Total Trades",
      saved: "Saved in Fees",
    },

    cta: {
      title: "Ready to Start Trading?",
      description: "Join thousands of traders already using SKAI",
      button: "Launch App",
    },

    footer: {
      copyright: "© 2026 SKAI.trade. All rights reserved.",
      links: {
        terms: "Terms",
        privacy: "Privacy",
        termsOfService: "Terms of Service",
        privacyPolicy: "Privacy Policy",
        docs: "Documentation",
        support: "Support",
      },
    },

    /**
     * Waitlist / Onboarding flow content
     * Used by skai-landing pages: OnboardingPage, LandingWaitlist,
     * CompletionPage, DashboardPage, ExternalWallet, UsernamePage
     */
    waitlist: {
      /** Shared across OnboardingPage + LandingWaitlist hero */
      shared: {
        headline: {
          prefix: "Join the global ",
          emphasis: "AI-powered",
          suffix: " trading ecosystem",
        },
        subheading:
          "Discover the new world of perpetual trading, swaps, prediction markets, memes, launchpads, and a catalog of casino-style gaming.",
        cta: "Get early access",
        counterSuffix: "Traders are already on the list",
        defaultCount: "800",
      },

      /** OnboardingPage-specific */
      onboarding: {
        logoText: "Skai",
        logoDomain: ".trade",
      },

      /** CompletionPage */
      completion: {
        titleWithUsername: "@{{username}} is yours!",
        titleFallback: "You're in!",
        subtitle: "Welcome Skai Pioneer!",
        rewardAmount: "+500 SKAI Points",
        giftMessage: "We gifted you",
        giftHighlight: "",
        giftSuffix: "",
      },

      /** ExternalWallet page */
      externalWallet: {
        title: "Link external wallet",
        subtitle: "Connect your existing wallet to your Skai account.",
        skipLabel: "Skip for now",
        wallets: {
          metamask: "Metamask",
          coinbase: "Coinbase wallet",
          walletconnect: "WalletConnect",
          phantom: "Phantom",
        },
        errors: {
          walletAlreadyLinked:
            "🔒 This wallet is already linked to another account ({{username}}). Each wallet can only be linked to one SKAI account.",
          connectionCancelled:
            "Connection cancelled. Click a wallet to try again.",
        },
      },

      /** UsernamePage */
      username: {
        title: "Reserve your username",
        subtitle: 'Your profile URL will be "skai.trade/{{username}}"',
        subtitleDefault: 'Your profile URL will be "skai.trade/username"',
        inputPrefix: "skai.trade/",
        inputPlaceholder: "username",
        claimButton: "Claim @{{username}}",
        claimButtonDefault: "Claim @username",
        savingButton: "Saving...",
        availableMessage: "is available!",
        validation: {
          tooLong: "Username must be 20 characters or less",
          invalidChars:
            "Only letters, numbers, underscores, and hyphens allowed",
          notAvailable: "This username is not available",
          premiumReserved: "You can register this name soon with SKAI",
          alreadyTaken: "Username already taken",
          chooseValid: "Please choose a valid username",
          tooShort: "👤 Username must be at least 3 characters long.",
          tooLongEmoji: "👤 Username must be 20 characters or less.",
          invalidCharsEmoji:
            "👤 Username can only contain letters, numbers, underscores, and hyphens.",
        },
        errors: {
          missingInfo:
            "Missing required information. Please go back and complete the wallet connection.",
          emailRequired:
            "📧 Email is required for registration. Please use an email wallet or reconnect.",
          walletRegistered:
            "🔒 This wallet is already registered! You're already a Pioneer. Check your email for updates.",
          usernameTaken:
            "👤 This username is already taken. Please try a different one!",
          accountExists:
            "⚠️ Account already exists. Please use different credentials or contact support.",
          createFailed:
            "❌ Unable to create account. Please try again or contact support.",
          saveFailed:
            "❌ Unable to save account. Please try again.",
        },
      },

      /** DashboardPage */
      dashboard: {
        welcome: "Welcome, {{username}}!",
        welcomeFallback: "Welcome, ...!",
        checkEmail: "Check email for launch updates.",
        launchApp: "Launch app",
        comingSoon: "Coming soon",
        daysToLaunch: "Days to launch",

        badge: {
          title: "Pioneer badge",
          subtitle: "Early adopter status.",
          reward: "+500 SKAI Points",
          status: "Credited",
        },

        referral: {
          title: "Invite friends and earn rewards",
          subtitle: "Earn 100 SKAI Points for each friend that joins.",
          linkLabel: "Referral link",
          shareLabel: "Connect to share referral link",
          copyButton: "COPY",
          shareToX: "Share to X",
          shareToInstagram: "Share to Instagram",
          instagramCopied: "Link Copied! Paste on Instagram",
          joinDiscord: "Join Skai on Discord",
          shareText:
            'Trade. Predict. Play. 📊🎯🎰\n\nJoin the @SkaiTrade waitlist to claim 500 SKAI Points: https://skai.trade/ref/{{username}}',
        },

        imageFailed: "Image failed to load",
      },

      /** LandingWaitlist completion overlay */
      completionOverlay: {
        usernameConfirm: "@{{username}} is yours!",
        welcomeMessage: "Welcome to the SKAI Pioneer family 🚀",
        reward: "+500 SKAI Points",
      },

      /** LandingWaitlist modal titles */
      modal: {
        joinTitle: "Join SKAI Waitlist",
      },
    },
  },

  /**
   * Trading page content
   */
  trading: {
    swap: {
      title: "Swap",
      from: "From",
      to: "To",
      balance: "Balance",
      max: "MAX",
      half: "HALF",
      rate: "Rate",
      fee: "Fee",
      priceImpact: "Price Impact",
      minReceived: "Minimum Received",
      route: "Route",
      slippage: "Slippage Tolerance",
      deadline: "Transaction Deadline",
      button: "Swap",
      buttonLoading: "Swapping...",
      buttonApprove: "Approve {{token}}",
      successMessage: "Swap completed successfully!",
      errorMessage: "Swap failed. Please try again.",
    },

    limit: {
      title: "Limit Order",
      price: "Price",
      amount: "Amount",
      total: "Total",
      expiry: "Expires In",
      button: "Place Order",
    },

    orderBook: {
      title: "Order Book",
      price: "Price",
      size: "Size",
      total: "Total",
      bids: "Bids",
      asks: "Asks",
      spread: "Spread",
    },

    positions: {
      title: "Your Positions",
      noPositions: "No open positions",
      openPosition: "Open Position",
      closePosition: "Close Position",
      pnl: "P&L",
      entryPrice: "Entry Price",
      currentPrice: "Current Price",
      size: "Size",
      leverage: "Leverage",
    },

    history: {
      title: "Trade History",
      noHistory: "No trade history",
      date: "Date",
      pair: "Pair",
      type: "Type",
      price: "Price",
      amount: "Amount",
      status: "Status",
    },
  },

  /**
   * Portfolio page content
   */
  portfolio: {
    overview: {
      title: "Portfolio Overview",
      totalValue: "Total Value",
      dayChange: "24h Change",
      allTimeProfit: "All-Time Profit",
      holdingsCount: "Holdings",
    },

    holdings: {
      title: "Your Holdings",
      noHoldings: "No holdings yet",
      token: "Token",
      balance: "Balance",
      value: "Value",
      change: "24h Change",
      allocation: "Allocation",
    },

    activity: {
      title: "Recent Activity",
      noActivity: "No recent activity",
      viewAll: "View All",
    },
  },

  /**
   * Play/Games content
   */
  play: {
    title: "Play & Earn",
    subtitle: "Test your trading skills and win rewards",

    hilo: {
      title: "HiLo",
      description: "Predict if the next price will be higher or lower",
      higher: "Higher",
      lower: "Lower",
      currentPrice: "Current Price",
      yourPrediction: "Your Prediction",
      streak: "Win Streak",
      multiplier: "Multiplier",
    },

    prediction: {
      title: "Price Prediction",
      description: "Predict the price at a specific time",
      predictUp: "Going Up",
      predictDown: "Going Down",
      pool: "Prize Pool",
      participants: "Participants",
      endsIn: "Ends In",
    },

    leaderboard: {
      title: "Leaderboard",
      rank: "Rank",
      player: "Player",
      winRate: "Win Rate",
      totalWins: "Total Wins",
      earnings: "Earnings",
    },
  },

  /**
   * AI Agent content
   */
  ai: {
    title: "AI Trading Agent",
    subtitle: "Your intelligent trading assistant",

    chat: {
      placeholder: "Ask me anything about trading...",
      send: "Send",
      thinking: "Thinking...",
      suggestions: [
        "What's the best time to buy ETH?",
        "Analyze my portfolio performance",
        "What are the current market trends?",
        "Suggest a trading strategy",
      ],
    },

    signals: {
      title: "Trading Signals",
      buy: "Buy Signal",
      sell: "Sell Signal",
      hold: "Hold",
      confidence: "Confidence",
      reason: "Reasoning",
    },

    insights: {
      title: "Market Insights",
      sentiment: "Market Sentiment",
      bullish: "Bullish",
      bearish: "Bearish",
      neutral: "Neutral",
    },
  },

  /**
   * Settings content
   */
  settings: {
    title: "Settings",

    sections: {
      account: "Account",
      preferences: "Preferences",
      security: "Security",
      notifications: "Notifications",
    },

    account: {
      walletAddress: "Wallet Address",
      connectedWallet: "Connected Wallet",
      referralCode: "Referral Code",
    },

    preferences: {
      theme: "Theme",
      themeLight: "Light",
      themeDark: "Dark",
      themeSystem: "System",
      language: "Language",
      currency: "Display Currency",
      slippage: "Default Slippage",
    },

    notifications: {
      priceAlerts: "Price Alerts",
      tradeNotifications: "Trade Notifications",
      marketUpdates: "Market Updates",
      promotions: "Promotions",
    },
  },

  /**
   * Wallet/Connection content
   */
  wallet: {
    connect: {
      title: "Connect Wallet",
      subtitle: "Choose your wallet to continue",
      metamask: "MetaMask",
      walletconnect: "WalletConnect",
      coinbase: "Coinbase Wallet",
      email: "Email Wallet",
    },

    connected: {
      title: "Wallet Connected",
      viewOnExplorer: "View on Explorer",
      copyAddress: "Copy Address",
      disconnect: "Disconnect",
    },
  },

  /**
   * App content (main trading app: app.skai.trade)
   */
  app: {
    hero: {
      titleLine1: "Trade Smarter.",
      titleLine2: "Win Bigger.",
      subtitle:
        "AI-powered perpetual trading, prediction markets, and provably fair gaming.",
      subtitleAccent: "All in one decentralized ecosystem.",
    },

    features: {
      sectionTitle: "One Platform.",
      sectionTitleAccent: "Infinite Possibilities.",
      sectionSubtitle:
        "Three powerful modules working together, powered by cutting-edge AI",
      trade: {
        title: "Trade",
        description:
          "Perpetual contracts with up to 100x leverage. AI signals guide every move.",
        badges: ["100x Leverage", "AI Signals"],
      },
      predict: {
        title: "Predict",
        description:
          "Prediction markets for crypto, sports, politics, and real-world events.",
        badges: ["Live Markets", "Fair Odds"],
      },
      play: {
        title: "Play",
        description:
          "Provably fair casino games. Verify every roll on-chain. 1% house edge.",
        badges: ["Provably Fair", "Instant Payouts"],
      },
    },

    stats: {
      totalVolume: "Total Volume",
      predictionsMade: "Predictions Made",
      gamesPlayed: "Games Played",
      activeUsers: "Active Users",
    },

    init: {
      loading: "INITIALIZING SYSTEM...",
      progress: "LOADING MODULES: [\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588] 100%",
    },
  },
} as const;

/**
 * Helper function to interpolate variables in content strings
 * Usage: interpolate("Hello {{name}}", { name: "World" }) => "Hello World"
 */
export function interpolate(
  template: string,
  variables: Record<string, string | number>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    String(variables[key] ?? `{{${key}}}`),
  );
}

/**
 * Type-safe content accessor
 */
export type Content = typeof content;
export type ContentPath = string; // e.g., "landing.hero.title"

/**
 * Get content by path
 * Usage: getContent("landing.hero.title") => "The Future of Trading"
 */
export function getContent(path: string): string {
  const keys = path.split(".");
  let current: unknown = content;

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path; // Return path if not found
    }
  }

  return typeof current === "string" ? current : path;
}

export default content;
