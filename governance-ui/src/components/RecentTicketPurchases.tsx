import { useRecentTicketPurchases } from '../hooks/useGovernanceData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { formatDistance } from 'date-fns';

interface RecentTicketPurchasesProps {
  limit?: number;
}

export function RecentTicketPurchases({ limit = 10 }: RecentTicketPurchasesProps) {
  const { purchases, loading, error } = useRecentTicketPurchases(limit);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Ticket Purchases</CardTitle>
          <CardDescription>Loading recent purchases...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Ticket Purchases</CardTitle>
          <CardDescription className="text-red-500">
            Error loading purchases: {error.message}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const formatUSD = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const shortenAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Ticket Purchases</CardTitle>
        <CardDescription>Latest {limit} ticket swaps</CardDescription>
      </CardHeader>
      <CardContent>
        {purchases.length === 0 ? (
          <p className="text-sm text-muted-foreground">No ticket purchases yet</p>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => {
              const isToken0Ticket = purchase.token0_symbol === 'TICKET';
              const ticketAmount = isToken0Ticket ? purchase.delta0_decimal : purchase.delta1_decimal;
              const otherToken = isToken0Ticket ? purchase.token1_symbol : purchase.token0_symbol;
              const otherAmount = isToken0Ticket ? purchase.delta1_decimal : purchase.delta0_decimal;

              return (
                <div
                  key={purchase.event_id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://starkscan.co/tx/${purchase.transaction_hash_hex}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium hover:underline"
                      >
                        {shortenAddress(purchase.transaction_hash_hex)}
                      </a>
                      <span className="text-xs text-muted-foreground">
                        {formatDistance(new Date(purchase.block_time), new Date(), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Buyer: {shortenAddress(purchase.locker_hex)}
                    </div>
                    <div className="text-xs">
                      {Math.abs(ticketAmount).toFixed(4)} TICKET ⇄ {Math.abs(otherAmount).toFixed(4)} {otherToken}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatUSD(purchase.swap_value_usd)}</div>
                    <div className="text-xs text-muted-foreground">Block #{purchase.block_number}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
