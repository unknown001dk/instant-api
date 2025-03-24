import React, { useState } from 'react';
import axios from 'axios';
import './Register.css'; // Import the CSS file
import { NotificationError, NotificationSucess } from '../../utils/Notification';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    // if (password !== confirmPassword) {
    //   alert("Passwords don't match");
    //   return;
    // }

    try {
      if (!email || !password || !username) {
        return NotificationError("Register failed", "Please fill in all fields");
      }
      await axios.post('http://localhost:8081/api/v1/users/register', { email, password, username });
      NotificationSucess("Register","Successfully registered")
      window.location.href = '/'; // Redirect to login page after successful registration
    } catch (error) {
      console.error('Registration error:', error);
      NotificationError("Registration error", "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="/login">Login here</a></p>
    </div>
  );
}

export default Register;
