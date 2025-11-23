import {
  combineParsers,
  parseAddress,
  parseByteArray,
  parseFelt252,
  parseSpanOf,
  parseU256,
  parseU64,
  parseU8,
} from "../parse";
import type { GetParserType } from "../parse";

export const parseCall = combineParsers({
  to: { index: 0, parser: parseAddress },
  selector: { index: 1, parser: parseFelt252 },
  calldata: { index: 2, parser: parseSpanOf(parseFelt252) },
});
export type CallType = GetParserType<typeof parseCall>;

// ProposalCreated event
export const parseProposalCreatedEvent = combineParsers({
  proposal_id: { index: 0, parser: parseFelt252 },
  proposer: { index: 1, parser: parseAddress },
  calls: { index: 2, parser: parseSpanOf(parseCall) },
  signatures: { index: 3, parser: parseSpanOf(parseSpanOf(parseFelt252)) },
  vote_start: { index: 4, parser: parseU64 },
  vote_end: { index: 5, parser: parseU64 },
  description: { index: 6, parser: parseByteArray },
});
export type ProposalCreatedEvent = GetParserType<
  typeof parseProposalCreatedEvent
>;

// ProposalQueued event
export const parseProposalQueuedEvent = combineParsers({
  proposal_id: { index: 0, parser: parseFelt252 },
  eta_seconds: { index: 1, parser: parseU64 },
});
export type ProposalQueuedEvent = GetParserType<
  typeof parseProposalQueuedEvent
>;

// ProposalExecuted event
export const parseProposalExecutedEvent = combineParsers({
  proposal_id: { index: 0, parser: parseFelt252 },
});
export type ProposalExecutedEvent = GetParserType<
  typeof parseProposalExecutedEvent
>;

// ProposalCanceled event
export const parseProposalCanceledEvent = combineParsers({
  proposal_id: { index: 0, parser: parseFelt252 },
});
export type ProposalCanceledEvent = GetParserType<
  typeof parseProposalCanceledEvent
>;

// VoteCast event
export const parseVoteCastEvent = combineParsers({
  voter: { index: 0, parser: parseAddress },
  proposal_id: { index: 1, parser: parseFelt252 },
  support: { index: 2, parser: parseU8 },
  weight: { index: 3, parser: parseU256 },
  reason: { index: 4, parser: parseByteArray },
});
export type VoteCastEvent = GetParserType<typeof parseVoteCastEvent>;

// VoteCastWithParams event
export const parseVoteCastWithParamsEvent = combineParsers({
  voter: { index: 0, parser: parseAddress },
  proposal_id: { index: 1, parser: parseFelt252 },
  support: { index: 2, parser: parseU8 },
  weight: { index: 3, parser: parseU256 },
  reason: { index: 4, parser: parseByteArray },
  params: { index: 5, parser: parseSpanOf(parseFelt252) },
});
export type VoteCastWithParamsEvent = GetParserType<
  typeof parseVoteCastWithParamsEvent
>;
