import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { certificateApi, studentApi } from '../api/api';

export default function Certificates() {
  const { role } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    studentId: null,
    type: '',
    issuedDate: new Date().toISOString().slice(0, 10),
  });

  const isAdmin = role === 'ADMIN';

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (role === 'STUDENT') {
          const res = await certificateApi.getMe();
          setCertificates(res.data);
        } else {
          const [cRes, sRes] = await Promise.all([
            certificateApi.getAll(),
            studentApi.getAll(),
          ]);
          setCertificates(cRes.data);
          setStudents(sRes.data);
        }
      } catch {
        setCertificates([]);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [role]);

  const openCreate = () => {
    setForm({
      studentId: students[0]?.id,
      type: '',
      issuedDate: new Date().toISOString().slice(0, 10),
    });
    setModalOpen(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await certificateApi.create({
        studentId: form.studentId,
        type: form.type,
        issuedDate: form.issuedDate,
      });
      setModalOpen(false);
      const res = await certificateApi.getAll();
      setCertificates(res.data);
    } catch {
      alert('Error creating certificate');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this certificate?')) return;
    try {
      await certificateApi.delete(id);
      const res =
        role === 'STUDENT'
          ? await certificateApi.getMe()
          : await certificateApi.getAll();
      setCertificates(res.data);
    } catch {
      alert('Error deleting');
    }
  };

  // ✅ NEW: DOWNLOAD CERTIFICATE
  const handleDownload = async (id) => {
    try {
      const res = await certificateApi.download(id);
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: 'application/pdf' })
      );
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download certificate');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Certificates</h1>
        {isAdmin && (
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Add Certificate
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              {isAdmin && (
                <th className="text-left px-4 py-3">Student</th>
              )}
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Issued Date</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((c) => (
              <tr key={c.id} className="border-t hover:bg-slate-50">
                {isAdmin && (
                  <td className="px-4 py-3">{c.studentName}</td>
                )}
                <td className="px-4 py-3">{c.type}</td>
                <td className="px-4 py-3">{c.issuedDate}</td>
                <td className="px-4 py-3 space-x-3">
                  <button
                    onClick={() => handleDownload(c.id)}
                    className="text-indigo-600 hover:underline"
                  >
                    Download
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && isAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Add Certificate
            </h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <select
                value={form.studentId || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    studentId: Number(e.target.value),
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                <option value="">Select Student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} - {s.rollNo}
                  </option>
                ))}
              </select>

              <input
                placeholder="Type (e.g. Merit, Attendance)"
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
                required
              />

              <input
                type="date"
                value={form.issuedDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    issuedDate: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
              />

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
