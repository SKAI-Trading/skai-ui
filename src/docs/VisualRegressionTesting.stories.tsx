import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Camera,
  GitBranch,
  Check,
  X,
  RefreshCw,
  Download,
  Search,
  ZoomIn,
  ZoomOut,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Play,
} from "lucide-react";

const meta: Meta = {
  title: "Tools/Visual Regression Testing",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Screenshot comparison and visual regression testing tool for UI components.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

type TestStatus = "passed" | "failed" | "new" | "pending" | "accepted";

interface VisualTest {
  id: string;
  name: string;
  component: string;
  story: string;
  status: TestStatus;
  diff: number; // percentage difference
  baselineDate: string;
  currentDate: string;
  viewport: { width: number; height: number };
  browser: string;
  hasBaseline: boolean;
}

interface TestRun {
  id: string;
  branch: string;
  commit: string;
  timestamp: string;
  tests: {
    total: number;
    passed: number;
    failed: number;
    new: number;
  };
  duration: string;
}

const mockTests: VisualTest[] = [
  {
    id: "1",
    name: "Button - Default",
    component: "Button",
    story: "Default",
    status: "passed",
    diff: 0,
    baselineDate: "2026-01-30",
    currentDate: "2026-02-01",
    viewport: { width: 1280, height: 720 },
    browser: "Chrome",
    hasBaseline: true,
  },
  {
    id: "2",
    name: "Button - Hover State",
    component: "Button",
    story: "Hover",
    status: "failed",
    diff: 2.4,
    baselineDate: "2026-01-30",
    currentDate: "2026-02-01",
    viewport: { width: 1280, height: 720 },
    browser: "Chrome",
    hasBaseline: true,
  },
  {
    id: "3",
    name: "Card - With Content",
    component: "Card",
    story: "WithContent",
    status: "passed",
    diff: 0,
    baselineDate: "2026-01-30",
    currentDate: "2026-02-01",
    viewport: { width: 1280, height: 720 },
    browser: "Chrome",
    hasBaseline: true,
  },
  {
    id: "4",
    name: "Dialog - Open",
    component: "Dialog",
    story: "Open",
    status: "failed",
    diff: 5.1,
    baselineDate: "2026-01-28",
    currentDate: "2026-02-01",
    viewport: { width: 1280, height: 720 },
    browser: "Chrome",
    hasBaseline: true,
  },
  {
    id: "5",
    name: "TokenIcon - ETH",
    component: "TokenIcon",
    story: "ETH",
    status: "new",
    diff: 100,
    baselineDate: "",
    currentDate: "2026-02-01",
    viewport: { width: 1280, height: 720 },
    browser: "Chrome",
    hasBaseline: false,
  },
  {
    id: "6",
    name: "Input - Error State",
    component: "Input",
    story: "Error",
    status: "passed",
    diff: 0.1,
    baselineDate: "2026-01-30",
    currentDate: "2026-02-01",
    viewport: { width: 1280, height: 720 },
    browser: "Chrome",
    hasBaseline: true,
  },
  {
    id: "7",
    name: "Badge - All Variants",
    component: "Badge",
    story: "AllVariants",
    status: "accepted",
    diff: 1.2,
    baselineDate: "2026-01-30",
    currentDate: "2026-02-01",
    viewport: { width: 1280, height: 720 },
    browser: "Chrome",
    hasBaseline: true,
  },
  {
    id: "8",
    name: "Table - With Data",
    component: "Table",
    story: "WithData",
    status: "pending",
    diff: 0,
    baselineDate: "2026-01-30",
    currentDate: "2026-02-01",
    viewport: { width: 1280, height: 720 },
    browser: "Chrome",
    hasBaseline: true,
  },
];

const mockRuns: TestRun[] = [
  {
    id: "run-1",
    branch: "main",
    commit: "abc1234",
    timestamp: "2026-02-01T14:30:00Z",
    tests: { total: 8, passed: 4, failed: 2, new: 1 },
    duration: "2m 34s",
  },
  {
    id: "run-2",
    branch: "feature/new-ui",
    commit: "def5678",
    timestamp: "2026-02-01T10:15:00Z",
    tests: { total: 8, passed: 5, failed: 3, new: 0 },
    duration: "2m 12s",
  },
  {
    id: "run-3",
    branch: "main",
    commit: "123abcd",
    timestamp: "2026-01-31T16:45:00Z",
    tests: { total: 7, passed: 7, failed: 0, new: 0 },
    duration: "1m 58s",
  },
];

const statusConfig: Record<
  TestStatus,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  passed: {
    icon: <CheckCircle className="w-4 h-4" />,
    color: "text-green-500",
    bg: "bg-green-500/20",
  },
  failed: {
    icon: <XCircle className="w-4 h-4" />,
    color: "text-red-500",
    bg: "bg-red-500/20",
  },
  new: {
    icon: <AlertCircle className="w-4 h-4" />,
    color: "text-blue-500",
    bg: "bg-blue-500/20",
  },
  pending: {
    icon: <Clock className="w-4 h-4" />,
    color: "text-yellow-500",
    bg: "bg-yellow-500/20",
  },
  accepted: {
    icon: <Check className="w-4 h-4" />,
    color: "text-cyan-500",
    bg: "bg-cyan-500/20",
  },
};

export const TestDashboard: Story = {
  render: () => {
    const [tests, setTests] = useState(mockTests);
    const [selectedTest, setSelectedTest] = useState<VisualTest | null>(
      mockTests[1],
    );
    const [filterStatus, setFilterStatus] = useState<TestStatus | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [compareMode, setCompareMode] = useState<
      "side-by-side" | "overlay" | "diff"
    >("side-by-side");
    const [overlayOpacity, setOverlayOpacity] = useState(50);
    const [zoomLevel, setZoomLevel] = useState(100);
    const [isRunning, setIsRunning] = useState(false);

    const filteredTests = tests.filter((test) => {
      const matchesStatus =
        filterStatus === "all" || test.status === filterStatus;
      const matchesSearch =
        test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.component.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    const stats = {
      total: tests.length,
      passed: tests.filter((t) => t.status === "passed").length,
      failed: tests.filter((t) => t.status === "failed").length,
      new: tests.filter((t) => t.status === "new").length,
    };

    const acceptTest = (testId: string) => {
      setTests(
        tests.map((t) =>
          t.id === testId
            ? { ...t, status: "accepted" as TestStatus, diff: 0 }
            : t,
        ),
      );
      if (selectedTest?.id === testId) {
        setSelectedTest({ ...selectedTest, status: "accepted", diff: 0 });
      }
    };

    const rejectTest = (testId: string) => {
      setTests(
        tests.map((t) =>
          t.id === testId ? { ...t, status: "failed" as TestStatus } : t,
        ),
      );
    };

    const runTests = () => {
      setIsRunning(true);
      setTimeout(() => {
        setIsRunning(false);
      }, 3000);
    };

    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Visual Regression Testing</h1>
                <p className="text-sm text-muted-foreground">
                  Compare screenshots across commits
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <GitBranch className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono">main</span>
                <span className="text-muted-foreground">@</span>
                <span className="font-mono text-muted-foreground">abc1234</span>
              </div>
              <button
                onClick={runTests}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run Tests
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{stats.total}</span>
              <span className="text-muted-foreground">Total</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-500">
                {stats.passed}
              </span>
              <span className="text-muted-foreground">Passed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-red-500">
                {stats.failed}
              </span>
              <span className="text-muted-foreground">Failed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-500">
                {stats.new}
              </span>
              <span className="text-muted-foreground">New</span>
            </div>
            <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              Last run: 5 minutes ago
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Test List */}
          <div className="w-80 border-r border-border flex flex-col">
            {/* Filters */}
            <div className="p-3 border-b border-border space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tests..."
                  className="w-full pl-9 pr-3 py-2 bg-muted rounded-lg text-sm"
                />
              </div>
              <div className="flex flex-wrap gap-1">
                {(["all", "failed", "new", "passed", "pending"] as const).map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-2 py-1 rounded text-xs capitalize ${
                        filterStatus === status
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {status}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Test List */}
            <div className="flex-1 overflow-auto">
              {filteredTests.map((test) => {
                const config = statusConfig[test.status];
                return (
                  <button
                    key={test.id}
                    onClick={() => setSelectedTest(test)}
                    className={`w-full text-left p-3 border-b border-border hover:bg-muted/50 transition-colors ${
                      selectedTest?.id === test.id ? "bg-muted" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`mt-0.5 ${config.color}`}>
                        {config.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {test.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {test.component} / {test.story}
                        </p>
                        {test.diff > 0 && test.status !== "new" && (
                          <p
                            className={`text-xs mt-1 ${test.diff > 1 ? "text-red-500" : "text-yellow-500"}`}
                          >
                            {test.diff.toFixed(1)}% difference
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comparison View */}
          <div className="flex-1 flex flex-col">
            {selectedTest ? (
              <>
                {/* Toolbar */}
                <div className="p-3 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{selectedTest.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${statusConfig[selectedTest.status].bg} ${statusConfig[selectedTest.status].color}`}
                    >
                      {selectedTest.status}
                    </span>
                    {selectedTest.diff > 0 && selectedTest.hasBaseline && (
                      <span className="text-xs text-red-500">
                        {selectedTest.diff.toFixed(1)}% diff
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Compare Mode */}
                    <div className="flex rounded-lg overflow-hidden border border-border">
                      {(["side-by-side", "overlay", "diff"] as const).map(
                        (mode) => (
                          <button
                            key={mode}
                            onClick={() => setCompareMode(mode)}
                            className={`px-3 py-1.5 text-xs capitalize ${
                              compareMode === mode
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted"
                            }`}
                          >
                            {mode.replace("-", " ")}
                          </button>
                        ),
                      )}
                    </div>

                    {/* Zoom */}
                    <div className="flex items-center gap-1 border border-border rounded-lg">
                      <button
                        onClick={() =>
                          setZoomLevel(Math.max(25, zoomLevel - 25))
                        }
                        className="p-1.5 hover:bg-muted rounded-l-lg"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <span className="text-xs w-12 text-center">
                        {zoomLevel}%
                      </span>
                      <button
                        onClick={() =>
                          setZoomLevel(Math.min(200, zoomLevel + 25))
                        }
                        className="p-1.5 hover:bg-muted rounded-r-lg"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comparison Content */}
                <div className="flex-1 overflow-auto p-4 bg-muted/30">
                  {compareMode === "side-by-side" && (
                    <div className="grid grid-cols-2 gap-4 h-full">
                      {/* Baseline */}
                      <div className="bg-card border border-border rounded-lg overflow-hidden">
                        <div className="p-2 border-b border-border bg-muted/50 flex items-center justify-between">
                          <span className="text-xs font-medium">Baseline</span>
                          <span className="text-xs text-muted-foreground">
                            {selectedTest.baselineDate || "No baseline"}
                          </span>
                        </div>
                        <div
                          className="p-4 flex items-center justify-center min-h-[300px]"
                          style={{ transform: `scale(${zoomLevel / 100})` }}
                        >
                          {selectedTest.hasBaseline ? (
                            <div className="w-full h-48 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                              <span className="text-muted-foreground">
                                Baseline Screenshot
                              </span>
                            </div>
                          ) : (
                            <div className="text-center text-muted-foreground">
                              <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                              <p className="text-sm">No baseline yet</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Current */}
                      <div className="bg-card border border-border rounded-lg overflow-hidden">
                        <div className="p-2 border-b border-border bg-muted/50 flex items-center justify-between">
                          <span className="text-xs font-medium">Current</span>
                          <span className="text-xs text-muted-foreground">
                            {selectedTest.currentDate}
                          </span>
                        </div>
                        <div
                          className="p-4 flex items-center justify-center min-h-[300px]"
                          style={{ transform: `scale(${zoomLevel / 100})` }}
                        >
                          <div className="w-full h-48 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-lg flex items-center justify-center">
                            <span className="text-muted-foreground">
                              Current Screenshot
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {compareMode === "overlay" && (
                    <div className="h-full flex flex-col items-center">
                      <div className="mb-4 flex items-center gap-2">
                        <span className="text-xs">Baseline</span>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={overlayOpacity}
                          onChange={(e) =>
                            setOverlayOpacity(Number(e.target.value))
                          }
                          className="w-48"
                        />
                        <span className="text-xs">Current</span>
                      </div>
                      <div className="relative w-full max-w-2xl">
                        <div
                          className="w-full h-48 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg"
                          style={{ opacity: (100 - overlayOpacity) / 100 }}
                        />
                        <div
                          className="absolute inset-0 w-full h-48 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-lg"
                          style={{ opacity: overlayOpacity / 100 }}
                        />
                      </div>
                    </div>
                  )}

                  {compareMode === "diff" && (
                    <div className="h-full flex items-center justify-center">
                      <div className="bg-card border border-border rounded-lg overflow-hidden w-full max-w-2xl">
                        <div className="p-2 border-b border-border bg-muted/50 flex items-center justify-between">
                          <span className="text-xs font-medium">
                            Diff Visualization
                          </span>
                          <span className="text-xs text-red-500">
                            {selectedTest.diff.toFixed(1)}% pixels changed
                          </span>
                        </div>
                        <div className="p-4 flex items-center justify-center min-h-[300px]">
                          <div className="w-full h-48 bg-black rounded-lg flex items-center justify-center relative overflow-hidden">
                            {/* Simulated diff overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent">
                              {selectedTest.diff > 0 && (
                                <>
                                  <div className="absolute top-4 left-8 w-24 h-8 bg-red-500/50 rounded" />
                                  <div className="absolute bottom-6 right-12 w-16 h-12 bg-red-500/50 rounded" />
                                </>
                              )}
                            </div>
                            <span className="text-white/50 z-10">
                              Highlighted differences in red
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="p-3 border-t border-border flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {selectedTest.viewport.width}x{selectedTest.viewport.height}{" "}
                    · {selectedTest.browser}
                  </div>
                  <div className="flex items-center gap-2">
                    {(selectedTest.status === "failed" ||
                      selectedTest.status === "new") && (
                      <>
                        <button
                          onClick={() => acceptTest(selectedTest.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 text-sm"
                        >
                          <Check className="w-4 h-4" />
                          Accept as Baseline
                        </button>
                        <button
                          onClick={() => rejectTest(selectedTest.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 text-sm"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    )}
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-lg hover:bg-muted/80 text-sm">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select a test to view comparison</p>
                </div>
              </div>
            )}
          </div>

          {/* Recent Runs Sidebar */}
          <div className="w-64 border-l border-border p-4 overflow-auto">
            <h3 className="font-medium mb-3">Recent Runs</h3>
            <div className="space-y-2">
              {mockRuns.map((run) => (
                <div key={run.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      <GitBranch className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs font-mono">{run.branch}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {run.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-green-500">{run.tests.passed} ✓</span>
                    <span className="text-red-500">{run.tests.failed} ✗</span>
                    <span className="text-blue-500">{run.tests.new} new</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 font-mono">
                    {run.commit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
};
