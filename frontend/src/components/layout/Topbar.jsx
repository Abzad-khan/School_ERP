import { useAuth } from "../../context/AuthContext";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1>School ERP System</h1>
      </div>
      <div className="topbar-right">
        {user && (
          <>
            <span>
              {user.name} ({user.role})
            </span>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </header>
  );
}
