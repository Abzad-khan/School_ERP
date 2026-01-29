import { useState, useEffect } from 'react';
import { studentApi, classApi } from '../api/api';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filterClass, setFilterClass] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ username: '', password: '', name: '', rollNo: '', section: 'A', parent: '', phone: '', classId: null });

  const fetchData = async () => {
    try {
      const [sRes, cRes] = await Promise.all([
        studentApi.getAll(),
        classApi.getAll(),
      ]);
      setStudents(sRes.data);
      setClasses(cRes.data);
    } catch {
      setStudents([]);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = students.filter((s) => {
    const matchClass = filterClass === 'All' || s.className === filterClass;
    const matchSearch = !search || 
      s.name?.toLowerCase().includes(search.toLowerCase()) || 
      s.rollNo?.toLowerCase().includes(search.toLowerCase());
    return matchClass && matchSearch;
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ username: '', password: '', name: '', rollNo: '', section: 'A', parent: '', phone: '', classId: null });
    setModalOpen(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({
      username: s.username,
      name: s.name,
      rollNo: s.rollNo,
      section: s.section || 'A',
      parent: s.parent || '',
      phone: s.phone || '',
      classId: classes.find((c) => c.className === s.className)?.id || null,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await studentApi.update(editing.id, {
          name: form.name,
          rollNo: form.rollNo,
          section: form.section,
          parent: form.parent,
          phone: form.phone,
          classId: form.classId,
        });
      } else {
        await studentApi.create({
          username: form.username,
          password: form.password,
          role: 'STUDENT',
          name: form.name,
          rollNo: form.rollNo,
          section: form.section,
          parent: form.parent,
          phone: form.phone,
          classId: form.classId,
        });
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving student');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this student?')) return;
    try {
      await studentApi.delete(id);
      fetchData();
    } catch {
      alert('Error deleting student');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Students Management</h1>
      <p className="text-slate-600 mb-6">Manage all students in the school</p>
      <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
        <div className="flex gap-3 flex-1 max-w-xl">
          <input
            type="search"
            placeholder="Search by name or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2"
          >
            <option value="All">Filter by class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.className}>{c.className}</option>
            ))}
          </select>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
        >
          + Add Student
        </button>
      </div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilterClass('All')}
          className={`px-4 py-2 rounded-lg ${filterClass === 'All' ? 'bg-indigo-600 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
        >
          All
        </button>
        {classes.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilterClass(c.className)}
            className={`px-4 py-2 rounded-lg ${filterClass === c.className ? 'bg-indigo-600 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
          >
            {c.className}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium">NAME</th>
              <th className="text-left px-4 py-3 font-medium">ROLL NO</th>
              <th className="text-left px-4 py-3 font-medium">CLASS</th>
              <th className="text-left px-4 py-3 font-medium">SECTION</th>
              <th className="text-left px-4 py-3 font-medium">PARENT</th>
              <th className="text-left px-4 py-3 font-medium">PHONE</th>
              <th className="text-right px-4 py-3 font-medium">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-t border-slate-200 hover:bg-slate-50">
                <td className="px-4 py-3">{s.name}</td>
                <td className="px-4 py-3">
                  <span className="inline-block bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">{s.rollNo}</span>
                </td>
                <td className="px-4 py-3">{s.className || '-'}</td>
                <td className="px-4 py-3">{s.section}</td>
                <td className="px-4 py-3">{s.parent || '-'}</td>
                <td className="px-4 py-3">{s.phone || '-'}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(s)} className="text-indigo-600 hover:underline mr-3">Edit</button>
                  <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">{editing ? 'Edit Student' : 'Add Student'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-3 py-2" required />
              <input placeholder="Roll No" value={form.rollNo} onChange={(e) => setForm({ ...form, rollNo: e.target.value })} className="w-full border rounded-lg px-3 py-2" required />
              {!editing && (
                <>
                  <input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="w-full border rounded-lg px-3 py-2" required />
                  <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border rounded-lg px-3 py-2" required />
                </>
              )}
              <input placeholder="Section" value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
              <input placeholder="Parent Name" value={form.parent} onChange={(e) => setForm({ ...form, parent: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
              <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
              <select value={form.classId || ''} onChange={(e) => setForm({ ...form, classId: e.target.value ? Number(e.target.value) : null })} className="w-full border rounded-lg px-3 py-2">
                <option value="">Select Class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.className}</option>
                ))}
              </select>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg">Save</button>
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
