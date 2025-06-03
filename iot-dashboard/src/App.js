// src/App.js
import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth, getUserRole } from './firebase';
import DeviceTable from "./components/DeviceTable";
import FirmwareManager from "./components/FirmwareManager";
import OTAUpdateManager from "./components/OTAUpdateManager";
import Login from "./components/Login";
import Register from "./components/Register";
import Logout from "./components/Logout";

function App() {
  const [devices, setDevices] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // Start as null meaning "not loaded yet"
  const [loadingRole, setLoadingRole] = useState(true); // Loading state for role
  const ws = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setAuthenticated(true);
        setLoadingRole(true);
        try {
          const role = await getUserRole(user.uid);
          setUserRole(role || 'viewer');
        } catch (error) {
          console.error("Failed to fetch user role:", error);
          setUserRole('viewer');
        } finally {
          setLoadingRole(false);
        }
      } else {
        setAuthenticated(false);
        setUserRole(null);
        setLoadingRole(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/devices")
      .then((res) => res.json())
      .then((data) => setDevices(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:7070");

    ws.current.onopen = () => console.log("WebSocket connected");

    ws.current.onmessage = (event) => {
      try {
        const {
          deviceId,
          health,
          healthHistory,
          status,
          lastActive,
          firmwareVersion,
          location,
        } = JSON.parse(event.data);

        setDevices((prevDevices) => {
          const index = prevDevices.findIndex((d) => d.deviceId === deviceId);
          if (index === -1) return prevDevices;

          const updated = [...prevDevices];
          updated[index] = {
            ...updated[index],
            health,
            healthHistory,
            status,
            lastActive,
            firmwareVersion: firmwareVersion || updated[index].firmwareVersion,
            location: location || updated[index].location,
          };
          return updated;
        });
      } catch (e) {
        console.error("Error parsing websocket message:", e);
      }
    };

    ws.current.onerror = (err) => console.error("WebSocket error:", err);
    ws.current.onclose = () => console.log("WebSocket disconnected");

    return () => ws.current.close();
  }, []);

  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <h2>📊 IoT Device Dashboard</h2>

        {!authenticated ? (
          <Routes>
            <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
            <Route path="/register" element={<Register setAuthenticated={setAuthenticated} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        ) : loadingRole ? (
          <div>Loading user permissions...</div>
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <div style={{ position: "relative", paddingTop: "40px" }}>
                  <div style={{ position: "absolute", top: 0, right: 0 }}>
                    <Logout setAuthenticated={setAuthenticated} />
                  </div>

                  {userRole === "administrator" && (
                    <>
                      <FirmwareManager />
                      <OTAUpdateManager devices={devices} />
                      <DeviceTable devices={devices} />
                    </>
                  )}

                  {(userRole === "technician" || userRole === "viewer") && (
                    <DeviceTable devices={devices} />
                  )}
                </div>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
