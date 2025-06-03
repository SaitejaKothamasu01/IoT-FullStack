import React, { useState, useEffect } from "react";

function FirmwareManager() {
  const [firmwares, setFirmwares] = useState([]);
  const [version, setVersion] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch existing firmware list from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/firmware")
      .then(res => res.json())
      .then(data => setFirmwares(data))
      .catch(err => console.error("Error fetching firmware list:", err));
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!version || !file) {
      setError("Please provide both version and firmware file.");
      return;
    }

// Check if version already exists
  const versionExists = firmwares.some(fw => fw.version === version);
  if (versionExists) {
    setError(`Firmware version ${version} already exists. Please use a new version number.`);
    return;
  }
    setError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append("version", version);
    formData.append("firmware", file);

    try {
      const res = await fetch("http://localhost:5000/api/firmware", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed: ${res.statusText}`);
      }

      const data = await res.json();
      setFirmwares(prev => [data, ...prev]);  // Add new firmware to list
      setVersion("");
      setFile(null);
      alert("Firmware uploaded successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ margin: "20px 0" }}>
      <h2>Firmware Manager</h2>
      <form onSubmit={handleUpload} style={{ marginBottom: 20 }}>
        <label>
          Version:{" "}
          <input
            type="text"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="e.g. 1.0.2"
            required
          />
        </label>
        <br />
        <label>
          Firmware File:{" "}
          <input
            type="file"
            accept=".bin,.zip,.tar,.gz"
            onChange={handleFileChange}
            required
          />
        </label>
        <br />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Firmware"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Existing Firmware Versions</h3>
      <ul>
        {firmwares.length === 0 && <li>No firmware uploaded yet.</li>}
        {firmwares.map(({ _id, version, uploadedAt, fileUrl }) => (
          <li key={_id}>
            Version: {version} — Uploaded at:{" "}
            {new Date(uploadedAt).toLocaleString()} —{" "}
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              Download
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FirmwareManager;
