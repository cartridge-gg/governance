import { indexAddress } from "./utils";

const POSTGREST_URL =
  import.meta.env.VITE_POSTGREST_URL || "http://localhost:3000";

// Helper function to convert decimal string to 64-character padded hex
function toHex64(decimal: string | number | bigint): string {
  const hex = BigInt(decimal).toString(16);
  return '0x' + hex.padStart(64, '0');
}

// Helper function to convert hex back to decimal string
export function hexToDecimal(hex: string): string {
  return BigInt(hex).toString();
}

// Helper function to fetch from PostgREST
async function fetchAPI<T = any>(
  endpoint: string,
  params?: Record<string, string>
): Promise<T> {
  const url = new URL(endpoint, POSTGREST_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      Prefer: "return=representation",
    },
  });

  if (!response.ok) {
    throw new Error(`PostgREST error: ${response.statusText}`);
  }

  return response.json();
}

// Governance Queries

export async function getProposals() {
  return fetchAPI<
    Array<{
      proposal_id: string;
      proposer: string;
      vote_start: string;
      vote_end: string;
      description: string;
      event_id: string;
    }>
  >("/proposals_api", {
    order: "event_id.desc",
  });
}

export async function getProposalById(proposalId: string) {
  const proposals = await fetchAPI<
    Array<{
      proposal_id: string;
      proposer: string;
      vote_start: string;
      vote_end: string;
      description: string;
    }>
  >("/proposals_api", {
    proposal_id: `eq.${proposalId}`,
  });

  return proposals[0] || null;
}

export async function getProposalCalls(proposalId: string) {
  return fetchAPI<
    Array<{
      call_index: number;
      to_address: string;
      selector: string;
      calldata: string[];
    }>
  >("/proposal_calls_api", {
    proposal_id: `eq.${proposalId}`,
    order: "call_index.asc",
  });
}

export async function getVotesForProposal(proposalId: string) {
  return fetchAPI<
    Array<{
      voter: string;
      support: number;
      weight: string;
      reason: string;
      params: string[] | null;
    }>
  >("/votes_api", {
    proposal_id: `eq.${proposalId}`,
    order: "event_id.desc",
  });
}

export async function getProposalQueued(proposalId: string) {
  const results = await fetchAPI<
    Array<{
      proposal_id: string;
      eta_seconds: string;
      event_id: string;
    }>
  >("/proposal_queued", {
    proposal_id: `eq.${proposalId}`,
  });

  return results[0] || null;
}

export async function getProposalExecuted(proposalId: string) {
  const results = await fetchAPI<
    Array<{
      proposal_id: string;
      event_id: string;
    }>
  >("/proposal_executed", {
    proposal_id: `eq.${proposalId}`,
  });

  return results[0] || null;
}

export async function getVotesByVoter(voterAddress: string) {
  return fetchAPI<
    Array<{
      proposal_id: string;
      support: number;
      weight: string;
      reason: string;
    }>
  >("/votes_api", {
    voter_hex: `eq.${indexAddress(voterAddress)}`,
    order: "event_id.desc",
    select: "proposal_id,support,weight,reason",
  });
}

export async function getCurrentDelegations() {
  return fetchAPI<
    Array<{
      delegator: string;
      current_delegate: string;
      delegator_hex: string;
      current_delegate_hex: string;
    }>
  >("/current_delegations_view");
}

export async function getDelegationByAddress(address: string) {
  const results = await fetchAPI<
    Array<{
      delegator: string;
      current_delegate: string;
      delegator_hex: string;
      current_delegate_hex: string;
    }>
  >("/current_delegations_view", {
    delegator_hex: `eq.${indexAddress(address)}`,
  });

  return results[0] || null;
}

export async function getTopDelegates(limit: number = 10, offset: number = 0, minVotes: string = "1000000000000000000") {
  return fetchAPI<
    Array<{
      delegate: string;
      current_votes: string;
      delegate_hex: string;
    }>
  >("/current_delegate_votes_view", {
    current_votes: `gte.${toHex64(minVotes)}`,
    order: "current_votes.desc",
    limit: limit.toString(),
    offset: offset.toString(),
  });
}

export async function getDelegateVotingPower(delegateAddress: string) {
  const results = await fetchAPI<
    Array<{
      delegate: string;
      current_votes: string;
      delegate_hex: string;
    }>
  >("/current_delegate_votes_view", {
    delegate_hex: `eq.${indexAddress(delegateAddress)}`,
  });

  return results[0] || null;
}

export async function getTotalDelegatedVotes() {
  const results = await fetchAPI<
    Array<{
      total_votes: string;
    }>
  >("/total_delegated_votes_view");

  return results[0]?.total_votes || "0";
}

// Ticket Purchase Stats

export async function getTicketPurchaseStats() {
  const results = await fetchAPI<
    Array<{
      total_purchases: number;
      total_volume_usd: number;
      avg_purchase_usd: number;
      min_purchase_usd: number;
      max_purchase_usd: number;
      unique_buyers: number;
      first_purchase_time: string;
      last_purchase_time: string;
    }>
  >("/ticket_purchase_stats_api");

  return results[0] || null;
}

export async function getTicketPurchasesDaily(limit: number = 30) {
  return fetchAPI<
    Array<{
      day: string;
      purchases: number;
      volume_usd: number;
      avg_purchase_usd: number;
      unique_buyers: number;
    }>
  >("/ticket_purchases_daily_api", {
    order: "day.desc",
    limit: limit.toString(),
  });
}

export async function getRecentTicketPurchases(limit: number = 100) {
  return fetchAPI<
    Array<{
      event_id: string;
      block_number: number;
      block_time: string;
      transaction_hash: string;
      transaction_hash_hex: string;
      locker: string;
      locker_hex: string;
      token0: string;
      token0_hex: string;
      token1: string;
      token1_hex: string;
      token0_symbol: string;
      token1_symbol: string;
      delta0: string;
      delta1: string;
      delta0_decimal: number;
      delta1_decimal: number;
      token0_price_usd: number;
      token1_price_usd: number;
      delta0_usd: number;
      delta1_usd: number;
      swap_value_usd: number;
    }>
  >("/swaps_with_usd_api", {
    or: "(token0_symbol.eq.TICKET,token1_symbol.eq.TICKET)",
    order: "block_time.desc",
    limit: limit.toString(),
  });
}

export async function getTicketPurchasesByAddress(
  address: string,
  limit: number = 100
) {
  return fetchAPI<
    Array<{
      event_id: string;
      block_number: number;
      block_time: string;
      transaction_hash: string;
      transaction_hash_hex: string;
      locker: string;
      locker_hex: string;
      token0_symbol: string;
      token1_symbol: string;
      delta0_decimal: number;
      delta1_decimal: number;
      swap_value_usd: number;
    }>
  >("/swaps_with_usd_api", {
    or: "(token0_symbol.eq.TICKET,token1_symbol.eq.TICKET)",
    locker_hex: `eq.${indexAddress(address)}`,
    order: "block_time.desc",
    limit: limit.toString(),
  });
}
