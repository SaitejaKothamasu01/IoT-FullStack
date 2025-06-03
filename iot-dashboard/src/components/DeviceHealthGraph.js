import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

function DeviceHealthGraph({ healthHistory }) {
  console.log("Health history:", healthHistory);
  if (!healthHistory.length) return <p>No health history available.</p>;

  // Format timestamps for x-axis
  const data = healthHistory.map(({ timestamp, cpu, memory, battery }) => ({
    timestamp: new Date(timestamp).toLocaleTimeString(),
    cpu,
    memory,
    battery,
  }));

  return (
    <LineChart width={700} height={300} data={data}>
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="timestamp" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="cpu" stroke="#8884d8" />
      <Line type="monotone" dataKey="memory" stroke="#82ca9d" />
      <Line type="monotone" dataKey="battery" stroke="#ff7300" />
    </LineChart>
  );
}

export default DeviceHealthGraph;
