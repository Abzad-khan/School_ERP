import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardApi } from '../api/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { role } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = role === 'STUDENT'
          ? await dashboardApi.getStudentStats()
          : await dashboardApi.getStats();
        setStats(res.data);
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [role]);

  if (loading) {
    return <div className="text-slate-600">Loading...</div>;
  }

  if (!stats) {
    return <div className="text-slate-600">Unable to load dashboard data.</div>;
  }

  const cards = role === 'STUDENT'
    ? [
        { label: 'Attendance %', value: `${stats.attendancePercentage}%`, color: 'bg-blue-500' },
        { label: 'Fees Pending', value: stats.feesPending, color: 'bg-amber-500' },
      ]
    : [
        { label: 'Students', value: stats.totalStudents, color: 'bg-indigo-500' },
        { label: 'Teachers', value: stats.totalTeachers, color: 'bg-emerald-500' },
        { label: 'Classes', value: stats.totalClasses, color: 'bg-violet-500' },
        { label: 'Fees Pending', value: stats.feesPending, color: 'bg-amber-500' },
        { label: 'Attendance %', value: `${stats.attendancePercentage}%`, color: 'bg-blue-500' },
      ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`${card.color} text-white rounded-xl p-6 shadow-lg`}
          >
            <p className="text-sm opacity-90">{card.label}</p>
            <p className="text-3xl font-bold mt-1">{card.value}</p>
          </div>
        ))}
      </div>
      {role !== 'STUDENT' && stats.studentsPerClass?.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Students per Class</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.studentsPerClass}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="className" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
