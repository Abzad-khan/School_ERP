import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const roles = [
  { label: "Admin", value: "ADMIN" },
  { label: "Student", value: "STUDENT" },
  { label: "Employee", value: "EMPLOYEE" },
];

export default function LoginPage() {
  const [role, setRole] = useState("ADMIN");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login(username, password, role);
      if (user.role === "ADMIN") navigate("/admin");
      else if (user.role === "STUDENT") navigate("/student");
      else navigate("/employee");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>School ERP Login</h1>

        <div className="role-selector">
          {roles.map((r) => (
            <button
              key={r.value}
              type="button"
              className={role === r.value ? "active" : ""}
              onClick={() => setRole(r.value)}
            >
              {r.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit">Login</button>
          <p style={{ marginTop: "10px" }}>
  Don’t have an account?{" "}
  <span
    style={{ color: "#60a5fa", cursor: "pointer" }}
    onClick={() => navigate("/register")}
  >
    Register
  </span>
</p>
        </form>
      </div>
    </div>
  );
}
