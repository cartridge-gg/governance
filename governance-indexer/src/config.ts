import { config } from "dotenv";

config({ path: `./.env.local` });
config({ path: `./.env.${process.env.NETWORK}.local` });
config({ path: `./.env.${process.env.NETWORK}` });
config({ path: `./.env` });

// Token metadata configuration for price calculations
export interface TokenMetadata {
  address: string; // Hex address starting with 0x
  symbol: string;
  decimals: number;
}

/**
 * Parse token metadata from environment variable
 * Expected format: JSON array of objects with address, symbol, and decimals
 * Example: [{"address":"0x075afe...","symbol":"EKUBO","decimals":18},{"address":"0x053c91...","symbol":"USDC","decimals":6}]
 */
export function getTokenMetadataConfig(): TokenMetadata[] {
  const tokenConfigStr = process.env.TOKEN_METADATA;

  if (!tokenConfigStr) {
    console.warn("TOKEN_METADATA not configured. Price calculations will not work until tokens are configured.");
    return [];
  }

  try {
    const tokens = JSON.parse(tokenConfigStr) as TokenMetadata[];

    // Validate the configuration
    for (const token of tokens) {
      if (!token.address || !token.symbol || token.decimals === undefined) {
        throw new Error(`Invalid token metadata: ${JSON.stringify(token)}. Must have address, symbol, and decimals.`);
      }
      if (!token.address.startsWith("0x")) {
        throw new Error(`Token address must start with 0x: ${token.address}`);
      }
    }

    return tokens;
  } catch (error) {
    console.error("Failed to parse TOKEN_METADATA:", error);
    throw new Error(`Invalid TOKEN_METADATA configuration: ${error instanceof Error ? error.message : String(error)}`);
  }
}
