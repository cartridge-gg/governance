import { useConnect, Connector } from "@starknet-react/core";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface WalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WalletModal({ open, onOpenChange }: WalletModalProps) {
  const { connect, connectors } = useConnect();

  const handleConnect = async (connector: Connector) => {
    try {
      await connect({ connector });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const getConnectorName = (connector: Connector) => {
    // Map connector IDs to display names
    const id = connector.id.toLowerCase();
    if (id.includes("argent")) return "Argent X";
    if (id.includes("braavos")) return "Braavos";
    return connector.name || connector.id;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[rgba(17,17,17,0.95)] border-2 border-[rgb(8,62,34)] rounded-xl backdrop-blur-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-['Cinzel'] text-[#FFE97F]">
            CONNECT WALLET
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose a wallet to connect to Nums Governance
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {connectors.map((connector) => (
            <Button
              key={connector.id}
              onClick={() => handleConnect(connector)}
              className="w-full flex items-center justify-between px-6 py-4 h-auto bg-transparent text-[#FFE97F] font-semibold border-2 border-[#FFE97F] rounded-lg hover:bg-[rgba(255,233,127,0.1)] transition-all"
              style={{ transform: 'none' }}
            >
              <span className="flex items-center gap-3">
                <Wallet className="h-5 w-5" />
                <span className="text-base font-bold uppercase tracking-wider">
                  {getConnectorName(connector)}
                </span>
              </span>
              {connector.available() && (
                <span className="text-xs text-[#1aff5c] uppercase tracking-wider">
                  Available
                </span>
              )}
            </Button>
          ))}

          {connectors.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p className="mb-2">No wallets detected</p>
              <p className="text-sm">
                Please install Argent X or Braavos wallet extension
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-[rgb(8,62,34)]">
          <p className="text-xs text-gray-500 text-center">
            By connecting a wallet, you agree to the Terms of Service
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}