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

import React, { useCallback, useEffect, useState } from "react";
import { addons, types, useParameter, useStorybookApi } from "@storybook/manager-api";
import { IconButton, Icons, TooltipLinkList, WithTooltip } from "@storybook/components";

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
      templates: "docs",
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
      dialog: "components/overlays/dialog",
      sheet: "components/overlays/sheet",
      popover: "components/overlays/popover",
      tooltip: "components/feedback/tooltip",
      tabs: "components/navigation/tabs",
      checkbox: "components/forms/checkbox",
      select: "components/forms/select",
      avatar: "components/data-display/avatar",
      table: "components/data-display/table",
      separator: "components/layout/separator",
      "scroll-area": "components/layout/scroll-area",
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
          icon: "document" as const,
          href: urls.view,
          target: "_blank",
        },
        {
          id: "edit-github",
          title: "Edit on GitHub",
          icon: "edit" as const,
          href: urls.edit,
          target: "_blank",
        },
        {
          id: "view-history",
          title: "View History",
          icon: "time" as const,
          href: urls.history,
          target: "_blank",
        },
        {
          id: "view-blame",
          title: "View Blame",
          icon: "users" as const,
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
          icon: "pullrequest" as const,
          href: urls.newPR,
          target: "_blank",
        },
        {
          id: "report-issue",
          title: "Report Issue",
          icon: "flag" as const,
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
        <Icons icon="github" />
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
