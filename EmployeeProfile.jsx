import { useAuth } from "../../context/AuthContext";

export default function EmployeeProfile() {
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
          <strong>Designation:</strong> Teacher
        </p>
        <p>
          <strong>Department:</strong> Science
        </p>
        <p>
          <strong>Contact:</strong> 9876543210
        </p>
        <p>
          <strong>Email:</strong> teacher@example.com
        </p>
      </div>
    </div>
  );
}
