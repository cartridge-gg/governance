import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, XCircle, Trophy, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getDelegateProfile } from "@/lib/delegateProfiles";

interface ProposalCardProps {
  proposal: {
    id: string;
    title: string;
    status: "active" | "succeeded" | "failed" | "pending" | "executed" | "quorum_not_met";
    votesFor: string;
    votesAgainst: string;
    votesAbstain: string;
    endTime: Date;
    proposer: string;
  };
}

export function ProposalCard({ proposal }: ProposalCardProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const profile = getDelegateProfile(proposal.proposer);

  const getStatusBadge = (
    status: "active" | "succeeded" | "failed" | "pending" | "executed" | "quorum_not_met"
  ) => {
    const variants = {
      active: { className: "badge-lime", icon: Flame, text: "ACTIVE" },
      succeeded: { className: "badge-gold", icon: Trophy, text: "SUCCEEDED" },
      failed: {
        className: "bg-red-900/50 text-red-400 border-red-600",
        icon: XCircle,
        text: "FAILED",
      },
      quorum_not_met: {
        className: "badge-gold",
        icon: XCircle,
        text: "QUORUM NOT REACHED",
      },
      pending: {
        className: "bg-gray-800/50 text-gray-400 border-gray-600",
        icon: Clock,
        text: "PENDING",
      },
      executed: {
        className: "badge-gold",
        icon: CheckCircle2,
        text: "EXECUTED",
      },
    };

    const config = variants[status];
    const Icon = config.icon;

    return (
      <Badge
        className={cn("flex items-center gap-1 px-2 py-1", config.className)}
      >
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const formatEndTime = (endTime: Date) => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diff < 0) return "Ended";
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  return (
    <Link
      to={`/proposal/${proposal.id}`}
      className="block border border-[rgb(8,62,34)] rounded-lg p-6 bg-[rgba(0,0,0,0.3)] hover:bg-[rgba(255,233,127,0.05)] hover:border-[#FFE97F] transition-all cursor-pointer"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              {getStatusBadge(proposal.status)}
            </div>
            <h3 className="text-2xl font-['Cinzel'] text-white">
              {proposal.title}
            </h3>
          </div>
          <div className="flex items-center gap-3 ml-6">
            <div className="text-right">
              <div className="text-gray-500 uppercase text-xs tracking-wider mb-1">
                Proposer
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={profile?.avatar || "/avatars/adventurer.png"}
                  alt={profile?.name || "Proposer"}
                  className="h-8 w-8 rounded-full border border-[#FFE97F]/30"
                />
                <div className="text-right">
                  {profile?.name ? (
                    <>
                      <div className="text-sm font-['Cinzel'] font-bold text-white">
                        {profile.name}
                      </div>
                      <div className="text-xs font-mono text-gray-500">
                        {formatAddress(proposal.proposer)}
                      </div>
                    </>
                  ) : (
                    <div className="font-mono text-[#FFE97F] text-sm">
                      {formatAddress(proposal.proposer)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Voting Stats and Time */}
        <div className="flex items-center justify-between pt-3 border-t border-[rgb(8,62,34)]">
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wider">
                For
              </div>
              <div className="text-lg font-bold text-[#1aff5c] font-['Cinzel']">
                {proposal.votesFor}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wider">
                Against
              </div>
              <div className="text-lg font-bold text-red-400 font-['Cinzel']">
                {proposal.votesAgainst}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wider">
                Abstain
              </div>
              <div className="text-lg font-bold text-gray-400 font-['Cinzel']">
                {proposal.votesAbstain}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-400 uppercase tracking-wider">
              {formatEndTime(proposal.endTime)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
