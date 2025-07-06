import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RecentSalesStatistic } from "@/components/dashboard/RecentSales/Statistic";

// RecentSales components in a folder with index.tsx equals to RecentSales.tsx
export function RecentSales() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Evolution des inscriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <RecentSalesStatistic />
      </CardContent>
    </Card>
  );
}