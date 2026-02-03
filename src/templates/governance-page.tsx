/**
 * GovernancePageTemplate
 * 
 * Pure presentational template for the DAO governance page.
 * Vote on proposals, delegate voting power, view governance stats.
 * 
 * @example
 * ```tsx
 * import { GovernancePageTemplate } from '@skai/ui';
 * 
 * function Governance() {
 *   return (
 *     <GovernancePageTemplate
 *       proposals={activeProposals}
 *       votingPower={userVotingPower}
 *       onVote={handleVote}
 *       renderProposalDetail={() => <ProposalDetail />}
 *     />
 *   );
 * }
 * ```
 */

import * as React from "react";
import { Badge } from "../components/core/badge";
import { Button } from "../components/core/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/core/card";
import { Skeleton } from "../components/feedback/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/navigation/tabs";

// ============================================================================
// TYPES
// ============================================================================

export type ProposalStatus = 'active' | 'pending' | 'passed' | 'failed' | 'executed' | 'cancelled';
export type VoteChoice = 'for' | 'against' | 'abstain';

export interface Proposal {
  /** Proposal ID */
  id: string;
  /** Proposal title */
  title: string;
  /** Description/summary */
  description: string;
  /** Full proposal body (markdown) */
  body?: string;
  /** Proposer address */
  proposer: string;
  /** Proposer username */
  proposerName?: string;
  /** Status */
  status: ProposalStatus;
  /** Votes for */
  votesFor: number;
  /** Votes against */
  votesAgainst: number;
  /** Votes abstain */
  votesAbstain: number;
  /** Total votes cast */
  totalVotes: number;
  /** Quorum required */
  quorum: number;
  /** Whether quorum is met */
  quorumMet: boolean;
  /** Start time */
  startTime: Date;
  /** End time */
  endTime: Date;
  /** User's vote if cast */
  userVote?: VoteChoice;
  /** Discussion URL */
  discussionUrl?: string;
  /** Category/tag */
  category?: string;
}

export interface GovernanceStats {
  /** Total proposals */
  totalProposals: number;
  /** Active proposals */
  activeProposals: number;
  /** Total votes cast ever */
  totalVotesCast: number;
  /** Unique voters */
  uniqueVoters: number;
  /** Treasury value */
  treasuryValue?: number;
  /** Token supply */
  tokenSupply?: number;
}

export interface DelegationInfo {
  /** Current delegate address */
  delegateTo?: string;
  /** Delegate username */
  delegateName?: string;
  /** Delegated voting power */
  delegatedPower: number;
  /** Self-delegated */
  selfDelegated: boolean;
  /** Delegators (addresses delegating to user) */
  delegators?: string[];
  /** Total received delegation */
  receivedDelegation?: number;
}

export type GovernanceTab = 'proposals' | 'delegation' | 'create' | 'treasury';

export interface GovernancePageProps {
  /** Active tab */
  activeTab?: GovernanceTab;
  /** Callback when tab changes */
  onTabChange?: (tab: GovernanceTab) => void;
  /** Whether user is connected */
  isConnected?: boolean;
  /** User wallet address */
  walletAddress?: string;
  /** Whether loading */
  isLoading?: boolean;
  /** Governance stats */
  stats?: GovernanceStats;
  /** User's voting power */
  votingPower?: number;
  /** User's locked balance */
  lockedBalance?: number;
  /** Delegation info */
  delegation?: DelegationInfo;
  /** List of proposals */
  proposals?: Proposal[];
  /** Proposal status filter */
  statusFilter?: ProposalStatus | 'all';
  /** Callback when filter changes */
  onStatusFilterChange?: (status: ProposalStatus | 'all') => void;
  /** Selected proposal for detail view */
  selectedProposal?: Proposal | null;
  /** Callback when selecting proposal */
  onSelectProposal?: (proposal: Proposal | null) => void;
  /** Cast vote */
  onVote?: (proposalId: string, choice: VoteChoice) => void;
  /** Delegate voting power */
  onDelegate?: (address: string) => void;
  /** Open create proposal modal */
  onCreateProposal?: () => void;
  
  // Render props
  /** Render proposal detail */
  renderProposalDetail?: (proposal: Proposal) => React.ReactNode;
  /** Render delegation manager */
  renderDelegationManager?: () => React.ReactNode;
  /** Render create proposal form */
  renderCreateForm?: () => React.ReactNode;
  /** Render treasury view */
  renderTreasury?: () => React.ReactNode;
  /** Render trust badges */
  renderTrustBadges?: () => React.ReactNode;
}

// ============================================================================
// HELPERS
// ============================================================================

function formatVotes(votes: number): string {
  if (votes >= 1000000) return `${(votes / 1000000).toFixed(2)}M`;
  if (votes >= 1000) return `${(votes / 1000).toFixed(1)}K`;
  return votes.toLocaleString();
}

function getStatusColor(status: ProposalStatus): string {
  switch (status) {
    case 'active': return 'bg-blue-500';
    case 'pending': return 'bg-yellow-500';
    case 'passed': return 'bg-green-500';
    case 'executed': return 'bg-green-600';
    case 'failed': return 'bg-red-500';
    case 'cancelled': return 'bg-gray-500';
  }
}

function getStatusLabel(status: ProposalStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getTimeRemaining(endTime: Date): string {
  const now = new Date();
  const diff = endTime.getTime() - now.getTime();
  
  if (diff <= 0) return 'Ended';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) return `${days}d ${hours}h remaining`;
  return `${hours}h remaining`;
}

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

interface StatsBarProps {
  stats?: GovernanceStats;
  votingPower?: number;
}

function StatsBar({ stats, votingPower }: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {votingPower !== undefined && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <span>🗳️</span>
              <span className="text-sm text-muted-foreground">Your Voting Power</span>
            </div>
            <div className="text-2xl font-bold mt-1">{formatVotes(votingPower)}</div>
          </CardContent>
        </Card>
      )}
      
      {stats && (
        <>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <span>📋</span>
                <span className="text-sm text-muted-foreground">Active Proposals</span>
              </div>
              <div className="text-2xl font-bold mt-1">{stats.activeProposals}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <span>👥</span>
                <span className="text-sm text-muted-foreground">Unique Voters</span>
              </div>
              <div className="text-2xl font-bold mt-1">{stats.uniqueVoters.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          {stats.treasuryValue !== undefined && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <span>🏦</span>
                  <span className="text-sm text-muted-foreground">Treasury</span>
                </div>
                <div className="text-2xl font-bold mt-1">${(stats.treasuryValue / 1000000).toFixed(2)}M</div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

interface ProposalCardProps {
  proposal: Proposal;
  onClick?: () => void;
  onVote?: (choice: VoteChoice) => void;
}

function ProposalCard({ proposal, onClick, onVote }: ProposalCardProps) {
  const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
  const forPercent = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
  const againstPercent = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0;
  
  const isActive = proposal.status === 'active';
  
  return (
    <Card className="hover:bg-muted/30 transition-colors">
      <CardHeader className="pb-2 cursor-pointer" onClick={onClick}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-base line-clamp-1">{proposal.title}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1">
              {proposal.description}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(proposal.status)}>
            {getStatusLabel(proposal.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Vote progress */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-green-500">For: {formatVotes(proposal.votesFor)} ({forPercent.toFixed(1)}%)</span>
            <span className="text-red-500">Against: {formatVotes(proposal.votesAgainst)} ({againstPercent.toFixed(1)}%)</span>
          </div>
          <div className="h-2 rounded-full bg-red-500/30 overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all"
              style={{ width: `${forPercent}%` }}
            />
          </div>
        </div>
        
        {/* Meta info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>By: {proposal.proposerName || `${proposal.proposer.slice(0, 6)}...`}</span>
            {proposal.quorumMet ? (
              <span className="text-green-500">✓ Quorum met</span>
            ) : (
              <span>Quorum: {((totalVotes / proposal.quorum) * 100).toFixed(0)}%</span>
            )}
          </div>
          {isActive && <span>{getTimeRemaining(proposal.endTime)}</span>}
        </div>
        
        {/* Vote buttons */}
        {isActive && onVote && !proposal.userVote && (
          <div className="flex items-center gap-2 mt-4">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 border-green-500 text-green-500 hover:bg-green-500/10"
              onClick={(e) => { e.stopPropagation(); onVote('for'); }}
            >
              ✓ For
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 border-red-500 text-red-500 hover:bg-red-500/10"
              onClick={(e) => { e.stopPropagation(); onVote('against'); }}
            >
              ✗ Against
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={(e) => { e.stopPropagation(); onVote('abstain'); }}
            >
              ○ Abstain
            </Button>
          </div>
        )}
        
        {/* User's vote */}
        {proposal.userVote && (
          <div className="mt-4 text-sm">
            <Badge variant="outline">
              You voted: {proposal.userVote.charAt(0).toUpperCase() + proposal.userVote.slice(1)}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// LOADING STATE
// ============================================================================

function GovernanceLoadingSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <Skeleton className="h-10 w-48" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN TEMPLATE
// ============================================================================

export function GovernancePageTemplate({
  activeTab = 'proposals',
  onTabChange,
  isConnected,
  walletAddress: _walletAddress,
  isLoading,
  stats,
  votingPower,
  lockedBalance: _lockedBalance,
  delegation: _delegation,
  proposals = [],
  statusFilter = 'all',
  onStatusFilterChange,
  selectedProposal,
  onSelectProposal,
  onVote,
  onDelegate: _onDelegate,
  onCreateProposal,
  renderProposalDetail,
  renderDelegationManager,
  renderCreateForm,
  renderTreasury,
  renderTrustBadges,
}: GovernancePageProps) {
  if (isLoading) {
    return <GovernanceLoadingSkeleton />;
  }
  
  // Proposal detail view
  if (selectedProposal) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <Button variant="ghost" onClick={() => onSelectProposal?.(null)}>
          ← Back to Proposals
        </Button>
        
        {renderProposalDetail ? (
          renderProposalDetail(selectedProposal)
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{selectedProposal.title}</CardTitle>
                  <CardDescription className="mt-2">
                    Proposed by {selectedProposal.proposerName || selectedProposal.proposer.slice(0, 8)}...
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(selectedProposal.status)}>
                  {getStatusLabel(selectedProposal.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">{selectedProposal.description}</p>
              
              {selectedProposal.body && (
                <div className="p-4 rounded-lg bg-muted/50 prose prose-invert max-w-none">
                  {selectedProposal.body}
                </div>
              )}
              
              {/* Vote progress */}
              <div className="space-y-4">
                <h3 className="font-medium">Voting Results</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-green-500/10 text-center">
                    <p className="text-green-500 text-2xl font-bold">{formatVotes(selectedProposal.votesFor)}</p>
                    <p className="text-sm text-muted-foreground">For</p>
                  </div>
                  <div className="p-4 rounded-lg bg-red-500/10 text-center">
                    <p className="text-red-500 text-2xl font-bold">{formatVotes(selectedProposal.votesAgainst)}</p>
                    <p className="text-sm text-muted-foreground">Against</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted text-center">
                    <p className="text-2xl font-bold">{formatVotes(selectedProposal.votesAbstain)}</p>
                    <p className="text-sm text-muted-foreground">Abstain</p>
                  </div>
                </div>
              </div>
              
              {/* Vote buttons */}
              {selectedProposal.status === 'active' && !selectedProposal.userVote && (
                <div className="flex gap-3">
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => onVote?.(selectedProposal.id, 'for')}
                  >
                    Vote For
                  </Button>
                  <Button 
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    onClick={() => onVote?.(selectedProposal.id, 'against')}
                  >
                    Vote Against
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => onVote?.(selectedProposal.id, 'abstain')}
                  >
                    Abstain
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
  
  // Filter proposals
  const filteredProposals = statusFilter === 'all' 
    ? proposals 
    : proposals.filter(p => p.status === statusFilter);
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span>🗳️</span>
          Governance
        </h1>
        {isConnected && (
          <Button onClick={onCreateProposal} className="gap-2">
            <span>➕</span>
            Create Proposal
          </Button>
        )}
      </div>
      
      {/* Trust Badges */}
      {renderTrustBadges?.()}
      
      {/* Stats */}
      <StatsBar stats={stats} votingPower={votingPower} />
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => onTabChange?.(v as GovernanceTab)}>
        <TabsList>
          <TabsTrigger value="proposals" className="gap-2">
            <span>📋</span> Proposals
          </TabsTrigger>
          <TabsTrigger value="delegation" className="gap-2">
            <span>👥</span> Delegation
          </TabsTrigger>
          <TabsTrigger value="treasury" className="gap-2">
            <span>🏦</span> Treasury
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="proposals" className="space-y-4 mt-4">
          {/* Status filter */}
          <div className="flex items-center gap-2">
            {(['all', 'active', 'passed', 'failed'] as const).map(status => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onStatusFilterChange?.(status)}
              >
                {status === 'all' ? 'All' : getStatusLabel(status as ProposalStatus)}
              </Button>
            ))}
          </div>
          
          {/* Proposals list */}
          {filteredProposals.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl mb-4 block">📋</span>
              <p className="text-muted-foreground">No proposals found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProposals.map(proposal => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  onClick={() => onSelectProposal?.(proposal)}
                  onVote={(choice) => onVote?.(proposal.id, choice)}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="delegation" className="mt-4">
          {renderDelegationManager?.() || (
            <div className="text-center py-12">
              <span className="text-4xl mb-4 block">👥</span>
              <p className="text-muted-foreground">Delegation manager not configured</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="treasury" className="mt-4">
          {renderTreasury?.() || (
            <div className="text-center py-12">
              <span className="text-4xl mb-4 block">🏦</span>
              <p className="text-muted-foreground">Treasury view not configured</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Create Proposal Form (modal) */}
      {renderCreateForm?.()}
    </div>
  );
}

export default GovernancePageTemplate;
