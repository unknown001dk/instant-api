import React from "react";
import "./Document.css"; // Add a CSS file for styling if needed

const Document = () => {
  return (
    <div className="document-container">
      <header className="document-header">
        <h1>Dynamic API Generator Documentation</h1>
        <p>Your complete guide to using and understanding the platform.</p>
      </header>
      
      <section className="document-section">
        <h2>Overview</h2>
        <p>
          The Dynamic API Generator allows developers to create and customize APIs dynamically
          without extensive backend coding. It supports user authentication, schema management, 
          and customizable endpoints for seamless integration into any application.
        </p>
      </section>

      <section className="document-section">
        <h2>Key Features</h2>
        <ul>
          <li>Create and manage database schemas dynamically.</li>
          <li>JWT-based user authentication for secure access.</li>
          <li>Customizable API endpoints tailored to user needs.</li>
          <li>Multi-URI support for handling multiple MongoDB connections.</li>
          <li>Mail service integration for automated notifications.</li>
        </ul>
      </section>

      <section className="document-section">
        <h2>How to Use</h2>
        <ol>
          <li><strong>Setup:</strong> Clone the repository, install dependencies, and configure the environment.</li>
          <li><strong>Define Schemas:</strong> Use the Schema Editor page to create database schemas.</li>
          <li><strong>Generate Endpoints:</strong> Submit schemas to create CRUD endpoints dynamically.</li>
          <li><strong>Integrate APIs:</strong> Use the generated API URLs in your application.</li>
        </ol>
      </section>

      <section className="document-section">
        <h2>Example API Flow</h2>
        <code>
          POST /api/users/register <br />
          POST /api/users/login <br />
          POST /api/dynamic/schema <br />
          GET /api/dynamic/:userId/:schemaName
        </code>
      </section>

      <section className="document-section">
        <h2>Future Improvements</h2>
        <p>
          Planned features include real-time analytics, advanced security controls, and enhanced 
          customization options to provide more flexibility for developers.
        </p>
      </section>

      <footer className="document-footer">
        <p>&copy; 2024 Dynamic API Generator. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Document;
