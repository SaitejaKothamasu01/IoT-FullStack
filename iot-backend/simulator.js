// simulator.js
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 7070 });

console.log("Simulator WebSocket running on ws://localhost:7070");

// In-memory store of health history for each device
const devicesHealthHistory = {};


// Utility to generate random health data
function generateHealth() {
  return {
    cpu: +(Math.random() * 100).toFixed(2),
    memory: +(Math.random() * 100).toFixed(2),
    battery: +(Math.random() * 100).toFixed(2),
    connectivity: Math.random() > 0.1 ? "online" : "offline",
  };
}

function generateStatus(battery) {
  if (battery < 20) return "Critical";
  if (battery < 50) return "Warning";
  return "Healthy";
}

// Broadcast update to all clients
function broadcastUpdate(update) {
  const msg = JSON.stringify(update);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

// Simulate updates for all devices every 5 seconds
setInterval(() => {
  const now = new Date();

  for (let i = 1; i <= 1000; i++) {
    const deviceId = `device-${i}`;

    const health = generateHealth();
    const status = generateStatus(health.battery);

    // Initialize history if needed
    if (!devicesHealthHistory[deviceId]) {
      devicesHealthHistory[deviceId] = [];
    }

    // Append new health with timestamp, keep last 10
    devicesHealthHistory[deviceId].push({ ...health, timestamp: now.toISOString() });
    if (devicesHealthHistory[deviceId].length > 10) {
      devicesHealthHistory[deviceId].shift();
    }

    // Send update
    broadcastUpdate({
      deviceId,
      health,
      status,
      lastActive: now.toISOString(),
      healthHistory: devicesHealthHistory[deviceId],
    });
  }
}, 5000);

wss.on("connection", (ws) => {
  console.log("Client connected to simulator");
  ws.on("close", () => {
    console.log("Client disconnected from simulator");
  });
});
