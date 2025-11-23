import {
  combineParsers,
  parseAddress,
  parseU256,
} from "../parse";
import type { GetParserType } from "../parse";

// DelegateChanged event
export const parseDelegateChangedEvent = combineParsers({
  delegator: { index: 0, parser: parseAddress },
  from_delegate: { index: 1, parser: parseAddress },
  to_delegate: { index: 2, parser: parseAddress },
});
export type DelegateChangedEvent = GetParserType<
  typeof parseDelegateChangedEvent
>;

// DelegateVotesChanged event
export const parseDelegateVotesChangedEvent = combineParsers({
  delegate: { index: 0, parser: parseAddress },
  previous_votes: { index: 1, parser: parseU256 },
  new_votes: { index: 2, parser: parseU256 },
});
export type DelegateVotesChangedEvent = GetParserType<
  typeof parseDelegateVotesChangedEvent
>;
