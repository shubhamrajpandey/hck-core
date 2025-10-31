"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "1", Student: 18 },
  { name: "2", Student: 10 },
  { name: "3", Student: 22 },
  { name: "4", Student: 18 },
  { name: "5", Student: 6 },
  { name: "6", Student: 12 },
  { name: "7", Student: 16 },
  { name: "8", Student: 10 },
];

export default function MostcontentRealModerator() {
  return (
    <div
      className="border border-gray-300 w-[800px] h-[650px] bg-white rounded-md p-6"
      style={{ boxShadow: "1px 2px 5px 1px rgba(0, 0, 0, 0.25)" }}
    >
      <h2 className="font-[600] text-gray-700 text-[20px] mb-4">
        Student Resources
      </h2>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <YAxis
            tick={{ fontSize: 12, fill: "#6b7280" }}
            domain={[0, 35]}
            ticks={[0, 5, 10, 15, 20, 25, 30, 35]}
          />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} />
          <Tooltip />
          <Legend
            wrapperStyle={{ fontSize: "14px" }}
            iconType="circle"
            verticalAlign="top"
            align="right"
          />
          <Bar dataKey="Student" fill="#74BF44" radius={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
