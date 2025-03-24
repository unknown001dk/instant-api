import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import ApiSettings from "./components/ApiSettings/ApiSettings";
import Home from "./components/Home/Home";
import SchemaEditor from "./components/SchemaEditer/SchemaEditor";
import Document from "./components/Document/Document";
import DatabaseSettings from "./components/Database/DatabaseSettings";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/api-settings" element={<ApiSettings />} />
          <Route path="/database-settings" element={<DatabaseSettings />} />
          <Route path="/schema-editor" element={<SchemaEditor />} />
          <Route path="/document" element={<Document />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
