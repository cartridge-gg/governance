// Contract addresses - Update these with your deployed contract addresses
export const GOVERNOR_ADDRESS =
  "0x243cc8dd3a73d19b42b5d359a11fb6d22b5ab1d240a81f8de292565f10f7655";

// Temporary upgraded governor address for multicall voting
// Set via VITE_UPGRADED_GOVERNOR_ADDRESS environment variable
// Leave empty to disable multicall voting
export const UPGRADED_GOVERNOR_ADDRESS = "";

export const TOKEN_ADDRESS =
  "0x2094aebd7235f213b0159f080a60b387402130071bda6e870f4af9e2f8674b6";

// DAO Treasury address (NUMS DAO)
export const DAO_TREASURY_ADDRESS =
  "0x3f0bff1617cb189e3a0c1adb077c6be5d37dd5fb2f891047acc359544833150";

// Governance parameters
export const GOVERNANCE_PARAMS = {
  PROPOSAL_THRESHOLD: "50,000 tokens",
  // VOTING_DELAY: "1 hour",
  // VOTING_PERIOD: "5 days",
  // QUORUM_REQUIRED: "30%",
  VOTING_DELAY: "5 minutes",
  VOTING_PERIOD: "10 minutes",
  QUORUM_REQUIRED: "30%",
} as const;

// Proposal IDs to hide by default (test proposals)
// Add proposal IDs as strings to this array
export const HIDDEN_PROPOSAL_IDS: string[] = [
  "320530168179864302263662348167184547792720133320875131355752299317931249854",
  "2347451660066214803060244075219873127276851356926557895508237005268790872948",
  "839401748730836358660634017635665970870347091589689784241963966497375262084",
];

// Treasury governance token breakdown
// Initial allocation to DAO treasury
export const GOVERNANCE_TOKEN_INITIAL_ALLOCATION = 1_000_000;

// Custom titles for specific proposal IDs
// Maps proposal ID to a custom display title
export const CUSTOM_PROPOSAL_TITLES: Record<string, string> = {
  "1433524114456312042611743953357569740895908601465234800270746577866087880958":
    "SURVIVOR Liquidity Proposal",
};

// Proposal IDs with invalid calldata that cannot be queued/executed
// These proposals have malformed calldata that will cause execution to fail
export const INVALID_CALLDATA_PROPOSAL_IDS: string[] = [
  "1433524114456312042611743953357569740895908601465234800270746577866087880958",
];
