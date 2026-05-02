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
      messages: "Messages",
      referral: "Referrals",
      copyTrading: "Copy Trading",
      bridge: "Bridge",
      lending: "Lending",
      help: "Help",
      support: "Support",
      social: "Social",
      challenges: "Challenges",
      comingSoon: "Coming Soon",
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
      tryAgain: "Try Again",
      refresh: "Refresh",
      share: "Share",
      edit: "Edit",
      delete: "Delete",
      create: "Create",
      search: "Search",
      filter: "Filter",
      sortBy: "Sort By",
      viewAll: "View All",
      seeMore: "See More",
      showMore: "Show More",
      showLess: "Show Less",
      enable: "Enable",
      disable: "Disable",
      deposit: "Deposit",
      withdraw: "Withdraw",
      transfer: "Transfer",
      claim: "Claim",
      approve: "Approve",
      signIn: "Sign in",
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
      unauthorized: "You do not have permission to perform this action.",
      notFound: "The requested resource was not found.",
      timeout: "Request timed out. Please try again.",
      rateLimited: "Too many requests. Please wait a moment.",
      walletProviderNotFound: "No wallet provider found",
      sessionExpired: "Your session has expired. Please reconnect.",
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
        subtitle: "Welcome Skai Early Adopter!",
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
            "🔒 This wallet is already registered! You're already a member. Check your email for updates.",
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
          title: "Badge",
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
          shareToX: "Share",
          shareToInstagram: "Share to Instagram",
          instagramCopied: "Link Copied! Paste on Instagram",
          joinDiscord: "Join Skai Community",
          shareText:
            'Trade. Predict. Play. 📊🎯🎰\n\nJoin the @SkaiTrade waitlist to claim 500 SKAI Points: https://skai.trade/ref/{{username}}',
        },

        imageFailed: "Image failed to load",
      },

      /** LandingWaitlist completion overlay */
      completionOverlay: {
        usernameConfirm: "@{{username}} is yours!",
        welcomeMessage: "Welcome to the SKAI family 🚀",
        reward: "+500 SKAI Points",
      },

      /** LandingWaitlist modal titles */
      modal: {
        joinTitle: "Join SKAI Waitlist",
      },
    },
  },

  /**
   * Error boundary and app-level error content
   */
  errors: {
    /** ErrorBoundary component - wallet/SES conflict */
    walletConflict: {
      title: "Wallet Extension Conflict Detected",
      description:
        "Your browser has a wallet extension (like MetaMask Flask or Snaps) that uses security features incompatible with this app. Please try one of the following:",
      steps: {
        disableFlask: "Disable MetaMask Flask and use regular MetaMask",
        incognito: "Open in an Incognito/Private window",
        differentBrowser: "Use a different browser without the extension",
      },
    },

    /** ErrorBoundary - circular dependency / loading error */
    loadingError: {
      title: "Loading Error",
      description:
        "The app encountered a loading error. This is usually temporary. Please try refreshing the page. If the problem persists, try clearing your browser cache.",
      steps: {
        hardRefresh:
          "Press Ctrl+Shift+R (or Cmd+Shift+R on Mac) to hard refresh",
        clearCache: "Clear your browser cache and try again",
        incognito: "Try an Incognito/Private window",
      },
    },

    /** ErrorBoundary - chunk load / update available */
    updateAvailable: {
      title: "Update Available",
      description:
        "A new version of the app is available. Please refresh to load the latest version. This happens when the app was updated while you had a tab open.",
      steps: {
        refresh: "Click Refresh Page below to load the latest version",
        hardRefresh:
          "If the issue persists, press Ctrl+Shift+R (or Cmd+Shift+R on Mac)",
      },
    },

    /** ErrorBoundary - generic fallback */
    generic: {
      title: "Something went wrong",
      description:
        "We encountered an unexpected error. Please try refreshing the page.",
      technicalDetails: "Technical details",
    },

    /** ErrorBoundary action buttons */
    actions: {
      refreshPage: "Refresh Page",
      goHome: "Go to Home",
      tryAgain: "Try Again",
    },

    /** main.tsx bootstrap failure */
    bootstrap: {
      title: "App Failed to Load",
      description:
        "A browser extension (likely MetaMask) is interfering with this app.",
      errorPrefix: "Error: {{message}}",
      solutionsHeading: "Try one of these solutions:",
      steps: {
        disableMetaMask: "Disable MetaMask temporarily and refresh",
        useChrome: "Use Chrome or a Chromium-based browser",
        incognito: "Open in a private/incognito window",
      },
    },
  },

  /**
   * Legal disclaimers and compliance content
   */
  legal: {
    /** RiskDisclaimer component */
    risk: {
      title: "High Risk Warning",
      compactDescription:
        "Trading cryptocurrencies involves substantial risk of loss. You may lose all or more than your initial investment.",
      compactTermsLink: "Read our Terms of Service for full risk disclosure.",
      fullDescription:
        "Trading cryptocurrencies and digital assets involves substantial risk of loss and is not suitable for every investor.",
      bullets: {
        totalLoss: "You may lose all funds deposited or traded",
        volatility:
          "Cryptocurrency prices are highly volatile and unpredictable",
        noGuarantees:
          "Past performance does not guarantee future results",
        leverageRisk:
          "Leveraged trading amplifies both gains and losses",
        smartContractRisk:
          "Code vulnerabilities may result in loss of funds",
      },
      bulletLabels: {
        totalLoss: "Total Loss Risk:",
        volatility: "Volatility:",
        noGuarantees: "No Guarantees:",
        leverageRisk: "Leverage Risk:",
        smartContractRisk: "Smart Contract Risk:",
      },
      neverInvest:
        "Never invest more than you can afford to lose. This is not financial advice.",
      termsAgreement: "By using this platform, you agree to our",
      termsOfService: "Terms of Service",
      and: "and",
      privacyPolicy: "Privacy Policy",
    },

    /** LegalReviewBanner component */
    review: {
      noticeLabel: "Legal & Compliance Notice:",
      defaultMessage:
        "This feature is pending legal and compliance review. Use at your own risk. This platform does not provide financial, legal, or investment advice.",
      compactMessage: "Feature pending legal review",
      bannerTitle: "Feature Pending Legal & Compliance Review",
      bannerDescription:
        "This feature is currently under legal and regulatory compliance review. Availability may vary by jurisdiction. Please ensure compliance with your local laws before use.",
    },

    /** NotFinancialAdviceDisclaimer component */
    notFinancialAdvice: {
      label: "Disclaimer:",
      description:
        "Nothing on this platform constitutes financial, investment, legal, or tax advice. All information is provided for educational purposes only. You are solely responsible for your own financial decisions. Always conduct your own research and consult with qualified professionals before making any investment decisions.",
    },
  },

  /**
   * Footer content
   */
  footer: {
    terms: "Terms",
    privacy: "Privacy",
    copyright: "\u00A9 {{year}} Skai.trade",
  },

  /**
   * Landing page waitlist form (app.skai.trade/landing)
   */
  landingForm: {
    emailPlaceholder: "Insert Email...",
    submitButton: "Enter",
    submittingButton: "Entering...",
    validation: {
      invalidEmail: "Invalid Email",
    },
    success: {
      title: "Welcome!",
      description:
        "You're now on the waitlist. Enjoy exploring the platform!",
    },
    duplicate: {
      title: "Already Registered",
      description:
        "This email is already on our waitlist. Welcome back!",
    },
    error: {
      title: "Error",
      fallback: "Something went wrong. Please try again.",
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
      loading: "Preparing your dashboard",
      progress: "Connecting to markets...",
    },
  },

  /**
   * Perpetual trading (SKAI Perp DEX) content
   * Used by: Trade page, PerpTradePanel, PositionsTable, TPSLChartOverlay,
   * OpenInterestBar, LiquidationWarning, FundingRateDisplay, etc.
   */
  perp: {
    badge: "SKAI PERP DEX",
    subtitle: "Up to 500x leverage \u2022 Pyth oracle prices \u2022 SKAI fee discounts",
    shortcuts: "Shortcuts",
    keyboardShortcuts: "Keyboard Shortcuts",

    side: {
      long: "Long",
      short: "Short",
    },

    orderType: {
      market: "Market",
      limit: "Limit",
    },

    labels: {
      positionSize: "Position Size",
      leverage: "Leverage",
      takeProfit: "Take Profit",
      stopLoss: "Stop Loss",
      entryPrice: "Entry Price",
      markPrice: "Mark Price",
      liquidationPrice: "Liquidation Price",
      margin: "Margin",
      collateral: "Collateral",
      openInterest: "Open Interest",
      fundingRate: "Funding Rate",
      priceImpact: "Price Impact",
      estimatedPnl: "Est. P&L",
      tradingFee: "Trading Fee",
      maxLeverage: "Max Leverage",
      availableBalance: "Available Balance",
      orderValue: "Order Value",
    },

    actions: {
      openLong: "Open Long",
      openShort: "Open Short",
      closeLong: "Close Long",
      closeShort: "Close Short",
      closePosition: "Close Position",
      cancelOrder: "Cancel Order",
      cancelAll: "Cancel All",
      closeAll: "Close All Positions",
      adjustLeverage: "Adjust Leverage",
      addMargin: "Add Margin",
      editTpsl: "Edit TP/SL",
      placeOrder: "Place {{side}} {{type}} Order",
    },

    warnings: {
      highLeverage: "High leverage increases liquidation risk",
      priceImpact: "Price impact exceeds {{threshold}}%",
      liquidationRisk: "Position is at risk of liquidation",
      insufficientMargin: "Insufficient margin for this position",
    },

    toast: {
      orderPlaced: "{{side}} {{symbol}} order placed",
      orderCancelled: "Order cancelled",
      positionClosed: "Position closed",
      positionOpened: "{{side}} {{symbol}} position opened",
      leverageUpdated: "Leverage updated to {{leverage}}x",
    },
  },

  /**
   * Prediction markets content
   * Used by: Predict page, PredictionCardNew, BetModal, CreateMarketModal,
   * MyPredictions, MarketDetail, etc.
   */
  predict: {
    title: "Markets",
    searchPlaceholder: "Search markets...",
    createMarket: "Create (100 SKAI)",
    adminCreate: "Admin Create",
    hideAdmin: "Hide Admin",
    admin: "Admin",

    categories: {
      all: "All",
      active: "Active",
      endingSoon: "Ending Soon",
      resolved: "Resolved",
      crypto: "Crypto",
      finance: "Finance",
      politics: "Politics",
      news: "News",
      sports: "Sports",
      popCulture: "Pop Culture",
      entertainment: "Entertainment",
      technology: "Technology",
      community: "Community",
      other: "Other",
    },

    bet: {
      yes: "Yes",
      no: "No",
      amount: "Amount",
      shares: "Shares",
      leverage: "Leverage",
      potentialPayout: "Potential Payout",
      fee: "Fee",
      odds: "Odds",
      placeBet: "Place Bet",
      invalidAmount: "Invalid Bet Amount",
    },

    emptyStates: {
      noMarkets: "Markets Coming Soon",
      noMarketsDescription:
        "Prediction markets are launching soon. Be the first to create a market.",
      createFirstMarket: "Create First Market (100 SKAI)",
      noResults: "No markets found",
      clearSearch: "Clear search",
      noResultsDescription: "Try adjusting your search or filters",
    },

    toast: {
      predictionPlaced: "Prediction Placed!",
      marketCreated: "Market Created!",
      marketCreatedDescription: "Your market is now live. You are the oracle.",
    },

    resultsCount: "{{count}} market{{plural}}",

    myPredictions: {
      title: "My Predictions",
      noPredictions: "No predictions yet",
      noPredictionsDescription:
        "Place your first prediction on any market above",
    },
  },

  /**
   * Account page content
   * Used by: Account page, UserSummaryCard, ProfileSetupForm,
   * UserAnalyticsDashboard, ActivityTab, SettingsTab
   */
  account: {
    tabs: {
      profile: "Profile",
      analytics: "Analytics",
      activity: "Activity",
      settings: "Settings",
    },

    loading: {
      profile: "Loading your profile...",
      verifying: "Verifying account...",
    },

    portfolioDashboard: {
      viewButton: "View Portfolio Dashboard",
      subtitle: "(Vault, Badges, Holdings)",
    },
  },

  /**
   * Leaderboard page content
   * Used by: Leaderboard page, LeaderboardTable, TierProgressCard,
   * PointsBreakdown, RewardsPanel
   */
  leaderboard: {
    badge: "Rankings & Rewards",
    title: "Compete. Earn. Prosper.",
    globalLeaderboard: "Global Leaderboard",
    clickToViewProfile: "Click a user to view profile",

    columns: {
      rank: "Rank",
      user: "User",
      points: "Points",
      tier: "Tier",
      winRate: "Win Rate",
      totalTrades: "Total Trades",
      pnl: "P&L",
    },

    tiers: {
      title: "Tier Progress",
      bronze: "Bronze",
      silver: "Silver",
      gold: "Gold",
      platinum: "Platinum",
      diamond: "Diamond",
    },

    pointsBreakdown: {
      title: "Points Breakdown",
      trading: "Trading",
      gaming: "Gaming",
      social: "Social",
      referrals: "Referrals",
      streak: "Streak Bonus",
    },
  },

  /**
   * Earn page content (Faucet, Lottery, Referrals)
   * Used by: Earn page, FaucetClaimCard, LotterySection, ReferralSection
   */
  earn: {
    title: "Earn SKAI",
    subtitle: "Faucet \u2022 Lottery \u2022 Referrals",

    tabs: {
      faucet: "Faucet",
      lottery: "Lottery",
      referrals: "Referrals",
    },

    stats: {
      skaiEarned: "SKAI Earned",
      currentStreak: "Current Streak",
      vaultBalance: "Vault Balance",
      walletBalance: "Wallet Balance",
    },

    faucet: {
      title: "Daily Faucet",
      description: "Claim free SKAI tokens every day",
      claimButton: "Claim Faucet",
      claimedToday: "Already claimed today",
      nextClaim: "Next claim in {{time}}",
      streakBonus: "Streak Bonus: +{{bonus}}%",
      totalClaims: "Total Claims",
    },

    lottery: {
      title: "Lottery",
      description: "Enter for a chance to win big",
      dailyDraw: "Daily Draw",
      weeklyDraw: "Weekly Draw",
      prizePool: "Prize Pool",
      yourTickets: "Your Tickets",
      buyTicket: "Buy Ticket",
      nextDraw: "Next Draw",
      recentWinners: "Recent Winners",
    },

    referral: {
      title: "Invite Friends",
      description: "Earn 100 SKAI Points for each friend that joins",
      linkLabel: "Referral Link",
      copyLink: "Copy Link",
      linkCopied: "Referral link copied to clipboard",
      shareOnX: "Share on X",
      shareOnTelegram: "Share on Telegram",
      totalReferrals: "Total Referrals",
      pendingRewards: "Pending Rewards",
      earnedRewards: "Earned Rewards",
    },
  },

  /**
   * 404 / Not Found page content
   * Used by: NotFound page
   */
  notFound: {
    code: "404",
    title: "Page Not Found",
    description:
      "The page you're looking for doesn't exist or has been moved.",
    goHome: "Go Home",
    goBack: "Go Back",
    helpText: "Need help? Contact our support team",
  },

  /**
   * Social features content (Discover, Messages, Trading Groups)
   * Used by: Discover page, Messages page, TradingGroups page,
   * SocialProfileEditor, FriendsActivity, etc.
   */
  social: {
    discover: {
      title: "Discover Creators",
      subtitle: "Browse creators who have launched social tokens",
      searchPlaceholder: "Search by username...",
      sortOptions: {
        trending: "Trending",
        newest: "Newest",
        marketCap: "Market Cap",
        holders: "Holders",
        volume: "Volume",
      },
      noCreators: "No creators found",
    },

    messages: {
      title: "Messages",
      newMessage: "New Message",
      searchPlaceholder: "Search conversations...",
      noConversations: "No conversations yet",
      noConversationsDescription: "Start a conversation with someone",
      typeMessage: "Type your message...",
      send: "Send",
      encrypted: "End-to-end encrypted",
      noMessages: "No messages yet",
    },

    tradingGroups: {
      title: "Trading Groups",
      createGroup: "Create Group",
      searchPlaceholder: "Search groups...",
      noGroups: "No groups yet",
      noGroupsFound: "No groups found",
      noPublicGroups: "No public groups",
      noEligibleGroups: "No eligible groups",
      members: "{{count}} members",
      join: "Join",
      leave: "Leave",
    },

    profile: {
      editProfile: "Edit Profile",
      follow: "Follow",
      unfollow: "Unfollow",
      followers: "Followers",
      following: "Following",
      posts: "Posts",
      bio: "Bio",
      myProfile: "My Profile",
    },
  },

  /**
   * Governance page content (DAO proposals, voting, delegation)
   * Used by: Governance page, GovernanceProposals, ProposalDetail,
   * DelegationManager, VotingPowerPanel, etc.
   */
  governance: {
    title: "Governance",
    subtitle: "Shape the future of SKAI",

    badges: {
      communityDriven: "Community Driven",
      communityDrivenDescription: "Shape the platform's future",
      transparent: "Transparent",
      transparentDescription: "All votes on-chain",
      secure: "Secure",
      secureDescription: "Time-locked execution",
    },

    stats: {
      votingPower: "Voting Power",
      totalProposals: "Total Proposals",
      activeProposals: "Active Proposals",
      delegatedTo: "Delegated To",
      lockedBalance: "Locked Balance",
    },

    proposals: {
      title: "Proposals",
      createProposal: "Create Proposal",
      noProposals: "No proposals yet",
      active: "Active",
      passed: "Passed",
      rejected: "Rejected",
      pending: "Pending",
      executed: "Executed",
      quorum: "Quorum",
      timeRemaining: "Time Remaining",
      voteFor: "Vote For",
      voteAgainst: "Vote Against",
      abstain: "Abstain",
    },

    delegation: {
      title: "Delegation",
      delegateVotes: "Delegate Votes",
      selfDelegate: "Self Delegate",
      currentDelegate: "Current Delegate",
      delegateAddress: "Delegate Address",
    },
  },

  /**
   * Streaming/Live page content
   * Used by: Streaming page, LiveStreamsBrowser, StreamPlayer,
   * StreamChat, GoLiveButton, etc.
   */
  streaming: {
    title: "Live Streams",
    subtitle: "Watch and interact with live traders",
    goLive: "Go Live",
    watching: "Watching",
    viewers: "{{count}} viewers",
    live: "LIVE",

    browse: {
      title: "Browse Streams",
      searchPlaceholder: "Search streams...",
      noStreams: "No live streams right now",
      noStreamsDescription: "Check back later or start your own stream",
      categories: {
        all: "All",
        trading: "Trading",
        gaming: "Gaming",
        education: "Education",
      },
    },

    chat: {
      title: "Chat",
      placeholder: "Send a message...",
      send: "Send",
      emotes: "Emotes",
    },

    controls: {
      mute: "Mute",
      unmute: "Unmute",
      fullscreen: "Fullscreen",
      exitFullscreen: "Exit Fullscreen",
      theater: "Theater Mode",
      pip: "Picture in Picture",
      quality: "Quality",
    },

    donations: {
      title: "Donations",
      sendDonation: "Send Donation",
      amount: "Amount",
      message: "Message (optional)",
    },
  },

  /**
   * Copy Trading content
   * Used by: CopyTrading page, LeaderboardTable, TraderProfileCard,
   * CopySettingsDialog, CopyTradingCard, etc.
   */
  copyTrading: {
    title: "Copy Trading",
    subtitle: "Follow and copy top traders automatically",
    searchPlaceholder: "Search traders...",

    tabs: {
      leaderboard: "Leaderboard",
      following: "Following",
      history: "History",
    },

    trader: {
      follow: "Follow",
      unfollow: "Unfollow",
      copyTrade: "Copy Trade",
      stopCopy: "Stop Copying",
      winRate: "Win Rate",
      totalPnl: "Total P&L",
      totalTrades: "Total Trades",
      followers: "Followers",
      copiers: "Copiers",
      roi: "ROI",
    },

    settings: {
      title: "Copy Settings",
      maxPosition: "Max Position Size",
      proportionalSize: "Proportional Size",
      fixedSize: "Fixed Size",
      maxDailyLoss: "Max Daily Loss",
      copyTp: "Copy Take Profit",
      copySl: "Copy Stop Loss",
      slippage: "Max Slippage",
    },

    emptyStates: {
      noTraders: "No traders found",
      noFollowing: "You're not following anyone yet",
      noHistory: "No copy trade history",
    },
  },

  /**
   * Support/Help content
   * Used by: SupportPage, HelpCenter, SupportTicketsDropdown,
   * BugReportForm, etc.
   */
  support: {
    title: "Support",
    helpCenter: "Help Center",
    searchPlaceholder: "Search for help...",

    ticket: {
      createTicket: "Create Ticket",
      subject: "Subject",
      subjectPlaceholder: "Brief description of your issue",
      category: "Category",
      priority: "Priority",
      description: "Description",
      descriptionPlaceholder:
        "Please provide as much detail as possible about your issue...",
      submit: "Submit Ticket",
      submitting: "Submitting...",
      replyPlaceholder: "Type your message...",
    },

    categories: {
      general: "General",
      account: "Account",
      trading: "Trading",
      deposit: "Deposit/Withdraw",
      technical: "Technical Issue",
      bug: "Bug Report",
      feature: "Feature Request",
    },

    priorities: {
      low: "Low",
      medium: "Medium",
      high: "High",
      critical: "Critical",
    },

    status: {
      open: "Open",
      inProgress: "In Progress",
      resolved: "Resolved",
      closed: "Closed",
    },
  },

  /**
   * Common empty states and loading states used across the app
   * Generic messages that can be reused by any component
   */
  emptyStates: {
    noData: "No data available",
    noResults: "No results found",
    noResultsDescription: "Try adjusting your search or filters",
    comingSoon: "Coming Soon",
    comingSoonDescription: "This feature is currently under development",
    noActivity: "No activity yet",
    noNotifications: "No notifications",
    noItems: "Nothing to show",
  },

  /**
   * Common toast/notification messages used across the app
   * Used by: useToast hooks, notification listeners, etc.
   */
  toasts: {
    addressCopied: "Address Copied",
    addressCopiedDescription: "Wallet address copied to clipboard",
    copyFailed: "Copy Failed",
    copyFailedDescription: "Long-press the address to copy manually",
    linkCopied: "Link Copied",
    settingsSaved: "Settings saved",
    profileUpdated: "Profile updated",
    transactionSubmitted: "Transaction submitted",
    transactionConfirmed: "Transaction confirmed",
    transactionFailed: "Transaction failed. Please try again.",
  },

  /**
   * Common placeholders used in search/input fields across the app
   */
  placeholders: {
    search: "Search...",
    searchMarkets: "Search markets, users, tokens...",
    searchUsers: "Search users...",
    amount: "0.00",
    email: "Enter your email...",
    username: "username",
    message: "Type a message...",
  },

  /**
   * AI Agent page hero and module content
   * Used by: AI page hero, quick suggestions, module cards, tools section
   */
  aiPage: {
    hero: {
      titlePrefix: "Your AI Agent for",
      titleAccent: "Web3 Everything",
      subtitle:
        "Just tell me what you want. I'll find the best trades, games, and opportunities for you.",
      inputPlaceholder:
        "Ask me anything... Trade, play, earn, or explore",
    },

    suggestions: [
      "Find me the best trades right now",
      "What's trending in crypto today?",
      "Show me top gaming opportunities",
      "Analyze my portfolio",
    ],

    modules: {
      trade: {
        title: "Trade",
        description: "AI-powered swaps & perpetuals",
      },
      play: {
        title: "Play",
        description: "Provably fair games & predictions",
      },
      earn: {
        title: "Earn",
        description: "Staking & yield opportunities",
      },
      messages: {
        title: "Messages",
        description: "Community & social trading",
      },
    },

    tools: {
      sectionBadge: "Live AI Intelligence",
      sectionTitle: "Real-Time",
      sectionTitleAccent: "AI Tools",
      sectionSubtitle:
        "Advanced market signals, copy trading, and AI-powered insights at your fingertips",
      chatAssistant: "AI Chat Assistant",
      poweredBy: "Powered by SKAI Neural Network",
      marketSignals: "Market Signals",
      copyTrading: "Copy Trading",
      insightsFeed: "AI Insights Feed",
      exploreTools: "Explore AI Tools",
    },

    cta: {
      startTrading: "Start Trading Now",
      playGames: "Play Games",
    },
  },

  /**
   * Mobile menu and sidebar section labels
   * Used by: HeaderMobileMenu, AccountDropdown, sidebar navigation
   */
  mobileMenu: {
    messages: "Messages",
    badgeRewards: "Badge Rewards",
    myProfile: "My Profile",
    settings: "Settings",
    referrals: "Referrals",
    language: "Language",
    theme: "Theme",
    discord: "Discord",
    twitter: "X (Twitter)",
  },

  /**
   * Referral page content
   * Used by: Referral page, ReferralConfig, etc.
   */
  referral: {
    title: "Referral Program",
    subtitle: "Invite friends and earn rewards together",

    stats: {
      totalReferrals: "Total Referrals",
      pendingCommission: "Pending Commission",
      earnedCommission: "Earned Commission",
      currentTier: "Current Tier",
    },

    tiers: {
      title: "Commission Tiers",
      level: "Level",
      referrals: "Referrals",
      commission: "Commission",
      tradingFee: "Trading Fee",
    },

    howItWorks: {
      title: "How It Works",
      step1: "Share your unique referral link",
      step2: "Friends sign up using your link",
      step3: "Earn commission on their trading fees",
    },

    actions: {
      copyLink: "Copy Link",
      shareOnX: "Share on X",
      shareOnTelegram: "Share on Telegram",
    },

    table: {
      user: "User",
      status: "Status",
      dateJoined: "Date Joined",
      commission: "Commission",
    },
  },

  /**
   * Bridge page content
   * Used by: Bridge page
   */
  bridge: {
    title: "Bridge",
    subtitle: "Transfer tokens between chains",
    from: "From",
    to: "To",
    amount: "Amount",
    estimatedTime: "Estimated Time",
    bridgeFee: "Bridge Fee",
    reviewTransfer: "Review Transfer",
    bridgeButton: "Bridge",
    bridging: "Bridging...",
  },

  /**
   * Lending page content
   * Used by: Lending page, UserLendingPositions
   */
  lending: {
    title: "Lending",
    subtitle: "Supply and borrow crypto assets",

    tabs: {
      supply: "Supply",
      borrow: "Borrow",
      positions: "Your Positions",
    },

    labels: {
      supplyApy: "Supply APY",
      borrowApy: "Borrow APY",
      totalSupplied: "Total Supplied",
      totalBorrowed: "Total Borrowed",
      availableLiquidity: "Available Liquidity",
      healthFactor: "Health Factor",
      collateral: "Collateral",
      ltv: "LTV",
    },

    actions: {
      supply: "Supply",
      withdraw: "Withdraw",
      borrow: "Borrow",
      repay: "Repay",
      depositDescription: "Deposit assets to earn interest",
      withdrawDescription: "Withdraw your supplied assets",
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
