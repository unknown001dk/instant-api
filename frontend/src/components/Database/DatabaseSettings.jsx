import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DatabaseSettings.css";
import {
  NotificationError,
  NotificationSucess,
} from "../../utils/Notification";
import { IsUserLoggedIn } from "../../utils/CheckUser";

const DatabaseSettings = () => {
  const [mongoURI, setMongoURI] = useState("");
  const [localURI, setLocalURI] = useState("");
  const [projectName, setProjectName] = useState("");
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [projectData, setProjectData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [modalProjectName, setModalProjectName] = useState(""); // Project name from modal

  useEffect(() => {
    IsUserLoggedIn();
    const tokenData = sessionStorage.getItem("token");
    const user = JSON.parse(tokenData);
    const userId = user.user?._id;
    if (user) {
      setToken(user.token);
      setUserId(user.user?._id);
    }
  }, []);

  const handleSave = async () => {
    if (!mongoURI || !localURI || !projectName) {
      NotificationError("Missing Fields", "Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8081/api/v1/mongouri/create`,
        {
          userId,
          projectName,
          atlasURI: mongoURI,
          localURI,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        NotificationSucess("Success", "Database URIs saved successfully.");
        setProjectData(response.data.project);
      }
      console.log(response);
      setMongoURI("");
      setLocalURI("");
      setProjectName("");
    } catch (error) {
      console.error("Error saving URIs:", error);
      NotificationError(
        "Error",
        error.response?.data?.message || "Failed to save URIs."
      );
    }
  };

  const handleFetch = async () => {
    if (!modalProjectName) {
      NotificationError("Invalid Input", "Please enter the project name.");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:8081/api/v1/mongouri/getURIs",
        {
          params: {
            userId,
            projectName: modalProjectName,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        NotificationSucess("Fetched Successfully", "Project data fetched successfully.");
        setProjectData(response.data.project);
        setIsModalOpen(false); // Close modal on success
      }
    } catch (error) {
      console.error("Error fetching URIs:", error);
      NotificationError(
        "Error",
        error.response?.data?.message || "Failed to fetch URIs."
      );
    }
  };

  return (
    <div className="db-settings-container">
      <h1>Database Settings</h1>
      <p>Configure your database connections below:</p>

      <form className="db-settings-form" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="projectName">Project Name:</label>
        <input
          type="text"
          id="projectName"
          placeholder="Enter your project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />

        <label htmlFor="mongoURI">MongoDB Atlas URI:</label>
        <input
          type="text"
          id="mongoURI"
          placeholder="e.g., mongodb+srv://<user>:<password>@cluster.mongodb.net/dbName"
          value={mongoURI}
          onChange={(e) => setMongoURI(e.target.value)}
        />

        <label htmlFor="localURI">MongoDB Local URI:</label>
        <input
          type="text"
          id="localURI"
          placeholder="e.g., mongodb://localhost:27017/databaseName"
          value={localURI}
          onChange={(e) => setLocalURI(e.target.value)}
        />

        <button type="button" className="btn-save" onClick={handleSave}>
          Save URIs
        </button>
      </form>

      <hr />

      <div className="fetch-project-data">
        <h2>Fetch Project Data</h2>
        <button
          type="button"
          className="btn-fetch"
          onClick={() => setIsModalOpen(true)}
        >
          Fetch Data
        </button>
      </div>

      {projectData && (
        <div className="project-data-display">
          <h3>Project Data:</h3>
          <p>
            <strong>Project Name:</strong> {projectData.projectName}
          </p>
          <p>
            <strong>MongoDB Atlas URI:</strong> {projectData.atlasURI}
          </p>
          <p>
            <strong>MongoDB Local URI:</strong> {projectData.localURI}
          </p>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Enter Project Name</h3>
            <input
              type="text"
              placeholder="Enter project name"
              value={modalProjectName}
              onChange={(e) => setModalProjectName(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="btn-fetch" onClick={handleFetch}>
                Fetch
              </button>
              <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseSettings;
