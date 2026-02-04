import { useState, useEffect } from 'react';
import { employeeApi, classApi } from '../api/api';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    username: '', password: '', employeeName: '', subject: '', classInChargeId: null,
    phone: '', email: '', qualification: '',
  });

  const fetchData = async () => {
    try {
      const [eRes, cRes] = await Promise.all([
        employeeApi.getAll(),
        classApi.getAll(),
      ]);
      setEmployees(eRes.data);
      setClasses(cRes.data);
    } catch {
      setEmployees([]);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = employees.filter((e) => {
    const q = search.toLowerCase();
    return !search || e.name?.toLowerCase().includes(q) || e.subject?.toLowerCase().includes(q);
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ username: '', password: '', employeeName: '', subject: '', classInChargeId: null, phone: '', email: '', qualification: '' });
    setModalOpen(true);
  };

  const openEdit = (e) => {
    setEditing(e);
    const classInCharge = classes.find((c) => c.className === e.classInCharge);
    setForm({
      username: e.username,
      employeeName: e.name,
      subject: e.subject,
      classInChargeId: classInCharge?.id || null,
      phone: e.phone || '',
      email: e.email || '',
      qualification: e.qualification || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    try {
      if (editing) {
        await employeeApi.update(editing.id, {
          name: form.employeeName,
          subject: form.subject,
          classInChargeId: form.classInChargeId,
          phone: form.phone,
          email: form.email,
          qualification: form.qualification,
        });
      } else {
        await employeeApi.create({
          username: form.username,
          password: form.password,
          role: 'EMPLOYEE',
          employeeName: form.employeeName,
          subject: form.subject,
          classInChargeId: form.classInChargeId,
          phone: form.phone,
          email: form.email,
          qualification: form.qualification,
        });
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving employee');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this employee?')) return;
    try {
      await employeeApi.delete(id);
      fetchData();
    } catch {
      alert('Error deleting employee');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Employees Management</h1>
      <p className="text-slate-600 mb-6">Manage teachers and staff</p>
      <div className="mb-4">
        <input
          type="search"
          placeholder="Search by name or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-slate-300 rounded-lg px-4 py-2 w-full max-w-md focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium">NAME</th>
              <th className="text-left px-4 py-3 font-medium">SUBJECT</th>
              <th className="text-left px-4 py-3 font-medium">CLASS IN CHARGE</th>
              <th className="text-left px-4 py-3 font-medium">PHONE</th>
              <th className="text-left px-4 py-3 font-medium">EMAIL</th>
              <th className="text-left px-4 py-3 font-medium">QUALIFICATION</th>
              <th className="text-right px-4 py-3 font-medium">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id} className="border-t border-slate-200 hover:bg-slate-50">
                <td className="px-4 py-3">{e.name}</td>
                <td className="px-4 py-3">
                  <span className="inline-block bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">{e.subject}</span>
                </td>
                <td className="px-4 py-3">{e.classInCharge || '-'}</td>
                <td className="px-4 py-3">{e.phone || '-'}</td>
                <td className="px-4 py-3">{e.email || '-'}</td>
                <td className="px-4 py-3">{e.qualification || '-'}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(e)} className="text-indigo-600 hover:underline mr-3">Edit</button>
                  <button onClick={() => handleDelete(e.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end">
        <button onClick={openCreate} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          + Add Employee
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">{editing ? 'Edit Employee' : 'Add Employee'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input placeholder="Name" value={form.employeeName} onChange={(e) => setForm({ ...form, employeeName: e.target.value })} className="w-full border rounded-lg px-3 py-2" required />
              {!editing && (
                <>
                  <input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="w-full border rounded-lg px-3 py-2" required />
                  <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border rounded-lg px-3 py-2" required />
                </>
              )}
              <input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
              <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
              <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
              <input placeholder="Qualification (e.g. M.Sc. Mathematics)" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
              <select value={form.classInChargeId || ''} onChange={(e) => setForm({ ...form, classInChargeId: e.target.value ? Number(e.target.value) : null })} className="w-full border rounded-lg px-3 py-2">
                <option value="">Class In Charge (optional)</option>
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
