/**
 * GitHub Integration Addon for Storybook
 *
 * Adds toolbar buttons for:
 * - View Source: Opens component source in GitHub
 * - Edit on GitHub: Opens web editor for direct editing
 * - Create PR: Links to create a new pull request
 *
 * Requires read access to view, write access to edit/push
 */

import React, { useEffect, useState } from "react";
import { addons, types, useStorybookApi } from "storybook/manager-api";
import {
  IconButton,
  TooltipLinkList,
  WithTooltip,
} from "storybook/internal/components";

// Storybook 9 removed the bundled `<Icons icon="github" />` component. Inline an SVG instead.
const GitHubIconSvg = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-1.97c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.94 10.94 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.73.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.79.56C20.21 21.39 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
  </svg>
);

// GitHub repository configuration
const GITHUB_CONFIG = {
  owner: "SKAI-Trading",
  repo: "skai-ui",
  branch: "main",
  basePath: "src",
};

// Addon identifier
const ADDON_ID = "skai-github";
const TOOL_ID = `${ADDON_ID}/tool`;
const PANEL_ID = `${ADDON_ID}/panel`;

/**
 * Get GitHub URLs for a component file
 */
function getGitHubUrls(filePath: string) {
  const { owner, repo, branch } = GITHUB_CONFIG;
  // filePath is already the full path from src/ (e.g., "docs/animations.stories.tsx")
  // Remove any leading ./ or src/ if present, then prepend src/
  const cleanPath = filePath
    .replace(/^\.\//, "")
    .replace(/^src\//, "")
    .replace(/\.stories\.tsx$/, ".tsx"); // Convert story file to source file
  const fullPath = `src/${cleanPath}`;

  return {
    view: `https://github.com/${owner}/${repo}/blob/${branch}/${fullPath}`,
    edit: `https://github.com/${owner}/${repo}/edit/${branch}/${fullPath}`,
    raw: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${fullPath}`,
    history: `https://github.com/${owner}/${repo}/commits/${branch}/${fullPath}`,
    blame: `https://github.com/${owner}/${repo}/blame/${branch}/${fullPath}`,
    newPR: `https://github.com/${owner}/${repo}/compare/${branch}...${branch}?expand=1`,
    issues: `https://github.com/${owner}/${repo}/issues/new?template=component-update.md`,
  };
}

/**
 * Extract file path from story title/parameters
 * Maps story titles to actual source file locations
 */
function getStoryFilePath(storyId: string, storyTitle?: string): string | null {
  // First, try to map from story title (more accurate)
  if (storyTitle) {
    const titleParts = storyTitle.split("/");
    const category = titleParts[0]?.toLowerCase() || "";
    const componentName = titleParts[titleParts.length - 1]?.toLowerCase() || "";

    // Map story categories to actual file paths
    const categoryMap: Record<string, string> = {
      components: "components/core",
      trading: "components/trading",
      layout: "components/layout",
      "design tokens": "lib",
      patterns: "docs",
      documentation: "docs",
      templates: "templates",
      tools: "docs",
      "design system": "docs",
      brand: "docs",
      "getting started": "docs",
    };

    // Special mappings for specific components
    const specialMappings: Record<string, string> = {
      animation: "lib/animations",
      colors: "docs/Colors.stories",
      typography: "docs/Typography.stories",
      spacing: "docs/Spacing.stories",
      theming: "docs/Theming.stories",
      button: "components/core/button",
      card: "components/core/card",
      input: "components/core/input",

      // Forms
      checkbox: "components/forms/checkbox",
      select: "components/forms/select",
      switch: "components/forms/switch",
      slider: "components/forms/slider",
      "radio-group": "components/forms/radio-group",
      toggle: "components/forms/toggle",
      autocomplete: "components/forms/autocomplete",

      // Feedback
      alert: "components/feedback/alert",
      "alert-dialog": "components/feedback/alert-dialog",
      progress: "components/feedback/progress",
      skeleton: "components/feedback/skeleton",
      tooltip: "components/feedback/tooltip",

      // Overlays
      dialog: "components/overlays/dialog",
      sheet: "components/overlays/sheet",
      popover: "components/overlays/popover",
      "dropdown-menu": "components/overlays/dropdown-menu",
      "context-menu": "components/overlays/context-menu",
      "hover-card": "components/overlays/hover-card",

      // Data Display
      avatar: "components/data-display/avatar",
      table: "components/data-display/table",

      // Layout
      separator: "components/layout/separator",
      "scroll-area": "components/layout/scroll-area",
      "app-shell": "components/layout/app-shell",

      // Navigation
      tabs: "components/navigation/tabs",

      // Backgrounds
      "tickerbackground": "components/backgrounds/ticker-background",
      "barttickerbackground": "components/backgrounds/bar-ticker-background",
      "cosmicbackground": "components/backgrounds/cosmic-background",
    };

    // Check special mappings first
    if (specialMappings[componentName]) {
      return `${specialMappings[componentName]}.tsx`;
    }

    // Use category mapping
    const folder = categoryMap[category] || "docs";
    return `${folder}/${componentName}.tsx`;
  }

  // Fallback: parse from story ID
  const parts = storyId.split("--")[0].split("-");
  if (parts.length >= 2) {
    // Handle multi-word categories like "design-tokens"
    let category = parts[0];
    let componentParts = parts.slice(1);

    // Check for two-word categories
    if (parts[0] === "design" && parts[1] === "tokens") {
      category = "design-tokens";
      componentParts = parts.slice(2);
    } else if (parts[0] === "getting" && parts[1] === "started") {
      category = "getting-started";
      componentParts = parts.slice(2);
    }

    const componentName = componentParts.join("-");

    const folderMap: Record<string, string> = {
      components: "components/core",
      trading: "components/trading",
      layout: "components/layout",
      "design-tokens": "lib",
      patterns: "docs",
      documentation: "docs",
      templates: "templates",
      "getting-started": "docs",
    };

    const folder = folderMap[category] || "docs";

    // Special case for animation (the file is animations.tsx not animation.tsx)
    if (componentName === "animation") {
      return "lib/animations.tsx";
    }

    return `${folder}/${componentName}.tsx`;
  }

  return null;
}

/**
 * GitHub Toolbar Button
 */
const GitHubTool = () => {
  const api = useStorybookApi();
  const [currentStory, setCurrentStory] = useState<{
    id: string;
    title?: string;
  } | null>(null);

  useEffect(() => {
    const updateStory = () => {
      const story = api.getCurrentStoryData();
      if (story) {
        setCurrentStory({
          id: story.id,
          title: story.title,
        });
      }
    };

    // Update on mount
    updateStory();

    // Listen for story changes
    const channel = addons.getChannel();
    channel.on("storyChanged", updateStory);

    return () => {
      channel.off("storyChanged", updateStory);
    };
  }, [api]);

  const filePath = currentStory
    ? getStoryFilePath(currentStory.id, currentStory.title)
    : null;
  const urls = filePath ? getGitHubUrls(filePath) : null;

  const links = urls
    ? [
        {
          id: "view-source",
          title: "View Source",
          href: urls.view,
          target: "_blank",
        },
        {
          id: "edit-github",
          title: "Edit on GitHub",
          href: urls.edit,
          target: "_blank",
        },
        {
          id: "view-history",
          title: "View History",
          href: urls.history,
          target: "_blank",
        },
        {
          id: "view-blame",
          title: "View Blame",
          href: urls.blame,
          target: "_blank",
        },
        {
          id: "separator",
          title: "---",
        },
        {
          id: "create-pr",
          title: "Create Pull Request",
          href: urls.newPR,
          target: "_blank",
        },
        {
          id: "report-issue",
          title: "Report Issue",
          href: urls.issues,
          target: "_blank",
        },
      ]
    : [];

  return (
    <WithTooltip
      placement="top"
      trigger="click"
      closeOnOutsideClick
      tooltip={<TooltipLinkList links={links.filter((l) => l.title !== "---")} />}
    >
      <IconButton key={TOOL_ID} title="GitHub Actions" disabled={!filePath}>
        <GitHubIconSvg />
      </IconButton>
    </WithTooltip>
  );
};

/**
 * Register the addon
 */
addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: "GitHub",
    match: ({ viewMode }) => viewMode === "story" || viewMode === "docs",
    render: GitHubTool,
  });
});

export { GITHUB_CONFIG, getGitHubUrls, getStoryFilePath };
