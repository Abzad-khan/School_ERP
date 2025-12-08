import StatCard from "../../components/common/StatCard";

export default function EmployeeDashboard() {
  return (
    <div>
      <h2>Employee Dashboard</h2>
      <div className="stat-grid">
        <StatCard title="Classes Today" value="5" />
        <StatCard title="Total Students" value="120" />
        <StatCard title="Attendance Marked" value="80%" />
      </div>
    </div>
  );
}
