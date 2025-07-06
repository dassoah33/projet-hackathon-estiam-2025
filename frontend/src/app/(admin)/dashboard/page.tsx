import React from "react";
import { CalendarDateRangePicker } from "@/components/dashboard/CalendarDateRangePicker";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { DashboardStatistic } from "@/components/dashboard/DashboardStatistic";
import { RecentSales } from "@/components/dashboard/RecentSales";
import { OverviewChart } from "@/components/dashboard/OverviewChart";

async function Dashboard() {
  return (
    <div>
      {/* page related components put here */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <DashboardStatistic
              title="Cours à venir"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-8 w-8 text-indigo-500"
                >
                  <path
                    d="M4 6.5C4 5.119 5.119 4 6.5 4C9 4 12 5.5 12 5.5C12 5.5 15 4 17.5 4C18.881 4 20 5.119 20 6.5V17.5C20 18.881 18.881 20 17.5 20C15 20 12 18.5 12 18.5C12 18.5 9 20 6.5 20C5.119 20 4 18.881 4 17.5V6.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 5.5V18.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              content={{
                statistic: "93",
                percent: "",
              }}
            />
            <DashboardStatistic
              title="Terminés"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-8 w-8 text-emerald-500"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M9 12l2 2l4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              content={{
                statistic: "184",
                percent: "",
              }}
            />
            <DashboardStatistic
              title="En cours"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-8 w-8 text-orange-400"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M12 7v5l3 3"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              content={{
                statistic: "12",
                percent: "",
              }}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <OverviewChart />
            <RecentSales />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Dashboard;
