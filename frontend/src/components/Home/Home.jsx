import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { IsUserLoggedIn } from "../../utils/CheckUser";

const Home = () => {
  IsUserLoggedIn()
  return (
    <div className="home-container">
      {/* Header Section */}
      <header className="home-header">
        <h1>Dynamic API Platform</h1>
        <p>Create, Manage, and Customize APIs Effortlessly</p>
        <Link to="/api-settings" className="btn-primary">
          Get Started
        </Link>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Customizable Endpoints</h3>
            <p>Easily configure your API endpoints to fit your application’s needs.</p>
          </div>
          <div className="feature-card">
            <h3>Secure Access</h3>
            <p>Implement secure authentication with JWT and session storage.</p>
          </div>
          <div className="feature-card">
            <h3>Schema Management</h3>
            <p>Create and edit schemas dynamically with reference support.</p>
          </div>
          <div className="feature-card">
            <h3>Scalability</h3>
            <p>Use MongoDB Atlas for reliable and scalable data storage.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <h3>1. Register</h3>
            <p>Sign up and log in to start using the platform.</p>
          </div>
          <div className="step-card">
            <h3>2. Define Schema</h3>
            <p>Create your custom schema using our easy-to-use editor.</p>
          </div>
          <div className="step-card">
            <h3>3. Generate API</h3>
            <p>Automatically generate secure APIs for your applications.</p>
          </div>
          <div className="step-card">
            <h3>4. Deploy</h3>
            <p>Integrate the APIs into your project and deploy seamlessly.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Developers Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>
              "This platform has revolutionized how I build APIs. The schema editor is a game-changer!"
            </p>
            <h4>- Alex Johnson, Full-Stack Developer</h4>
          </div>
          <div className="testimonial-card">
            <p>
              "Dynamic API Platform saved me countless hours. It's a must-have for every developer."
            </p>
            <h4>- Priya Singh, Backend Engineer</h4>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="cta-section">
        <h2>Start Building APIs Today</h2>
        <p>
          Join thousands of developers who trust the Dynamic API Platform to create secure and customizable APIs effortlessly.
        </p>
        <Link to="/api-settings" className="btn-secondary">
          Try Now
        </Link>
      </section>

      {/* Footer Section */}
      <footer className="home-footer">
        <p>© 2024 Dynamic API Platform | Built for Developers</p>
      </footer>
    </div>
  );
};

export default Home;
