// src/components/HealthStatusBadge.js
import React from "react";

const HealthStatusBadge = ({ status }) => {
  const color = {
    Healthy: "green",
    Warning: "orange",
    Critical: "red",
  }[status] || "gray";

  return (
    <span style={{
      backgroundColor: color,
      color: "white",
      padding: "4px 8px",
      borderRadius: "4px"
    }}>
      {status}
    </span>
  );
};

export default HealthStatusBadge;
