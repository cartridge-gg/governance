import { useTicketPurchaseStats } from "../hooks/useGovernanceData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export function TicketStats() {
  const { stats, loading, error } = useTicketPurchaseStats();

  console.log(stats);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ticket Purchase Stats</CardTitle>
          <CardDescription>Loading stats...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ticket Purchase Stats</CardTitle>
          <CardDescription className="text-red-500">
            Error loading stats: {error.message}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ticket Purchase Stats</CardTitle>
          <CardDescription>No ticket purchase data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const formatUSD = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Volume</CardDescription>
          <CardTitle className="text-3xl">
            {formatUSD(stats.total_volume_usd)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            {stats.total_purchases.toLocaleString()} purchases
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Average Purchase</CardDescription>
          <CardTitle className="text-3xl">
            {formatUSD(stats.avg_purchase_usd)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Min: {formatUSD(stats.min_purchase_usd)} | Max:{" "}
            {formatUSD(stats.max_purchase_usd)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Unique Buyers</CardDescription>
          <CardTitle className="text-3xl">
            {stats.unique_buyers.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">Total participants</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Activity Period</CardDescription>
          <CardTitle className="text-lg">
            {formatDate(stats.first_purchase_time)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Latest: {formatDate(stats.last_purchase_time)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
