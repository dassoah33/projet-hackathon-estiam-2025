"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const inscriptionData = [
  { year: "2019", inscriptions: 120 },
  { year: "2020", inscriptions: 200 },
  { year: "2021", inscriptions: 350 },
  { year: "2022", inscriptions: 420 },
  { year: "2023", inscriptions: 510 },
  { year: "2024", inscriptions: 610 },
];

export function RecentSalesStatistic() {
  return (
    <div className="rounded-xl bg-white">

      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={inscriptionData}
          margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="year" tick={{ fill: "#6b7280", fontSize: 14 }} />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 14 }}
            domain={[0, "dataMax + 50"]}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              color: "#111827",
              fontSize: "14px",
            }}
            labelStyle={{ color: "#6366f1", fontWeight: 600 }}
            cursor={{ stroke: "#6366f1", strokeWidth: 1, opacity: 0.2 }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ paddingBottom: 16 }}
          />
          <Line
            type="monotone"
            dataKey="inscriptions"
            name="Inscriptions"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ r: 6, fill: "#6366f1", stroke: "#fff", strokeWidth: 2 }}
            activeDot={{
              r: 8,
              fill: "#a5b4fc",
              stroke: "#6366f1",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
