/**
 * Challenges Page Template
 * 
 * Gamification challenges hub with:
 * - Daily challenges
 * - Weekly challenges
 * - Special events
 * - Progress tracking
 * - Rewards display
 * 
 * @example
 * ```tsx
 * <ChallengesPageTemplate
 *   dailyChallenges={daily}
 *   weeklyChallenges={weekly}
 *   userProgress={progress}
 *   onClaimReward={handleClaim}
 * />
 * ```
 */

import * as React from "react";
import { Badge } from "../components/core/badge";
import { Button } from "../components/core/button";
import { Card, CardContent } from "../components/core/card";
import { Progress } from "../components/feedback/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/navigation/tabs";
import { Skeleton } from "../components/feedback/skeleton";
import { cn } from "../lib/utils";

// =============================================================================
// Types
// =============================================================================

export type ChallengeType = "daily" | "weekly" | "special" | "achievement";
export type ChallengeCategory = "trading" | "gaming" | "social" | "learning" | "streak";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  category: ChallengeCategory;
  reward: {
    type: "points" | "badge" | "multiplier" | "token";
    amount: number;
    label: string;
  };
  progress: number;
  target: number;
  isCompleted: boolean;
  isClaimed: boolean;
  expiresAt?: string;
  icon?: React.ReactNode;
  difficulty?: "easy" | "medium" | "hard";
}

export interface UserChallengeProgress {
  totalCompleted: number;
  currentStreak: number;
  longestStreak: number;
  totalPointsEarned: number;
  dailyProgress: number;
  weeklyProgress: number;
}

export interface ChallengesPageTemplateProps {
  /** Daily challenges */
  dailyChallenges: Challenge[];
  /** Weekly challenges */
  weeklyChallenges: Challenge[];
  /** Special/event challenges */
  specialChallenges?: Challenge[];
  /** Achievement challenges */
  achievements?: Challenge[];
  /** User's overall progress */
  userProgress: UserChallengeProgress | null;
  /** Time until daily reset */
  dailyResetIn?: string;
  /** Time until weekly reset */
  weeklyResetIn?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Claiming reward state */
  isClaimingId?: string | null;
  /** Active tab */
  activeTab?: string;
  /** Tab change handler */
  onTabChange?: (tab: string) => void;
  /** Claim reward handler */
  onClaimReward?: (challengeId: string) => void;
  /** Challenge click handler */
  onChallengeClick?: (challenge: Challenge) => void;
  /** View rewards history handler */
  onViewHistory?: () => void;
  /** Custom header content */
  headerContent?: React.ReactNode;
  /** Custom footer content */
  footerContent?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// Sub-components
// =============================================================================

interface ProgressOverviewProps {
  progress: UserChallengeProgress | null;
  dailyResetIn?: string;
  weeklyResetIn?: string;
  isLoading?: boolean;
}

function ProgressOverview({ progress, dailyResetIn, weeklyResetIn, isLoading }: ProgressOverviewProps) {
  if (isLoading || !progress) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Current Streak</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">{progress.currentStreak}</p>
            <span className="text-2xl">🔥</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Best: {progress.longestStreak} days
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Points Earned</p>
          <p className="text-2xl font-bold">{progress.totalPointsEarned.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">
            {progress.totalCompleted} challenges completed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Daily Progress</p>
          <p className="text-2xl font-bold">{progress.dailyProgress}%</p>
          {dailyResetIn && (
            <p className="text-xs text-muted-foreground">
              Resets in {dailyResetIn}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Weekly Progress</p>
          <p className="text-2xl font-bold">{progress.weeklyProgress}%</p>
          {weeklyResetIn && (
            <p className="text-xs text-muted-foreground">
              Resets in {weeklyResetIn}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface ChallengeCardProps {
  challenge: Challenge;
  isClaimingId?: string | null;
  onClaim?: () => void;
  onClick?: () => void;
}

function ChallengeCard({ challenge, isClaimingId, onClaim, onClick }: ChallengeCardProps) {
  const isClaiming = isClaimingId === challenge.id;
  const progressPercent = challenge.target > 0 
    ? Math.min(100, Math.max(0, (challenge.progress / challenge.target) * 100))
    : 0;

  const categoryColors = {
    trading: "text-blue-500 bg-blue-500/10",
    gaming: "text-purple-500 bg-purple-500/10",
    social: "text-green-500 bg-green-500/10",
    learning: "text-yellow-500 bg-yellow-500/10",
    streak: "text-orange-500 bg-orange-500/10",
  };

  const difficultyColors = {
    easy: "text-green-500",
    medium: "text-yellow-500",
    hard: "text-red-500",
  };

  return (
    <Card 
      className={cn(
        "transition-all",
        challenge.isCompleted && !challenge.isClaimed && "border-green-500/50 bg-green-500/5",
        challenge.isClaimed && "opacity-60"
      )}
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              categoryColors[challenge.category]
            )}>
              {challenge.icon || "🎯"}
            </div>
            <div>
              <h3 className="font-semibold">{challenge.title}</h3>
              <p className="text-sm text-muted-foreground">{challenge.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {challenge.difficulty && (
              <Badge variant="outline" className={difficultyColors[challenge.difficulty]}>
                {challenge.difficulty}
              </Badge>
            )}
            <Badge className={categoryColors[challenge.category]}>
              {challenge.category}
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span>{challenge.progress} / {challenge.target}</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Reward and Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Reward:</span>
            <Badge variant="secondary">
              {challenge.reward.label}
            </Badge>
          </div>

          {challenge.isCompleted && !challenge.isClaimed ? (
            <Button 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onClaim?.();
              }}
              disabled={isClaiming}
            >
              {isClaiming ? "Claiming..." : "Claim Reward"}
            </Button>
          ) : challenge.isClaimed ? (
            <Badge variant="outline" className="text-green-500">
              ✓ Claimed
            </Badge>
          ) : challenge.expiresAt ? (
            <span className="text-xs text-muted-foreground">
              Expires {new Date(challenge.expiresAt).toLocaleDateString()}
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

interface ChallengeListProps {
  challenges: Challenge[];
  isClaimingId?: string | null;
  isLoading?: boolean;
  emptyMessage?: string;
  onClaim?: (challengeId: string) => void;
  onClick?: (challenge: Challenge) => void;
}

function ChallengeList({ 
  challenges, 
  isClaimingId, 
  isLoading, 
  emptyMessage = "No challenges available",
  onClaim,
  onClick,
}: ChallengeListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <Skeleton className="h-2 w-full mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (challenges.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          {emptyMessage}
        </CardContent>
      </Card>
    );
  }

  // Sort: unclaimed completed first, then in-progress, then claimed
  const sortedChallenges = [...challenges].sort((a, b) => {
    if (a.isCompleted && !a.isClaimed && !(b.isCompleted && !b.isClaimed)) return -1;
    if (b.isCompleted && !b.isClaimed && !(a.isCompleted && !a.isClaimed)) return 1;
    if (a.isClaimed && !b.isClaimed) return 1;
    if (b.isClaimed && !a.isClaimed) return -1;
    return 0;
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sortedChallenges.map((challenge) => (
        <ChallengeCard
          key={challenge.id}
          challenge={challenge}
          isClaimingId={isClaimingId}
          onClaim={() => onClaim?.(challenge.id)}
          onClick={() => onClick?.(challenge)}
        />
      ))}
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function ChallengesPageTemplate({
  dailyChallenges,
  weeklyChallenges,
  specialChallenges = [],
  achievements = [],
  userProgress,
  dailyResetIn,
  weeklyResetIn,
  isLoading = false,
  isClaimingId,
  activeTab = "daily",
  onTabChange,
  onClaimReward,
  onChallengeClick,
  onViewHistory,
  headerContent,
  footerContent,
  className,
}: ChallengesPageTemplateProps) {
  // Count claimable challenges
  const claimableDaily = dailyChallenges.filter(c => c.isCompleted && !c.isClaimed).length;
  const claimableWeekly = weeklyChallenges.filter(c => c.isCompleted && !c.isClaimed).length;
  const claimableSpecial = specialChallenges.filter(c => c.isCompleted && !c.isClaimed).length;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Challenges</h1>
          <p className="text-muted-foreground">
            Complete challenges to earn rewards and climb the leaderboard
          </p>
        </div>
        {onViewHistory && (
          <Button variant="outline" onClick={onViewHistory}>
            View History
          </Button>
        )}
      </div>

      {headerContent}

      {/* Progress Overview */}
      <ProgressOverview 
        progress={userProgress} 
        dailyResetIn={dailyResetIn}
        weeklyResetIn={weeklyResetIn}
        isLoading={isLoading}
      />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList>
          <TabsTrigger value="daily" className="relative">
            Daily
            {claimableDaily > 0 && (
              <Badge className="ml-2 h-5 w-5 p-0 justify-center">{claimableDaily}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="weekly" className="relative">
            Weekly
            {claimableWeekly > 0 && (
              <Badge className="ml-2 h-5 w-5 p-0 justify-center">{claimableWeekly}</Badge>
            )}
          </TabsTrigger>
          {specialChallenges.length > 0 && (
            <TabsTrigger value="special" className="relative">
              Special
              {claimableSpecial > 0 && (
                <Badge className="ml-2 h-5 w-5 p-0 justify-center">{claimableSpecial}</Badge>
              )}
            </TabsTrigger>
          )}
          {achievements.length > 0 && (
            <TabsTrigger value="achievements">
              Achievements
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="daily">
          <ChallengeList
            challenges={dailyChallenges}
            isClaimingId={isClaimingId}
            isLoading={isLoading}
            emptyMessage="No daily challenges available. Check back tomorrow!"
            onClaim={onClaimReward}
            onClick={onChallengeClick}
          />
        </TabsContent>

        <TabsContent value="weekly">
          <ChallengeList
            challenges={weeklyChallenges}
            isClaimingId={isClaimingId}
            isLoading={isLoading}
            emptyMessage="No weekly challenges available. Check back next week!"
            onClaim={onClaimReward}
            onClick={onChallengeClick}
          />
        </TabsContent>

        {specialChallenges.length > 0 && (
          <TabsContent value="special">
            <ChallengeList
              challenges={specialChallenges}
              isClaimingId={isClaimingId}
              isLoading={isLoading}
              emptyMessage="No special challenges available right now."
              onClaim={onClaimReward}
              onClick={onChallengeClick}
            />
          </TabsContent>
        )}

        {achievements.length > 0 && (
          <TabsContent value="achievements">
            <ChallengeList
              challenges={achievements}
              isClaimingId={isClaimingId}
              isLoading={isLoading}
              emptyMessage="No achievements yet. Keep playing to unlock achievements!"
              onClaim={onClaimReward}
              onClick={onChallengeClick}
            />
          </TabsContent>
        )}
      </Tabs>

      {footerContent}
    </div>
  );
}

export default ChallengesPageTemplate;
