import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <h3>School ERP</h3>

      <div>
        <span style={{ marginRight: "15px" }}>
          {user?.username} ({user?.role})
        </span>
        <button className="btn-outline" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
