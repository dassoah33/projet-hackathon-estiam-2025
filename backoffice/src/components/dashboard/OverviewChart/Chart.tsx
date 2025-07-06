"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const data = [
  { promotion: "L1", cartes: 120 },
  { promotion: "L2", cartes: 98 },
  { promotion: "L3", cartes: 101 },
  { promotion: "M1", cartes: 72 },
  { promotion: "M2", cartes: 99 },
];

export default function CardChart() {
  return (
    <div className="w-full max-w-xl h-[360px] rounded-2xl bg-white p-6 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
          barSize={32}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="promotion" tick={{ fill: "#4B5563", fontSize: 14 }} />
          <YAxis tick={{ fill: "#4B5563", fontSize: 14 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#f9fafb",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              fontSize: "14px",
              color: "#111827",
            }}
          />
          <Legend wrapperStyle={{ fontSize: 14 }} />
          <Bar
            dataKey="cartes"
            fill="#6C6CF4"
            radius={[10, 10, 0, 0]}
            className="transition-all duration-300 hover:fill-indigo-600"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
