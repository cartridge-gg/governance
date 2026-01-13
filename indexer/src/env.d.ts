declare namespace NodeJS {
  export interface ProcessEnv {
    LOG_LEVEL: string;

    // Governance contracts
    GOVERNOR_ADDRESS: `0x${string}`;
    VOTES_TOKEN_ADDRESS: `0x${string}`;

    STARTING_CURSOR_BLOCK_NUMBER: string;

    NETWORK: "mainnet" | "sepolia" | string;

    APIBARA_URL: string;
    DNA_TOKEN: string;

    PG_CONNECTION_STRING: string;

    NO_BLOCKS_TIMEOUT_MS: string; // Time in milliseconds before exiting if no blocks are received

    // Token metadata for price calculations (JSON array)
    TOKEN_METADATA?: string;
  }
}
