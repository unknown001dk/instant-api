import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaHome, FaSignInAlt, FaUserPlus, FaTachometerAlt, FaCogs, FaDatabase, FaBars, FaFile, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const toggleMenu = () => {
    setIsMobile(!isMobile);
  };

  const closeMenuOnOutsideClick = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsMobile(false);
    }
  };

  // Check if user is logged in
  useEffect(() => {
    const tokenData = sessionStorage.getItem('token');
    setIsLoggedIn(!!tokenData); // If token is found, user is logged in
    document.addEventListener('mousedown', closeMenuOnOutsideClick);
    return () => {
      document.removeEventListener('mousedown', closeMenuOnOutsideClick);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token'); // Remove token from sessionStorage
    setIsLoggedIn(false); // Update state to reflect that user is logged out
    navigate('/'); // Redirect to home or login page using navigate
  };

  return (
    <nav>
      <div className="navbar-brand">
        <h1>Instant API</h1>
        <button className="menu-toggle btn" onClick={toggleMenu}>
          <FaBars />
        </button>
      </div>
      <ul
        className={`nav-links ${isMobile ? 'mobile' : ''}`}
        ref={menuRef}
      >
        <li><Link to="/">Home <FaHome /></Link></li>
        <li><Link to="/dashboard">Dashboard <FaTachometerAlt /></Link></li>
        <li><Link to="/api-settings">API Settings <FaCogs /></Link></li>
        <li><Link to="/schema-editor">Schema Editor <FaDatabase /></Link></li>
        <li><Link to="/database-settings">Database settings <FaDatabase /></Link></li>
        <li><Link to="/document">Document <FaFile /></Link></li>

        {/* Conditionally render Login/Logout based on user login state */}
        {isLoggedIn ? (
          <li><button onClick={handleLogout} className='logout-btn'>Logout <FaSignOutAlt /></button></li>
        ) : (
          <li><Link to="/login">Login <FaSignInAlt /></Link></li>
        )}
        
      </ul>
    </nav>
  );
}

export default Navbar;
