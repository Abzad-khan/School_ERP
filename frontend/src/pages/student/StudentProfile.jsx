import { useAuth } from "../../context/AuthContext";

export default function StudentProfile() {
  const { user } = useAuth();
  return (
    <div>
      <h2>My Profile</h2>
      <div className="card">
        <p>
          <strong>Name:</strong> {user?.name}
        </p>
        <p>
          <strong>Username:</strong> {user?.username}
        </p>
        <p>
          <strong>Class:</strong> 10-A
        </p>
        <p>
          <strong>Contact:</strong> 9876543210
        </p>
      </div>
    </div>
  );
}
