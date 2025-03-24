import React, { useState } from "react";
import "./APISettings.css";
import { NotificationSucess } from "../../utils/Notification";
import { IsUserLoggedIn } from "../../utils/CheckUser";

const APISettings = () => {
  const [apiKey, setApiKey] = useState("************"); // Placeholder for the API Key
  const [endpoint, setEndpoint] = useState("/api/v1/");
  const [permissions, setPermissions] = useState({
    read: true,
    write: false,
    delete: false,
  });

  IsUserLoggedIn();

  const handlePermissionChange = (perm) => {
    setPermissions((prev) => ({
      ...prev,
      [perm]: !prev[perm],
    }));
  };

  const handleKeyRegenerate = () => {
    const newKey = Math.random().toString(36).substr(2, 16);
    setApiKey(newKey);
    NotificationSucess("Api key","API Key regenerated successfully!");
  };

  return (
    <div className="api-settings-container">
      <header className="api-settings-header">
        <h1>API Settings</h1>
        <p>Manage your API keys, endpoints, and access permissions here.</p>
      </header>

      <section className="api-settings-section">
        <h2>API Key</h2>
        <div className="api-key-container">
          <input
            type="text"
            value={apiKey}
            readOnly
            className="api-key-display"
          />
          <button onClick={handleKeyRegenerate} className="btn-regenerate">
            Regenerate
          </button>
        </div>
        <p className="api-key-info">
          Your API key is used to authenticate API requests. Keep it secure.
        </p>
      </section>

      <section className="api-settings-section">
        <h2>API Endpoint</h2>
        <div className="endpoint-container">
          <label htmlFor="endpoint">Base URL:</label>
          <input
            type="text"
            id="endpoint"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="endpoint-input"
          />
        </div>
      </section>

      <section className="api-settings-section">
        <h2>Permissions</h2>
        <div className="permissions-container">
          <label>
            <input
              type="checkbox"
              checked={permissions.read}
              onChange={() => handlePermissionChange("read")}
            />
            Read Access
          </label>
          <label>
            <input
              type="checkbox"
              checked={permissions.write}
              onChange={() => handlePermissionChange("write")}
            />
            Write Access
          </label>
          <label>
            <input
              type="checkbox"
              checked={permissions.delete}
              onChange={() => handlePermissionChange("delete")}
            />
            Delete Access
          </label>
        </div>
      </section>

      <footer className="api-settings-footer">
        <p>&copy; 2024 Dynamic API Generator. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default APISettings;
