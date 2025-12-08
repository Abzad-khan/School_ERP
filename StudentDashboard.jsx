import StatCard from "../../components/common/StatCard";

export default function StudentDashboard() {
  return (
    <div>
      <h2>Student Dashboard</h2>
      <div className="stat-grid">
        <StatCard title="Attendance" value="95%" />
        <StatCard title="Pending Fees" value="₹5,000" />
        <StatCard title="Certificates" value="2" />
      </div>
    </div>
  );
}
