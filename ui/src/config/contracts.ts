// Contract configuration
// Update these addresses after deploying your contracts

export const contracts = {
  // Starknet network to use
  network: "sepolia" as "sepolia" | "mainnet",

  // Contract addresses - Replace with your deployed contract addresses
  governor: {
    // Replace with your deployed governor contract address
    address: "0x" + "0".repeat(64),
    // Add the full ABI here after contract compilation
    abi: [],
  },

  // Token contract that provides voting power
  token: {
    // Replace with your deployed token contract address
    address: "0x" + "0".repeat(64),
    abi: [],
  },

  // Timelock controller contract
  timelock: {
    // Replace with your deployed timelock contract address
    address: "0x" + "0".repeat(64),
    abi: [],
  },

  // Governance parameters (from your Cairo contract)
  parameters: {
    // votingDelay: 3600, // 1 hour
    // votingPeriod: 432000, // 5 days
    // proposalThreshold: "50000000000000000000000", // 50k tokens with 18 decimals
    // quorumNumerator: 300, // 30%
    votingDelay: 5 * 60, // 5 minutes
    votingPeriod: 10 * 60, // 10 minutes
    proposalThreshold: "50000000000000000000000", // 50k tokens with 18 decimals
    quorumNumerator: 300, // 30%
  },
};