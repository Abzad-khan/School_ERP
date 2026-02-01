import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { feeApi, studentApi } from '../api/api';

export default function Fees() {
  const { role } = useAuth();
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ studentId: null, amount: '', status: 'PENDING' });
  const isAdmin = role === 'ADMIN';

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (role === 'STUDENT') {
          const res = await feeApi.getMe();
          setFees(res.data);
        } else {
          const [fRes, sRes] = await Promise.all([feeApi.getAll(), studentApi.getAll()]);
          setFees(fRes.data);
          setStudents(sRes.data);
        }
      } catch {
        setFees([]);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [role]);

  const openCreate = () => {
    setForm({ studentId: students[0]?.id, amount: '', status: 'PENDING' });
    setModalOpen(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await feeApi.create({
        studentId: form.studentId,
        amount: parseFloat(form.amount),
        status: form.status,
      });
      setModalOpen(false);
      const res = await feeApi.getAll();
      setFees(res.data);
    } catch {
      alert('Error creating fee');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this fee record?')) return;
    try {
      await feeApi.delete(id);
      const res = role === 'STUDENT' ? await feeApi.getMe() : await feeApi.getAll();
      setFees(res.data);
    } catch {
      alert('Error deleting');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Fees</h1>
        {isAdmin && (
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Add Fee
          </button>
        )}
      </div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              {isAdmin && <th className="text-left px-4 py-3">Student</th>}
              <th className="text-left px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Status</th>
              {isAdmin && <th></th>}
            </tr>
          </thead>
          <tbody>
            {fees.map((f) => (
              <tr key={f.id} className="border-t hover:bg-slate-50">
                {isAdmin && <td className="px-4 py-3">{f.studentName}</td>}
                <td className="px-4 py-3">{f.amount}</td>
                <td className="px-4 py-3">
                  <span className={f.status === 'PAID' ? 'text-green-600' : 'text-amber-600'}>
                    {f.status}
                  </span>
                </td>
                {isAdmin && (
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(f.id)} className="text-red-600">Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && isAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Fee</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <select
                value={form.studentId || ''}
                onChange={(e) => setForm({ ...form, studentId: Number(e.target.value) })}
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                <option value="">Select Student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} - {s.rollNo}</option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
              </select>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg">Add</button>
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
