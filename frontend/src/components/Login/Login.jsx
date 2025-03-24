import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import {
  NotificationSucess,
  NotificationError,
} from "../../utils/Notification";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirect
import { ErrorCtrl } from "../../utils/ErrorCtrl";

function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize the navigate hook

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !pass) {
      return NotificationError("Login failed", "Please fill in all fields");
    }

    try {
      // Make sure email is in a valid format (basic regex check)
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(email)) {
        return NotificationError(
          "Login failed",
          "Please enter a valid email address"
        );
      }

      const response = await axios.post(
        "http://localhost:8081/api/v1/users/login",
        {
          email,
          password: pass,
        }
      );

      // Check if the login was successful
      if (response.data.success) {
        // Assuming the response from the server is in this format:
        const token = response.data.token;
        const user = response.data.user; // Accessing the correct field 'user'
        // Exclude password from session storage
        const { password, ...userInfo } = user;
        // Combine token and userInfo into one object
        const sessionData = { token, user: userInfo };
        // Save the combined object in sessionStorage under the key 'token'
        sessionStorage.setItem("token", JSON.stringify(sessionData));

        NotificationSucess("Login", response);

        // Redirect to dashboard after successful login
        navigate("/dashboard");
      } else {
        NotificationError("Login failed", response.data.message);
      }
    } catch (error) {
      ErrorCtrl(error, "Login");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Already have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
}

export default Login;
