import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register({ username, password, role });
      navigate("/login");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="auth-split">
      {/* LEFT BRAND */}
      <div className="auth-left">
        <h1>SchoolERP</h1>
        <p>
          Join thousands of schools using SchoolERP to manage everything
          from one simple dashboard.
        </p>
      </div>

      {/* RIGHT FORM */}
      <div className="auth-right">
        <div className="auth-card">
          <h2>Create Account 🚀</h2>
          <p>Start managing today</p>

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

            <select
              className="input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="STUDENT">Student</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
            </select>

            <button className="btn-primary">Register</button>
          </form>

          <p className="auth-footer">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
