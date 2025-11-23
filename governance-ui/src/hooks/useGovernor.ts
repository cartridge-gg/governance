import { Contract, hash } from "starknet";
import { useAccount, useProvider } from "@starknet-react/core";
import GOVERNOR_ABI from "@/lib/abis/governor";
import { type Call } from "starknet";
import { GOVERNOR_ADDRESS } from "@/lib/constants";

// Vote types as const object
export const VoteType = {
  Against: 0,
  For: 1,
  Abstain: 2,
} as const;

export type VoteType = (typeof VoteType)[keyof typeof VoteType];

// Proposal states as const object
export const ProposalState = {
  Pending: 0,
  Active: 1,
  Canceled: 2,
  Defeated: 3,
  Succeeded: 4,
  Queued: 5,
  Expired: 6,
  Executed: 7,
} as const;

export type ProposalState = (typeof ProposalState)[keyof typeof ProposalState];

export function useGovernor() {
  const { account } = useAccount();
  const { provider } = useProvider();

  const initializeContract = () => {
    if (!account && !provider) {
      throw new Error("No account or provider available");
    }

    return new Contract({
      abi: GOVERNOR_ABI,
      address: GOVERNOR_ADDRESS,
      providerOrAccount: account || provider,
    });
  };

  const createProposal = async (calls: Call[], description: string) => {
    if (!account) {
      throw new Error("Wallet not connected");
    }

    const contract = initializeContract();

    try {
      // Transform Starknet.js Call format to Cairo Call format
      // Starknet.js uses: { contractAddress, entrypoint, calldata }
      // Cairo expects: { to, selector, calldata }
      const transformedCalls = calls.map((call) => ({
        to: call.contractAddress,
        selector: hash.getSelectorFromName(call.entrypoint),
        calldata: call.calldata || [],
      }));

      const call = contract.populate("propose", [
        transformedCalls,
        description,
      ]);

      const tx = await account.execute({
        contractAddress: contract.address,
        entrypoint: "propose",
        calldata: call.calldata,
      });

      await provider.waitForTransaction(tx.transaction_hash);
      return tx.transaction_hash;
    } catch (error) {
      console.error("Failed to create proposal:", error);
      throw error;
    }
  };

  const castVote = async (proposalId: string, support: VoteType) => {
    if (!account) {
      throw new Error("Wallet not connected");
    }

    const contract = initializeContract();

    try {
      const call = contract.populate("cast_vote", [proposalId, support]);

      const tx = await account.execute({
        contractAddress: contract.address,
        entrypoint: "cast_vote",
        calldata: call.calldata,
      });

      await provider.waitForTransaction(tx.transaction_hash);
      return tx.transaction_hash;
    } catch (error) {
      console.error("Failed to cast vote:", error);
      throw error;
    }
  };

  const getProposalState = async (
    proposalId: string
  ): Promise<ProposalState> => {
    const contract = initializeContract();

    try {
      // proposal_id is a felt, so just pass it directly
      const state = await contract.state(proposalId);
      return Number(state) as ProposalState;
    } catch (error) {
      console.error("Failed to get proposal state:", error);
      throw error;
    }
  };

  const queueProposal = async (calls: Call[], descriptionHash: string) => {
    if (!account) {
      throw new Error("Wallet not connected");
    }

    try {
      // Transform Starknet.js Call format to Cairo Call format
      // If entrypoint looks like a hex selector (starts with 0x and is long), use it directly
      // Otherwise compute the selector from the entrypoint name
      const transformedCalls = calls.map((call) => ({
        to: call.contractAddress,
        selector:
          call.entrypoint.startsWith("0x") && call.entrypoint.length > 20
            ? call.entrypoint
            : hash.getSelectorFromName(call.entrypoint),
        calldata: call.calldata || [],
      }));

      const contract = new Contract({
        abi: GOVERNOR_ABI,
        address: GOVERNOR_ADDRESS,
        providerOrAccount: account || provider,
      });

      const call = contract.populate("queue", [
        transformedCalls,
        descriptionHash,
      ]);

      const tx = await account.execute({
        contractAddress: GOVERNOR_ADDRESS,
        entrypoint: "queue",
        calldata: call.calldata,
      });

      await provider.waitForTransaction(tx.transaction_hash);
      return tx.transaction_hash;
    } catch (error) {
      console.error("Failed to queue proposal:", error);
      throw error;
    }
  };

  const executeProposal = async (calls: Call[], descriptionHash: string) => {
    if (!account) {
      throw new Error("Wallet not connected");
    }

    try {
      // Transform Starknet.js Call format to Cairo Call format
      // If entrypoint looks like a hex selector (starts with 0x and is long), use it directly
      // Otherwise compute the selector from the entrypoint name
      const transformedCalls = calls.map((call) => ({
        to: call.contractAddress,
        selector:
          call.entrypoint.startsWith("0x") && call.entrypoint.length > 20
            ? call.entrypoint
            : hash.getSelectorFromName(call.entrypoint),
        calldata: call.calldata || [],
      }));

      const contract = new Contract({
        abi: GOVERNOR_ABI,
        address: GOVERNOR_ADDRESS,
        providerOrAccount: account || provider,
      });

      const call = contract.populate("execute", [
        transformedCalls,
        descriptionHash,
      ]);

      const tx = await account.execute({
        contractAddress: GOVERNOR_ADDRESS,
        entrypoint: "execute",
        calldata: call.calldata,
      });

      await provider.waitForTransaction(tx.transaction_hash);
      return tx.transaction_hash;
    } catch (error) {
      console.error("Failed to execute proposal:", error);
      throw error;
    }
  };

  return {
    createProposal,
    castVote,
    getProposalState,
    queueProposal,
    executeProposal,
  };
}
