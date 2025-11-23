import { mainnetTokens } from "./mainnetTokens";

/**
 * Format token amount from wei (with decimals) to human-readable format
 * Examples:
 * - formatTokenAmount("1000000000000000000", 18, 2) => "1"
 * - formatTokenAmount("1500000000000000000", 18, 2) => "1.5"
 * - formatTokenAmount("1234567890000000000000000", 18, 2) => "1,234,567.89"
 *
 * @param amount - The amount in wei (as string or bigint)
 * @param decimals - Number of decimals (default 18)
 * @param displayDecimals - Number of decimals to display (default 2)
 * @returns Formatted string with commas
 */
export function formatTokenAmount(
  amount: string | bigint,
  decimals: number = 18,
  displayDecimals: number = 2
): string {
  try {
    // Convert hex strings (0x...) to BigInt, otherwise convert normally
    const amountBigInt = typeof amount === "string"
      ? (amount.startsWith("0x") ? BigInt(amount) : BigInt(amount))
      : amount;

    // Divide by 10^decimals to get the actual value
    const divisor = BigInt(10 ** decimals);
    const wholePart = amountBigInt / divisor;
    const fractionalPart = amountBigInt % divisor;

    // Convert to string with decimals
    const fractionalStr = fractionalPart
      .toString()
      .padStart(decimals, "0")
      .slice(0, displayDecimals);

    // Add commas to whole part
    const wholeStr = wholePart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // If no decimals to display or fractional part is 0, return just whole part
    if (displayDecimals === 0 || fractionalPart === BigInt(0)) {
      return wholeStr;
    }

    // Remove trailing zeros from fractional part
    const trimmedFractional = fractionalStr.replace(/0+$/, "");

    if (trimmedFractional === "") {
      return wholeStr;
    }

    return `${wholeStr}.${trimmedFractional}`;
  } catch (error) {
    console.error("Error formatting token amount:", error);
    return "0";
  }
}

/**
 * Format voting power (votes) - always uses 18 decimals with 0 display decimals
 * @param amount - The amount in wei (as string or bigint)
 * @returns Formatted string with commas and no decimals (e.g., "1,234,567")
 */
export function formatVotingPower(amount: string | bigint): string {
  return formatTokenAmount(amount, 18, 0);
}

/**
 * Format token amount with K, M, B suffixes for large numbers
 * @param amount - The amount in wei (as string)
 * @param decimals - Number of decimals (default 18)
 * @returns Formatted string with suffix (e.g., "1.5M")
 */
export function formatTokenAmountCompact(
  amount: string | bigint,
  decimals: number = 18
): string {
  try {
    // Convert hex strings (0x...) to BigInt, otherwise convert normally
    const amountBigInt = typeof amount === "string"
      ? (amount.startsWith("0x") ? BigInt(amount) : BigInt(amount))
      : amount;
    const divisor = BigInt(10 ** decimals);
    const value = Number(amountBigInt) / Number(divisor);

    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(2)}B`;
    }
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(2)}M`;
    }
    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(2)}K`;
    }

    return value.toFixed(2);
  } catch (error) {
    console.error("Error formatting compact token amount:", error);
    return "0";
  }
}

/**
 * Parse user input to wei (with decimals)
 * @param input - User input string (e.g., "1.5")
 * @param decimals - Number of decimals (default 18)
 * @returns Amount in wei as string
 */
export function parseTokenAmount(input: string, decimals: number = 18): string {
  try {
    // Remove commas and whitespace
    const cleanInput = input.replace(/[,\s]/g, "");

    if (!cleanInput || cleanInput === ".") {
      return "0";
    }

    const parts = cleanInput.split(".");
    const wholePart = parts[0] || "0";
    const fractionalPart = (parts[1] || "")
      .padEnd(decimals, "0")
      .slice(0, decimals);

    const amountStr = wholePart + fractionalPart;
    return BigInt(amountStr).toString();
  } catch (error) {
    console.error("Error parsing token amount:", error);
    return "0";
  }
}

/**
 * Find token by address from mainnetTokens
 * @param address - Token address (can be hex string or bigint)
 * @returns Token info or null if not found
 */
export function findTokenByAddress(address: string | bigint) {
  // Normalize address to lowercase hex string
  let normalizedAddress: string;
  if (typeof address === "bigint") {
    normalizedAddress = "0x" + address.toString(16).padStart(64, "0");
  } else {
    // Remove 0x prefix if present, pad to 64 chars, add 0x back
    const hex = address.toLowerCase().replace(/^0x/, "");
    normalizedAddress = "0x" + hex.padStart(64, "0");
  }

  return (
    mainnetTokens.find((token: any) => {
      const tokenAddress = token.l2_token_address
        .toLowerCase()
        .replace(/^0x/, "");
      const paddedTokenAddress = "0x" + tokenAddress.padStart(64, "0");
      return paddedTokenAddress === normalizedAddress;
    }) || null
  );
}
