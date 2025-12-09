import { useEffect, useState } from "react";
import StatCard from "../../components/common/StatCard";
import { getAllStudents } from "../../services/studentService";

export default function AdminDashboard() {
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    getAllStudents().then((data) => setTotalStudents(data.length));
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div className="stat-grid">
        <StatCard title="Total Students" value={totalStudents} />
        <StatCard title="Total Employees" value="5" />
        <StatCard title="Fees Collected" value="₹1,50,000" />
        <StatCard title="Today Attendance" value="92%" />
      </div>
    </div>
  );
}
