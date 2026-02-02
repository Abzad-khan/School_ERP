import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { getStats } from "../../api/dashboardApi";
import StatCard from "../../components/StatCard";

export default function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    assignments: 0,
    attendance: 0,
    fees: 0,
  });

  useEffect(() => {
    getStats().then((res) => setStats(res.data));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      {/* Stats Section */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <StatCard title="Students" value={stats.students} />
        <StatCard title="Assignments" value={stats.assignments} />
        <StatCard title="Attendance" value={stats.attendance} />
        <StatCard title="Fees" value={stats.fees} />
        <StatCard title="Certificates" value={stats.certificates} />
        <StatCard title="Gamification" value={stats.gamification} />
        <StatCard title="Announcements" value={stats.announcements} />
      </div>

      {/* Navigation */}
    

      <hr />

      {/* Nested module pages */}
      <Outlet />
    </div>
  );
}
