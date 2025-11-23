import { TicketStats } from '../components/TicketStats';
import { RecentTicketPurchases } from '../components/RecentTicketPurchases';

export function TicketStatsPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Ticket Purchase Statistics</h1>
        <p className="text-muted-foreground">
          Track ticket sales volume and activity in real-time
        </p>
      </div>

      <TicketStats />

      <RecentTicketPurchases limit={20} />
    </div>
  );
}
