import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-wrapper">
      {/* Navbar */}
      <header className="home-nav">
        <h2 className="logo">SchoolERP</h2>
        <div className="nav-actions">
          <Link to="/login" className="btn-outline">Login</Link>
          <Link to="/register" className="btn-primary">Register</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>
            The Smart ERP System <br />
            for Modern Schools
          </h1>
          <p>
            Manage students, attendance, fees, certificates, assignments,
            gamification and more — all from one powerful dashboard.
          </p>

          <div className="hero-buttons">
            <Link to="/login" className="btn-primary">Get Started</Link>
            <Link to="/register" className="btn-outline">Create Account</Link>
          </div>
        </div>

        <div className="hero-card">
          <h3>Why SchoolERP?</h3>
          <ul>
            <li>📊 Live dashboard & analytics</li>
            <li>🎓 Student & teacher management</li>
            <li>🧾 Certificates & fees tracking</li>
            <li>🏆 Gamification & performance</li>
            <li>💬 Built-in chat system</li>
          </ul>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="feature-card">
          <h3>All-in-One</h3>
          <p>Everything your school needs in one platform.</p>
        </div>

        <div className="feature-card">
          <h3>Secure</h3>
          <p>Role-based access with modern authentication.</p>
        </div>

        <div className="feature-card">
          <h3>Cloud Ready</h3>
          <p>Access anytime, anywhere, on any device.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>© {new Date().getFullYear()} SchoolERP. All rights reserved.</p>
      </footer>
    </div>
  );
}
