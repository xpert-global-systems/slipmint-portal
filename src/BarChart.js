"use client";
import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { week: "Week 1", profit: 250, loss: 50 },
  { week: "Week 2", profit: 480, loss: 120 },
  { week: "Week 3", profit: 320, loss: 80 },
  { week: "Week 4", profit: 650, loss: 150 },
];

export default function BarChart() {
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="week" stroke="#b8c7d9" />
          <YAxis stroke="#b8c7d9" />
          <Tooltip
            contentStyle={{
              background: "#081120",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              color: "#fff",
            }}
            formatter={(value) => [`$${value.toLocaleString()}`]}
          />
          <Legend />
          <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} name="Profit" />
          <Bar dataKey="loss" fill="#ef4444" radius={[4, 4, 0, 0]} name="Loss" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
