import { useState, useEffect } from 'react';
import { classApi, employeeApi } from '../api/api';

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ className: '', teacherId: null });

  const fetchData = async () => {
    try {
      const [cRes, eRes] = await Promise.all([classApi.getAll(), employeeApi.getAll()]);
      setClasses(cRes.data);
      setEmployees(eRes.data);
    } catch {
      setClasses([]);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await classApi.create({
        className: form.className,
        teacherId: form.teacherId || null,
      });
      setModalOpen(false);
      setForm({ className: '', teacherId: null });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating class');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this class?')) return;
    try {
      await classApi.delete(id);
      fetchData();
    } catch {
      alert('Error deleting class');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Classes</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Add Class
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((c) => (
          <div key={c.id} className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-slate-800">{c.className}</h3>
            <p className="text-slate-600 mt-1">Teacher: {c.teacherName || '-'}</p>
            <p className="text-slate-500 text-sm mt-1">Students: {c.students?.length || 0}</p>
            <button
              onClick={() => handleDelete(c.id)}
              className="mt-3 text-red-600 text-sm hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Class</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                placeholder="Class Name (e.g. 10A)"
                value={form.className}
                onChange={(e) => setForm({ ...form, className: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
              <select
                value={form.teacherId || ''}
                onChange={(e) => setForm({ ...form, teacherId: e.target.value ? Number(e.target.value) : null })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select Teacher (optional)</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.name} - {emp.subject}</option>
                ))}
              </select>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg">Create</button>
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
