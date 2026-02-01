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
import {
  addons,
  types,
  useParameter,
  useStorybookApi,
} from "@storybook/manager-api";
import {
  IconButton,
  Icons,
  TooltipLinkList,
  WithTooltip,
} from "@storybook/components";

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
  const { owner, repo, branch, basePath } = GITHUB_CONFIG;
  const cleanPath = filePath.replace(/^\.\//, "").replace(/^src\//, "");
  const fullPath = `${basePath}/${cleanPath}`;

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
 * Extract file path from story parameters
 */
function getStoryFilePath(storyId: string): string | null {
  // Convert story ID to likely file path
  // e.g., "components-button--primary" -> "components/button.tsx"
  const parts = storyId.split("--")[0].split("-");

  if (parts.length >= 2) {
    const category = parts[0];
    const componentName = parts.slice(1).join("-");

    // Map category to folder
    const folderMap: Record<string, string> = {
      components: "components",
      trading: "components",
      display: "components",
      feedback: "components",
      layout: "components",
      navigation: "components",
      decorative: "components",
      patterns: "docs",
      pages: "docs",
    };

    const folder = folderMap[category.toLowerCase()] || "components";
    return `${folder}/${componentName}.tsx`;
  }

  return null;
}

/**
 * GitHub Toolbar Button
 */
const GitHubTool = () => {
  const api = useStorybookApi();
  const [currentStory, setCurrentStory] = useState<string | null>(null);

  useEffect(() => {
    const updateStory = () => {
      const story = api.getCurrentStoryData();
      if (story) {
        setCurrentStory(story.id);
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

  const filePath = currentStory ? getStoryFilePath(currentStory) : null;
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
      tooltip={
        <TooltipLinkList links={links.filter((l) => l.title !== "---")} />
      }
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
