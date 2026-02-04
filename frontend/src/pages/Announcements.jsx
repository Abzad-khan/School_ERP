import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { announcementApi, classApi, studentApi } from '../api/api';

export default function Announcements() {
  const { role } = useAuth();
  const [classes, setClasses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [myClass, setMyClass] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', className: '' });
  const canEdit = role === 'ADMIN' || role === 'EMPLOYEE';

  useEffect(() => {
    const load = async () => {
      try {
        if (role === 'STUDENT') {
          const me = await studentApi.getMe();
          setMyClass(me.data.className || '');
          setSelectedClass(me.data.className || '');
        } else {
          const cRes = await classApi.getAll();
          setClasses(cRes.data);
          if (cRes.data.length) setSelectedClass(cRes.data[0].className);
        }
      } catch {
        setClasses([]);
      }
    };
    load();
  }, [role]);

  useEffect(() => {
    if (!selectedClass) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await announcementApi.getByClass(selectedClass);
        setAnnouncements(res.data);
      } catch {
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedClass]);

  const openCreate = () => {
    setForm({ title: '', message: '', className: selectedClass });
    setModalOpen(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await announcementApi.create(form);
      setModalOpen(false);
      const res = await announcementApi.getByClass(selectedClass);
      setAnnouncements(res.data);
    } catch {
      alert('Error creating announcement');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this announcement?')) return;
    try {
      await announcementApi.delete(id);
      const res = await announcementApi.getByClass(selectedClass);
      setAnnouncements(res.data);
    } catch {
      alert('Error deleting');
    }
  };

  const classOptions = role === 'STUDENT' ? (myClass ? [{ className: myClass }] : []) : classes;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Announcements</h1>
        {canEdit && (
          <>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              {classOptions.map((c) => (
                <option key={c.id || c.className} value={c.className}>{c.className}</option>
              ))}
            </select>
            <button
              onClick={openCreate}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Add Announcement
            </button>
          </>
        )}
      </div>
      {role === 'STUDENT' && !myClass && (
        <p className="text-slate-600 mb-4">You are not assigned to a class yet.</p>
      )}
      <div className="space-y-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          announcements.map((a) => (
            <div key={a.id} className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold">{a.title}</h3>
              <p className="text-slate-600 mt-2">{a.message}</p>
              <p className="text-slate-500 text-sm mt-2">
                {a.createdByName || 'Admin'} • {a.createdAt?.slice(0, 10)}
              </p>
              {canEdit && (
                <button
                  onClick={() => handleDelete(a.id)}
                  className="mt-2 text-red-600 text-sm hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Announcement</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
              <textarea
                placeholder="Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                rows={4}
                required
              />
              <select
                value={form.className}
                onChange={(e) => setForm({ ...form, className: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.className}>{c.className}</option>
                ))}
              </select>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg">Post</button>
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
