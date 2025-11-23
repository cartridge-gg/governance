import { VoteType } from "@/hooks/useGovernor";

/**
 * Proposal status types
 */
export type ProposalStatus =
  | "active"
  | "succeeded"
  | "failed"
  | "pending"
  | "executed"
  | "quorum_not_met";

/**
 * Calculate vote totals from a list of votes
 */
export function calculateVoteTotals(votes: Array<{ support: number; weight: string }>) {
  let forTotal = BigInt(0);
  let againstTotal = BigInt(0);
  let abstainTotal = BigInt(0);

  votes.forEach((vote) => {
    const weight = BigInt(vote.weight);
    if (vote.support === VoteType.For) {
      forTotal += weight;
    } else if (vote.support === VoteType.Against) {
      againstTotal += weight;
    } else if (vote.support === VoteType.Abstain) {
      abstainTotal += weight;
    }
  });

  return {
    forTotal,
    againstTotal,
    abstainTotal,
    totalVotes: forTotal + againstTotal + abstainTotal,
  };
}

/**
 * Determine proposal status based on timestamps, quorum, and vote outcome
 */
export function determineProposalStatus(params: {
  voteStart: number;
  voteEnd: number;
  forTotal: bigint;
  againstTotal: bigint;
  abstainTotal: bigint;
  totalSupply: bigint;
  quorumPercentage?: number;
}): ProposalStatus {
  const {
    voteStart,
    voteEnd,
    forTotal,
    againstTotal,
    abstainTotal,
    totalSupply,
    quorumPercentage = 30, // Default 30% quorum
  } = params;

  const now = Math.floor(Date.now() / 1000);
  const totalVotes = forTotal + againstTotal + abstainTotal;

  // Pending: voting hasn't started yet
  if (now < voteStart) {
    return "pending";
  }

  // Active: voting is currently open
  if (now >= voteStart && now <= voteEnd) {
    return "active";
  }

  // Vote has ended - check quorum and outcome
  if (now > voteEnd) {
    if (totalSupply === 0n) {
      // If we don't have total supply data, default to failed
      return "failed";
    }

    const quorumRequired = (totalSupply * BigInt(quorumPercentage)) / 100n;

    // Check if quorum was met
    if (totalVotes < quorumRequired) {
      return "quorum_not_met";
    }

    // Quorum met - check vote outcome
    if (forTotal > againstTotal) {
      return "succeeded";
    } else {
      return "failed";
    }
  }

  return "pending";
}
