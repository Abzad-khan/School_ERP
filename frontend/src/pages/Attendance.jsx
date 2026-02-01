import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { attendanceApi, classApi, studentApi } from '../api/api';

export default function Attendance() {
  const { role } = useAuth();
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [studentView, setStudentView] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (role === 'STUDENT') {
        try {
          const res = await attendanceApi.getMe();
          setStudentView(res.data);
        } catch {
          setStudentView([]);
        }
        return;
      }
      try {
        const cRes = await classApi.getAll();
        setClasses(cRes.data);
        if (cRes.data.length) setSelectedClass(cRes.data[0].className);
      } catch {
        setClasses([]);
      }
    };
    load();
  }, [role]);

  useEffect(() => {
    if (role === 'STUDENT' || !selectedClass) return;
    const load = async () => {
      setLoading(true);
      try {
        const [sRes, aRes] = await Promise.all([
          studentApi.getByClass(selectedClass),
          attendanceApi.getByClassAndDate(selectedClass, date),
        ]);
        setStudents(sRes.data);
        const byStudent = {};
        aRes.data.forEach((a) => { byStudent[a.studentId] = a.status; });
        setAttendance(byStudent);
      } catch {
        setStudents([]);
        setAttendance({});
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [role, selectedClass, date]);

  const toggleStatus = (studentId) => {
    const curr = attendance[studentId] || 'P';
    setAttendance({ ...attendance, [studentId]: curr === 'P' ? 'A' : 'P' });
  };

  const saveAttendance = async () => {
    const records = students.map((s) => ({
      studentId: s.id,
      status: attendance[s.id] || 'P',
    }));
    try {
      await attendanceApi.save({
        className: selectedClass,
        date,
        records,
      });
      alert('Saved');
    } catch {
      alert('Error saving');
    }
  };

  if (role === 'STUDENT') {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-6">My Attendance</h1>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {studentView.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="px-4 py-3">{a.date}</td>
                  <td className="px-4 py-3">
                    <span className={a.status === 'P' ? 'text-green-600' : 'text-red-600'}>
                      {a.status === 'P' ? 'Present' : 'Absent'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Attendance</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          {classes.map((c) => (
            <option key={c.id} value={c.className}>{c.className}</option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded-lg px-3 py-2"
        />
        <button
          onClick={saveAttendance}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          Save
        </button>
      </div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left px-4 py-3">Roll No</th>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-t hover:bg-slate-50">
                <td className="px-4 py-3">{s.rollNo}</td>
                <td className="px-4 py-3">{s.name}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleStatus(s.id)}
                    className={`px-3 py-1 rounded ${(attendance[s.id] || 'P') === 'P' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {(attendance[s.id] || 'P') === 'P' ? 'Present' : 'Absent'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
