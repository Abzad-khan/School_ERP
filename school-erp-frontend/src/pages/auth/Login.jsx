import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login({ username, password });
      navigate("/dashboard");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="auth-split">
      {/* LEFT BRAND */}
      <div className="auth-left">
        <h1>SchoolERP</h1>
        <p>
          Smart school management system to handle students, attendance,
          assignments, fees, certificates and more — all in one place.
        </p>
      </div>

      {/* RIGHT FORM */}
      <div className="auth-right">
        <div className="auth-card">
          <h2>Welcome Back 👋</h2>
          <p>Login to continue</p>

          <form onSubmit={submit} className="form-group">
            <input
              className="input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              className="input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="btn-primary">Login</button>
          </form>

          <p className="auth-footer">
            Don’t have an account?{" "}
            <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
