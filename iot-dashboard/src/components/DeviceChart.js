import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function DeviceChart({ deviceId, healthData }) {
  const data = {
    labels: healthData.map((data) => data.timestamp),
    datasets: [
      {
        label: "CPU Usage",
        data: healthData.map((data) => data.cpu),
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
      {
        label: "Memory Usage",
        data: healthData.map((data) => data.memory),
        borderColor: "rgba(153, 102, 255, 1)",
        fill: false,
      },
      {
        label: "Battery Level",
        data: healthData.map((data) => data.battery),
        borderColor: "rgba(255, 159, 64, 1)",
        fill: false,
      },
    ],
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h4>{deviceId}</h4>
      <Line data={data} />
    </div>
  );
}

export default DeviceChart;
