import React, { useState } from "react";
import DeviceHealthGraph from "./DeviceHealthGraph";

function DeviceTable({ devices }) {
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  // Find selected device by deviceId or fallback to _id
  const selectedDevice = devices.find(d => (d.deviceId || d._id) === selectedDeviceId);

  // Sort devices based on deviceId (assuming it follows a pattern like "device-1", "device-1000", etc.)
  const sortedDevices = [...devices].sort((a, b) => {
    const deviceIdA = a.deviceId ? a.deviceId.split('-')[1] : null;
    const deviceIdB = b.deviceId ? b.deviceId.split('-')[1] : null;

    if (deviceIdA && deviceIdB) {
      return parseInt(deviceIdA) - parseInt(deviceIdB);
    }
    return 0; // Keep original order if no valid deviceId is found
  });

  return (
    <>
      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ backgroundColor: "#f4f4f4" }}>
          <tr>
            <th>Device ID</th>
            <th>Firmware Version</th>
            <th>Location (Lat, Lng)</th>
            <th>CPU (%)</th>
            <th>Memory (%)</th>
            <th>Battery (%)</th>
            <th>Connectivity</th>
            <th>Last Active</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {sortedDevices.map((device, index) => {
            // Use deviceId if exists, else _id, else index as key
            const key = device.deviceId || device._id || index;
            const idForDisplay = device.deviceId || device._id || "—";

            const {
              firmwareVersion = "—",
              location,
              health = {},
              lastActive,
            } = device;

            const locationText = location && typeof location.lat === "number" && typeof location.lng === "number"
              ? `${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}`
              : "—";

            return (
              <tr key={key}>
                <td>{idForDisplay}</td>
                <td>{firmwareVersion}</td>
                <td>{locationText}</td>
                <td>{health.cpu ?? "—"}</td>
                <td>{health.memory ?? "—"}</td>
                <td>{health.battery ?? "—"}</td>
                <td
                  style={{
                    color: health.connectivity === "online" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {health.connectivity ?? "—"}
                </td>
                <td>{lastActive ? new Date(lastActive).toLocaleString() : "—"}</td>
                <td>
                  <button onClick={() => setSelectedDeviceId(idForDisplay)}>Show Graph</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {selectedDevice && (
        <>
          {/* Modal Overlay */}
          <div
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
            }}
            onClick={() => setSelectedDeviceId(null)}
          />

          {/* Modal Content */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              zIndex: 1001,
              width: "750px",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
            }}
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
          >
            <h3>📊 Health History: {selectedDevice.deviceId || selectedDevice._id}</h3>

            <DeviceHealthGraph healthHistory={selectedDevice.healthHistory || selectedDevice.history || []} />

            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <button
                onClick={() => setSelectedDeviceId(null)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#333",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default DeviceTable;
