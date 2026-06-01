"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", value: 12 },
  { name: "Feb", value: 19 },
  { name: "Mar", value: 3 },
  { name: "Apr", value: 5 },
  { name: "May", value: 2 },
  { name: "Jun", value: 30 },
];

export default function BarChartComponent() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  );
}