import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fakeRegister } from "../../services/registerService";

const roles = [
  { label: "Admin", value: "ADMIN" },
  { label: "Student", value: "STUDENT" },
  { label: "Employee", value: "EMPLOYEE" },
];

export default function RegisterPage() {
  const [role, setRole] = useState("STUDENT");
  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await fakeRegister({
        username: form.username,
        password: form.password,
        name: form.name,
        role,
      });

      setSuccess("Registered successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Register - School ERP</h1>

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
            Full Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Username
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          {error && <p className="error">{error}</p>}
          {success && <p style={{ color: "lightgreen" }}>{success}</p>}

          <button type="submit">Register</button>

          <p style={{ marginTop: "10px" }}>
            Already have an account?{" "}
            <span
              style={{ color: "#60a5fa", cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
