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
              title="Nombre d'étudiants"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-8 w-8 text-indigo-500"
                >
                  <path
                    d="M16 21v-2a4 4 0 00-3-3.87M12 3a4 4 0 110 8 4 4 0 010-8zM6 21v-2a4 4 0 013-3.87"
                    strokeLinecap="round"
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
              title="Nombre d'évenements"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-8 w-8 text-emerald-500"
                >
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="18"
                    rx="2"
                    ry="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <circle cx="16" cy="16" r="1.5" fill="currentColor" />
                </svg>
              }
              content={{
                statistic: "184",
                percent: "",
              }}
            />
            <DashboardStatistic
              title="Nombre de cartes"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-8 w-8 text-orange-400"
                >
                  <rect
                    x="2"
                    y="5"
                    width="20"
                    height="14"
                    rx="2"
                    ry="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line x1="2" y1="10" x2="22" y2="10" />
                  <line x1="6" y1="16" x2="10" y2="16" />
                </svg>
              }
              content={{
                statistic: "12",
                percent: "",
              }}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <OverviewChart />
            <RecentSales />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Dashboard;
