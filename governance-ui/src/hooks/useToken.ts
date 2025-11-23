import { Contract, uint256 } from "starknet";
import { useAccount, useProvider } from "@starknet-react/core";
import TOKEN_ABI from "@/lib/abis/token";
import { TOKEN_ADDRESS } from "@/lib/constants";
import { formatTokenAmount } from "@/lib/utils/tokenUtils";

export function useToken() {
  const { account, address } = useAccount();
  const { provider } = useProvider();

  const initializeContract = () => {
    if (!account && !provider) {
      throw new Error("No account or provider available");
    }

    if (TOKEN_ADDRESS === "0x" + "0".repeat(64)) {
      throw new Error("Token address not configured");
    }

    return new Contract({
      abi: TOKEN_ABI,
      address: TOKEN_ADDRESS,
      providerOrAccount: account || provider,
    });
  };

  /**
   * Get the current voting power of an account
   * @param accountAddress - Optional address to query (defaults to connected wallet)
   * @param formatted - Whether to format the output with decimals and commas (default true)
   */
  const getVotes = async (
    accountAddress?: string,
    formatted: boolean = true
  ): Promise<string> => {
    const targetAddress = accountAddress || address;
    if (!targetAddress) {
      throw new Error("No address provided");
    }

    const contract = initializeContract();

    try {
      const votes = await contract.get_votes(targetAddress);
      const votesStr = uint256.uint256ToBN(votes).toString();
      return formatted ? formatTokenAmount(votesStr, 18, 2) : votesStr;
    } catch (error) {
      console.error("Failed to get votes:", error);
      throw error;
    }
  };

  /**
   * Get the voting power of an account at a specific timepoint
   * @param formatted - Whether to format the output with decimals and commas (default true)
   */
  const getPastVotes = async (
    accountAddress: string,
    timepoint: number,
    formatted: boolean = true
  ): Promise<string> => {
    const contract = initializeContract();

    try {
      const votes = await contract.get_past_votes(accountAddress, timepoint);
      const votesStr = uint256.uint256ToBN(votes).toString();
      return formatted ? formatTokenAmount(votesStr, 18, 2) : votesStr;
    } catch (error) {
      console.error("Failed to get past votes:", error);
      throw error;
    }
  };

  /**
   * Get the total supply at a specific timepoint
   * @param formatted - Whether to format the output with decimals and commas (default true)
   */
  const getPastTotalSupply = async (
    timepoint: number,
    formatted: boolean = true
  ): Promise<string> => {
    const contract = initializeContract();

    try {
      const totalSupply = await contract.get_past_total_supply(timepoint);
      const supplyStr = uint256.uint256ToBN(totalSupply).toString();
      return formatted ? formatTokenAmount(supplyStr, 18, 2) : supplyStr;
    } catch (error) {
      console.error("Failed to get past total supply:", error);
      throw error;
    }
  };

  /**
   * Get the delegate of an account
   */
  const getDelegates = async (accountAddress?: string): Promise<string> => {
    const targetAddress = accountAddress || address;
    if (!targetAddress) {
      throw new Error("No address provided");
    }

    const contract = initializeContract();

    try {
      const delegate = await contract.delegates(targetAddress);
      // Convert BigInt to hex string if needed
      const delegateStr = typeof delegate === 'bigint'
        ? '0x' + delegate.toString(16).padStart(64, '0')
        : delegate.toString();
      return delegateStr;
    } catch (error) {
      console.error("Failed to get delegate:", error);
      throw error;
    }
  };

  /**
   * Delegate voting power to another address
   */
  const delegate = async (delegatee: string) => {
    if (!account) {
      throw new Error("Wallet not connected");
    }

    const contract = initializeContract();

    try {
      const tx = await contract.delegate(delegatee);
      await provider.waitForTransaction(tx.transaction_hash);
      return tx.transaction_hash;
    } catch (error) {
      console.error("Failed to delegate:", error);
      throw error;
    }
  };

  /**
   * Get the token balance of an account
   * @param accountAddress - Optional address to query (defaults to connected wallet)
   * @param formatted - Whether to format the output with decimals and commas (default true)
   */
  const balanceOf = async (
    accountAddress?: string,
    formatted: boolean = true
  ): Promise<string> => {
    const targetAddress = accountAddress || address;
    if (!targetAddress) {
      throw new Error("No address provided");
    }

    const contract = initializeContract();

    try {
      const balance = await contract.balance_of(targetAddress);
      const balanceStr = uint256.uint256ToBN(balance).toString();
      return formatted ? formatTokenAmount(balanceStr, 18, 2) : balanceStr;
    } catch (error) {
      console.error("Failed to get balance:", error);
      throw error;
    }
  };

  /**
   * Get the total supply of tokens
   * @param formatted - Whether to format the output with decimals and commas (default true)
   */
  const totalSupply = async (formatted: boolean = true): Promise<string> => {
    const contract = initializeContract();

    try {
      const supply = await contract.total_supply();
      const supplyStr = uint256.uint256ToBN(supply).toString();
      return formatted ? formatTokenAmount(supplyStr, 18, 2) : supplyStr;
    } catch (error) {
      console.error("Failed to get total supply:", error);
      throw error;
    }
  };

  /**
   * Get token name
   */
  const name = async (): Promise<string> => {
    const contract = initializeContract();

    try {
      const tokenName = await contract.name();
      return tokenName;
    } catch (error) {
      console.error("Failed to get token name:", error);
      throw error;
    }
  };

  /**
   * Get token symbol
   */
  const symbol = async (): Promise<string> => {
    const contract = initializeContract();

    try {
      const tokenSymbol = await contract.symbol();
      return tokenSymbol;
    } catch (error) {
      console.error("Failed to get token symbol:", error);
      throw error;
    }
  };

  /**
   * Get token decimals
   */
  const decimals = async (): Promise<number> => {
    const contract = initializeContract();

    try {
      const tokenDecimals = await contract.decimals();
      return Number(tokenDecimals);
    } catch (error) {
      console.error("Failed to get token decimals:", error);
      throw error;
    }
  };

  /**
   * Transfer tokens to another address
   */
  const transfer = async (recipient: string, amount: string) => {
    if (!account) {
      throw new Error("Wallet not connected");
    }

    const contract = initializeContract();

    try {
      const amountUint256 = uint256.bnToUint256(amount);
      const tx = await contract.transfer(recipient, amountUint256);
      await provider.waitForTransaction(tx.transaction_hash);
      return tx.transaction_hash;
    } catch (error) {
      console.error("Failed to transfer:", error);
      throw error;
    }
  };

  return {
    // Voting functions
    getVotes,
    getPastVotes,
    getPastTotalSupply,
    getDelegates,
    delegate,
    // ERC20 functions
    balanceOf,
    totalSupply,
    name,
    symbol,
    decimals,
    transfer,
  };
}
