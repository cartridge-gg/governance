import {
  combineParsers,
  parseAddress,
  parseBoolean,
  parseI129,
  parseU128,
  parseU256,
} from "../parse";
import type { GetParserType } from "../parse";

export const parsePoolKey = combineParsers({
  token0: { index: 0, parser: parseAddress },
  token1: { index: 1, parser: parseAddress },
  fee: { index: 2, parser: parseU128 },
  tick_spacing: { index: 3, parser: parseU128 },
  extension: { index: 4, parser: parseAddress },
});
export type PoolKey = GetParserType<typeof parsePoolKey>;
export const parseDelta = combineParsers({
  amount0: { index: 0, parser: parseI129 },
  amount1: { index: 1, parser: parseI129 },
});
const parseSwapParameters = combineParsers({
  amount: { index: 0, parser: parseI129 },
  is_token1: { index: 1, parser: parseBoolean },
  sqrt_ratio_limit: { index: 2, parser: parseU256 },
  skip_ahead: { index: 3, parser: parseU128 },
});
export const parseSwappedEvent = combineParsers({
  locker: { index: 0, parser: parseAddress },
  pool_key: { index: 1, parser: parsePoolKey },
  params: { index: 2, parser: parseSwapParameters },
  delta: { index: 3, parser: parseDelta },
  sqrt_ratio_after: { index: 4, parser: parseU256 },
  tick_after: { index: 5, parser: parseI129 },
  liquidity_after: { index: 6, parser: parseU128 },
});
export type SwappedEvent = GetParserType<typeof parseSwappedEvent>;
