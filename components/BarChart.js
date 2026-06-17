"use client";

import {
  BarChart as ReBarChart,
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

export default function BarChart() {
  return (
    <div style={styles.container}>
      <ResponsiveContainer width="100%" height={250}>
        <ReBarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
          {/* Subtle horizontal grid lines matching dark theme boundaries */}
          <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
          
          {/* Clean typography formatting for the data fields */}
          <XAxis 
            dataKey="name" 
            stroke="#475569" 
            fontSize={12} 
            tickLine={false} 
          />
          <YAxis 
            stroke="#475569" 
            fontSize={12} 
            tickLine={false} 
          />
          
          {/* Customized dark tooltip overlay to replace the bright default box */}
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ fill: "rgba(51, 65, 85, 0.15)" }} 
          />
          
          {/* Added slight rounded top corner radius to the UI bars for an elite finish */}
          <Bar 
            dataKey="value" 
            fill="#10b981" 
            radius={[4, 4, 0, 0]} 
          />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Integrated custom dark-themed tooltip wrapper
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={styles.tooltip}>
        <p style={{ margin: 0, color: "#94a3b8", fontSize: "12px" }}>
          {payload[0].payload.name}
        </p>
        <p style={{ margin: "4px 0 0 0", color: "white", fontWeight: "bold", fontSize: "14px" }}>
          Value: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const styles = {
  container: {
    background: "#111827",
    border: "1px solid #334155",
    borderRadius: "12px",
    padding: "24px 16px 12px 16px",
    width: "100%",
  },
  tooltip: {
    background: "#0b1220",
    border: "1px solid #334155",
    padding: "8px 12px",
    borderRadius: "8px",
  },
};