import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Chart from "@/components/dashboard/OverviewChart/Chart"

export function OverviewChart() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle> Répartition des cartes étudiantes par promotion</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <Chart />
      </CardContent>
    </Card>
  );
}