import React, { useEffect, useState } from "react";

function OTAUpdateManager({ devices }) {
  const [firmwares, setFirmwares] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState("");
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch firmware versions
  useEffect(() => {
    fetch("http://localhost:5000/api/firmware")
      .then((res) => res.json())
      .then((data) => setFirmwares(data))
      .catch(() => setError("Failed to load firmware list."));
  }, []);

  const handleCheckboxChange = (deviceId) => {
    setSelectedDevices((prev) =>
      prev.includes(deviceId)
        ? prev.filter((id) => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const handleDeploy = async () => {
    setMessage("");
    setError("");

    if (!selectedVersion || selectedDevices.length === 0) {
      setError("Please select a firmware version and at least one device.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/ota/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version: selectedVersion,
          targetDevices: selectedDevices,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Deployment failed");
      setMessage(data.message);
      setSelectedDevices([]);
      setSelectedVersion("");
    } catch (err) {
      setError(err.message);
    }
  };

  // Filter devices based on search
  const filteredDevices = (devices || []).filter(
    (d) =>
      d &&
      d.deviceId &&
      d.deviceId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allVisibleSelected = filteredDevices.every(
    (d) => d && selectedDevices.includes(d.deviceId)
  );

  const toggleSelectAllVisible = () => {
    const visibleIds = filteredDevices
      .filter((d) => d && d.deviceId)
      .map((d) => d.deviceId);

    if (visibleIds.every((id) => selectedDevices.includes(id))) {
      setSelectedDevices((prev) =>
        prev.filter((id) => !visibleIds.includes(id))
      );
    } else {
      const idsToAdd = visibleIds.filter((id) => !selectedDevices.includes(id));
      setSelectedDevices((prev) => [...prev, ...idsToAdd]);
    }
  };

  return (
    <div style={{ marginTop: 30, padding: "10px", border: "1px solid #ccc" }}>
      <h3>🚀 OTA Firmware Deployment</h3>

      <div>
        <label>
          Select Firmware Version:{" "}
          <select
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(e.target.value)}
          >
            <option value="">-- Select --</option>
            {firmwares.map((fw) => (
              <option key={fw._id} value={fw.version}>
                {fw.version}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ marginTop: 10 }}>
        <strong>Select Target Devices:</strong>
        <div>
          <input
            type="text"
            placeholder="🔍 Search device ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "4px", width: "300px" }}
          />
        </div>
        <div>
          <label style={{ display: "inline-block", marginTop: 8 }}>
            <input
              type="checkbox"
              checked={allVisibleSelected}
              onChange={toggleSelectAllVisible}
            />{" "}
            Select All Visible
          </label>
        </div>
        <ul
          style={{
            listStyle: "none",
            paddingLeft: 0,
            maxHeight: 200,
            overflowY: "auto",
            border: "1px solid #eee",
            marginTop: 8,
          }}
        >
          {filteredDevices.map((device) => (
            <li key={device.deviceId}>
              <label>
                <input
                  type="checkbox"
                  value={device.deviceId}
                  checked={selectedDevices.includes(device.deviceId)}
                  onChange={() => handleCheckboxChange(device.deviceId)}
                />{" "}
                {device.deviceId}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={handleDeploy} style={{ marginTop: 10 }}>
        Deploy Firmware
      </button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default OTAUpdateManager;
