import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  AlertCircle,
  FileText,
  Code,
  Scroll,
  ArrowRight,
  Coins,
} from "lucide-react";
import { useGovernor } from "@/hooks/useGovernor";
import { useConfetti } from "@/hooks/useConfetti";
import { type Call, uint256 } from "starknet";
import { GOVERNANCE_PARAMS } from "@/lib/constants";
import { mainnetTokens } from "@/lib/utils/mainnetTokens";

export function CreateProposal() {
  const [description, setDescription] = useState("");
  const [calls, setCalls] = useState<Call[]>([]);
  const [isAddingCall, setIsAddingCall] = useState(false);

  // Form state for new call
  const [newCall, setNewCall] = useState<Call>({
    contractAddress: "",
    entrypoint: "",
    calldata: [],
  });
  const [calldataInput, setCalldataInput] = useState("");

  const { createProposal } = useGovernor();
  const { fireConfetti } = useConfetti();

  const parseTransferCalldata = (input: string): string[] => {
    // Expected format: "recipient_address, amount"
    // Transfer calldata needs: [recipient, amount_low, amount_high]
    const parts = input
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v);

    if (parts.length !== 2) {
      throw new Error(
        "Transfer requires 2 parameters: recipient address and amount"
      );
    }

    const [recipient, amountStr] = parts;

    // Convert amount to u256 (low, high parts)
    const amount = uint256.bnToUint256(amountStr);

    return [recipient, amount.low.toString(), amount.high.toString()];
  };

  const addCall = () => {
    if (newCall.contractAddress && newCall.entrypoint) {
      let parsedCalldata: string[];

      try {
        // Special handling for transfer calls
        if (newCall.entrypoint.toLowerCase() === "transfer") {
          parsedCalldata = parseTransferCalldata(calldataInput);
        } else {
          // Default: parse as comma-separated values
          parsedCalldata = calldataInput
            .split(",")
            .map((v) => v.trim())
            .filter((v) => v);
        }

        setCalls([
          ...calls,
          {
            contractAddress: newCall.contractAddress,
            entrypoint: newCall.entrypoint,
            calldata: parsedCalldata,
          },
        ]);
        setNewCall({
          contractAddress: "",
          entrypoint: "",
          calldata: [],
        });
        setCalldataInput("");
        setIsAddingCall(false);
      } catch (error) {
        console.error("Failed to parse calldata:", error);
        alert(
          error instanceof Error ? error.message : "Failed to parse calldata"
        );
      }
    }
  };

  const removeCall = (index: number) => {
    setCalls(calls.filter((_, i) => i !== index));
  };

  const formatAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getTokenInfo = (address: string) => {
    // Normalize addresses for comparison (remove leading zeros, lowercase)
    const normalizeAddress = (addr: string) => {
      return addr.toLowerCase().replace(/^0x0+/, "0x");
    };

    const normalizedAddress = normalizeAddress(address);

    const token = mainnetTokens.find(
      (t) => normalizeAddress(t.l2_token_address) === normalizedAddress
    );

    if (token) {
      return {
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals,
        logo: token.logo_url,
      };
    }

    return {
      name: "Unknown Token",
      symbol: "???",
      decimals: 18,
      logo: undefined,
    };
  };

  const parseTransferDisplay = (call: Call) => {
    if (call.entrypoint.toLowerCase() !== "transfer") return null;

    if (
      !call.calldata ||
      !Array.isArray(call.calldata) ||
      call.calldata.length < 3
    ) {
      return null;
    }

    const recipient = String(call.calldata[0]);
    const amountLow = String(call.calldata[1]);
    const amountHigh = String(call.calldata[2]);

    const tokenInfo = getTokenInfo(call.contractAddress);

    // Reconstruct the u256 amount
    const amount = uint256.uint256ToBN({ low: amountLow, high: amountHigh });

    // Format amount with commas and convert from wei using token's decimals
    const decimals = tokenInfo.decimals;
    const divisor = BigInt(10 ** decimals);
    const amountInTokens = amount / divisor;
    const remainder = amount % divisor;

    // Format with up to 6 decimal places
    const formattedAmount =
      remainder > 0n
        ? `${amountInTokens.toLocaleString()}.${remainder
            .toString()
            .padStart(decimals, "0")
            .slice(0, 6)}`
        : amountInTokens.toLocaleString();

    return {
      recipient,
      amount: formattedAmount,
      tokenName: tokenInfo.name,
      tokenSymbol: tokenInfo.symbol,
      tokenLogo: tokenInfo.logo,
    };
  };

  const handleSubmit = async () => {
    try {
      await createProposal(calls, description);
      // Fire confetti on successful proposal creation!
      fireConfetti();
    } catch (error) {
      console.error("Failed to create proposal:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="main-container">
        <h1 className="text-5xl font-['Cinzel'] font-black text-[#FFE97F] mb-3 glow">
          CREATE PROPOSAL
        </h1>
        <p className="text-gray-400 text-lg">
          Submit a new governance proposal for community voting
        </p>
      </div>

      {/* Description Section */}
      <div className="main-container">
        <div className="flex items-center gap-2 mb-4">
          <Scroll className="h-6 w-6 text-[#FFE97F]" />
          <h2 className="text-2xl font-['Cinzel'] font-bold text-white">
            Proposal Description
          </h2>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Use markdown to provide a detailed description of your proposal
        </p>
        <div className="space-y-2">
          <Textarea
            id="description"
            placeholder={`# Proposal Title

## Summary
Brief overview of what this proposal aims to achieve.`}
            className="min-h-[200px] font-mono text-sm bg-[rgba(0,0,0,0.3)] border-[rgb(8,62,34)] focus:border-[#FFE97F]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Markdown formatting is supported. Use the template above as a guide.
          </p>
        </div>
      </div>

      {/* Execution Calls Section */}
      <div className="main-container">
        <div className="flex items-center gap-2 mb-4">
          <Code className="h-6 w-6 text-[#FFE97F]" />
          <h2 className="text-2xl font-['Cinzel'] font-bold text-white">
            Execution Calls
          </h2>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Define the contract calls that will be executed if this proposal
          passes
        </p>

        <div className="space-y-4">
          {calls.length === 0 && !isAddingCall && (
            <div className="text-center py-12 border-2 border-dashed border-[rgb(8,62,34)] rounded-lg">
              <Code className="h-12 w-12 mx-auto mb-3 text-gray-600" />
              <p className="text-gray-400 mb-4">No execution calls added yet</p>
              <Button
                onClick={() => setIsAddingCall(true)}
                className="btn-gold"
              >
                <Plus className="mr-2 h-4 w-4" />
                ADD CALL
              </Button>
            </div>
          )}

          {calls.map((call, index) => {
            const transferInfo = parseTransferDisplay(call);

            return (
              <div
                key={index}
                className="border border-[rgb(8,62,34)] rounded-lg p-6 bg-[rgba(0,0,0,0.3)] space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Badge className="badge-gold">Call #{index + 1}</Badge>
                    <Badge
                      variant="outline"
                      className="border-[#FFE97F] text-[#FFE97F]"
                    >
                      {call.entrypoint}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCall(index)}
                    className="hover:bg-red-900/20 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {transferInfo ? (
                  // Enhanced transfer call display
                  <div className="space-y-3">
                    {/* Main transfer card */}
                    <div className="relative overflow-hidden rounded-lg border border-[#FFE97F]/40 bg-gradient-to-br from-[rgba(255,233,127,0.15)] to-[rgba(255,233,127,0.05)]">
                      <div className="p-5">
                        <div className="flex items-start gap-4">
                          {/* Token logo with glow effect */}
                          <div className="relative flex-shrink-0">
                            {transferInfo.tokenLogo ? (
                              <div className="relative">
                                <div className="absolute inset-0 bg-[#FFE97F]/20 blur-xl rounded-full"></div>
                                <img
                                  src={transferInfo.tokenLogo}
                                  alt={transferInfo.tokenSymbol}
                                  className="relative h-14 w-14 rounded-full border-2 border-[#FFE97F]/30"
                                />
                              </div>
                            ) : (
                              <div className="relative">
                                <div className="absolute inset-0 bg-[#FFE97F]/20 blur-xl rounded-full"></div>
                                <div className="relative h-14 w-14 rounded-full border-2 border-[#FFE97F]/30 bg-[rgba(0,0,0,0.5)] flex items-center justify-center">
                                  <Coins className="h-7 w-7 text-[#FFE97F]" />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Transfer details */}
                          <div className="flex-1 min-w-0">
                            {/* Token header */}
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
                                Transfer
                              </span>
                              <ArrowRight className="h-3.5 w-3.5 text-[#FFE97F]" />
                              <span className="text-sm text-white font-semibold">
                                {transferInfo.tokenName}
                              </span>
                              <Badge
                                variant="outline"
                                className="border-[#FFE97F] text-[#FFE97F] text-xs px-2 py-0.5 font-mono"
                              >
                                {transferInfo.tokenSymbol}
                              </Badge>
                            </div>

                            {/* Amount display */}
                            <div className="mb-4">
                              <div className="flex items-baseline gap-2">
                                <span className="font-['Cinzel'] text-3xl font-black text-white tracking-tight">
                                  {transferInfo.amount}
                                </span>
                                <span className="font-['Cinzel'] text-lg font-bold text-[#FFE97F]">
                                  {transferInfo.tokenSymbol}
                                </span>
                              </div>
                            </div>

                            {/* Recipient */}
                            <div className="flex items-center gap-2 p-3 bg-[rgba(0,0,0,0.3)] border border-[rgb(8,62,34)] rounded">
                              <div className="flex-1 min-w-0">
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                  Recipient
                                </div>
                                <div className="font-mono text-sm text-[#FFE97F] truncate">
                                  {transferInfo.recipient}
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  navigator.clipboard.writeText(
                                    transferInfo.recipient
                                  )
                                }
                                className="flex-shrink-0 p-1.5 hover:bg-[rgba(255,233,127,0.1)] rounded transition-colors"
                                title="Copy address"
                              >
                                <svg
                                  className="h-4 w-4 text-gray-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Decorative gradient overlay */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFE97F]/5 rounded-full blur-3xl -z-10"></div>
                    </div>

                    {/* Technical details (collapsible) */}
                    <details className="group">
                      <summary className="cursor-pointer text-xs text-gray-500 hover:text-[#FFE97F] uppercase tracking-wider flex items-center gap-2 transition-colors">
                        <Code className="h-3.5 w-3.5" />
                        Technical Details
                        <svg
                          className="h-3 w-3 transition-transform group-open:rotate-180"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </summary>
                      <div className="mt-3 p-4 bg-[rgba(0,0,0,0.3)] border border-[rgb(8,62,34)] rounded space-y-3 text-xs">
                        <div>
                          <span className="text-gray-500 uppercase tracking-wider">
                            Contract Address:
                          </span>
                          <div className="font-mono text-gray-300 break-all mt-1">
                            {call.contractAddress}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500 uppercase tracking-wider">
                            Raw Calldata:
                          </span>
                          <div className="font-mono p-2 bg-[rgba(0,0,0,0.5)] border border-[rgb(8,62,34)] rounded text-gray-400 break-all mt-1">
                            {Array.isArray(call.calldata)
                              ? call.calldata.join(", ")
                              : String(call.calldata || "")}
                          </div>
                        </div>
                      </div>
                    </details>
                  </div>
                ) : (
                  // Standard call display for non-transfer calls
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 uppercase text-xs tracking-wider">
                          Contract:
                        </span>
                        <div className="font-mono mt-1 text-[#FFE97F]">
                          {formatAddress(call.contractAddress)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500 uppercase text-xs tracking-wider">
                          Entrypoint:
                        </span>
                        <div className="font-mono mt-1 text-white">
                          {call.entrypoint}
                        </div>
                      </div>
                    </div>

                    {call.calldata &&
                      Array.isArray(call.calldata) &&
                      call.calldata.length > 0 && (
                        <div className="text-sm">
                          <span className="text-gray-500 uppercase text-xs tracking-wider">
                            Calldata:
                          </span>
                          <div className="font-mono mt-1 p-3 bg-[rgba(0,0,0,0.5)] border border-[rgb(8,62,34)] rounded text-xs break-all text-gray-300">
                            {Array.isArray(call.calldata)
                              ? call.calldata.join(", ")
                              : call.calldata}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
            );
          })}

          {isAddingCall && (
            <div className="border-2 border-[#FFE97F]/50 rounded-lg p-6 space-y-4 bg-[rgba(255,233,127,0.05)]">
              <div className="font-['Cinzel'] font-bold text-lg text-[#FFE97F]">
                New Call
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="contract-address"
                  className="text-gray-300 uppercase text-xs tracking-wider"
                >
                  Contract Address
                </Label>
                <Input
                  id="contract-address"
                  placeholder="0x..."
                  className="bg-[rgba(0,0,0,0.3)] border-[rgb(8,62,34)] focus:border-[#FFE97F]"
                  value={newCall.contractAddress}
                  onChange={(e) =>
                    setNewCall({ ...newCall, contractAddress: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="entrypoint"
                  className="text-gray-300 uppercase text-xs tracking-wider"
                >
                  Function Entrypoint
                </Label>
                <Input
                  id="entrypoint"
                  placeholder="e.g., transfer, approve, mint"
                  className="bg-[rgba(0,0,0,0.3)] border-[rgb(8,62,34)] focus:border-[#FFE97F]"
                  value={newCall.entrypoint}
                  onChange={(e) =>
                    setNewCall({ ...newCall, entrypoint: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="calldata"
                  className="text-gray-300 uppercase text-xs tracking-wider"
                >
                  Calldata (Optional)
                </Label>
                <Textarea
                  id="calldata"
                  placeholder={
                    newCall.entrypoint.toLowerCase() === "transfer"
                      ? "For transfer: recipient_address, amount\nExample: 0x123..., 1000000000000000000"
                      : "Enter comma-separated values for calldata"
                  }
                  className="font-mono text-sm bg-[rgba(0,0,0,0.3)] border-[rgb(8,62,34)] focus:border-[#FFE97F]"
                  value={calldataInput}
                  onChange={(e) => setCalldataInput(e.target.value)}
                />
                {newCall.entrypoint.toLowerCase() === "transfer" && (
                  <p className="text-xs text-[#FFE97F]">
                    Transfer calls will automatically convert the amount to u256
                    format
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={addCall} className="btn-gold">
                  ADD CALL
                </Button>
                <Button
                  variant="outline"
                  className="border-[rgb(8,62,34)] hover:bg-[rgba(255,233,127,0.1)] hover:border-[#FFE97F]"
                  onClick={() => {
                    setIsAddingCall(false);
                    setNewCall({
                      contractAddress: "",
                      entrypoint: "",
                      calldata: [],
                    });
                    setCalldataInput("");
                  }}
                >
                  CANCEL
                </Button>
              </div>
            </div>
          )}

          {calls.length > 0 && !isAddingCall && (
            <Button
              variant="outline"
              className="w-full border-[rgb(8,62,34)] hover:bg-[rgba(255,233,127,0.1)] hover:border-[#FFE97F] hover:text-[#FFE97F]"
              onClick={() => setIsAddingCall(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              ADD ANOTHER CALL
            </Button>
          )}
        </div>
      </div>

      {/* Preview & Submit Section */}
      <div className="main-container">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-6 w-6 text-[#FFE97F]" />
          <h2 className="text-2xl font-['Cinzel'] font-bold text-white">
            Preview & Submit
          </h2>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Review your proposal before submitting it for voting
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-[rgb(8,62,34)] p-6 bg-[rgba(255,233,127,0.05)]">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-[#FFE97F] mt-0.5 flex-shrink-0" />
              <div className="space-y-2 text-sm">
                <p className="font-['Cinzel'] font-bold text-white">
                  Before submitting:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  <li>
                    Ensure you have enough tokens to meet the proposal threshold
                  </li>
                  <li>
                    Double-check all contract addresses and function calls
                  </li>
                  <li>
                    Consider discussing your proposal in the community forum
                    first
                  </li>
                  <li>Proposals cannot be edited once submitted</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-[rgb(8,62,34)] pt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 uppercase tracking-wider">
                Proposal Threshold:
              </span>
              <span className="font-['Cinzel'] font-bold text-white">
                {GOVERNANCE_PARAMS.PROPOSAL_THRESHOLD}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 uppercase tracking-wider">
                Voting Delay:
              </span>
              <span className="font-['Cinzel'] font-bold text-white">
                {GOVERNANCE_PARAMS.VOTING_DELAY}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 uppercase tracking-wider">
                Voting Period:
              </span>
              <span className="font-['Cinzel'] font-bold text-white">
                {GOVERNANCE_PARAMS.VOTING_PERIOD}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 uppercase tracking-wider">
                Quorum Required:
              </span>
              <span className="font-['Cinzel'] font-bold text-white">
                {GOVERNANCE_PARAMS.QUORUM_REQUIRED}
              </span>
            </div>
          </div>

          <Button
            className="w-full btn-gold text-lg py-6"
            disabled={!description}
            onClick={handleSubmit}
          >
            <Scroll className="mr-2 h-5 w-5" />
            SUBMIT PROPOSAL
          </Button>
        </div>
      </div>
    </div>
  );
}
