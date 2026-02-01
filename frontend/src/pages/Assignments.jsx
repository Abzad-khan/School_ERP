import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { assignmentApi, classApi, studentApi } from '../api/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function Assignments() {
  const { role } = useAuth();
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [myClass, setMyClass] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [submissionsModalOpen, setSubmissionsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [mySubmissions, setMySubmissions] = useState({});
  const [form, setForm] = useState({ title: '', description: '', className: '', dueDate: '', file: null });
  const fileInputRef = useRef(null);
  const submitInputRef = useRef(null);
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
        const res = await assignmentApi.getByClass(selectedClass);
        setAssignments(res.data);
        if (role === 'STUDENT') {
          const map = {};
          for (const a of res.data) {
            try {
              const sub = await assignmentApi.getMySubmission(a.id);
              if (sub.data) map[a.id] = sub.data;
            } catch {}
          }
          setMySubmissions(map);
        }
      } catch {
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedClass, role]);

  const openCreate = () => {
    setForm({
      title: '',
      description: '',
      className: selectedClass,
      dueDate: new Date().toISOString().slice(0, 10),
      file: null,
    });
    setModalOpen(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('className', form.className);
      fd.append('dueDate', form.dueDate);
      if (form.file) fd.append('file', form.file);
      await assignmentApi.create(fd);
      setModalOpen(false);
      const res = await assignmentApi.getByClass(selectedClass);
      setAssignments(res.data);
    } catch {
      alert('Error creating assignment');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this assignment?')) return;
    try {
      await assignmentApi.delete(id);
      const res = await assignmentApi.getByClass(selectedClass);
      setAssignments(res.data);
    } catch {
      alert('Error deleting');
    }
  };

  const openSubmissions = async (a) => {
    setSelectedAssignment(a);
    try {
      const res = await assignmentApi.getSubmissions(a.id);
      setSubmissions(res.data);
    } catch {
      setSubmissions([]);
    }
    setSubmissionsModalOpen(true);
  };

  const handleSubmit = async (assignmentId, file) => {
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('file', file);
      await assignmentApi.submit(assignmentId, fd);
      const res = await assignmentApi.getByClass(selectedClass);
      setAssignments(res.data);
      const sub = await assignmentApi.getMySubmission(assignmentId);
      setMySubmissions((prev) => ({ ...prev, [assignmentId]: sub.data }));
    } catch {
      alert('Error uploading submission');
    }
  };

  const downloadUrl = async (url) => {
    if (!url) return;
    const full = url.startsWith('http') ? url : `${API_BASE}${url}`;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(full, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = url.split('/').pop() || 'download';
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      window.open(full, '_blank');
    }
  };

  const classOptions = role === 'STUDENT' ? (myClass ? [{ className: myClass }] : []) : classes;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Assignments</h1>
      <p className="text-slate-600 mb-6">Create and manage class assignments</p>
      <div className="flex justify-between items-center mb-6">
        {canEdit && (
          <>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="">Filter by class</option>
              {classOptions.map((c) => (
                <option key={c.id || c.className} value={c.className}>{c.className}</option>
              ))}
            </select>
            <button onClick={openCreate} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              + Create Assignment
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
          assignments.map((a) => (
            <div key={a.id} className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{a.title}</h3>
                  <span className="inline-block bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-sm mt-1">{a.className}</span>
                  <p className="text-slate-600 mt-2">{a.description}</p>
                  <p className="text-slate-500 text-sm mt-2">
                    Due: {new Date(a.dueDate).toLocaleDateString()} | By: {a.createdByName || 'Admin'}
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  {a.attachmentUrl && (
                    <button
                      onClick={() => downloadUrl(a.attachmentUrl)}
                      className="text-indigo-600 hover:underline text-sm"
                    >
                      Download
                    </button>
                  )}
                  {canEdit && (
                    <>
                      <button onClick={() => openSubmissions(a)} className="text-indigo-600 hover:underline text-sm">
                        Submissions: {a.submissionCount || 0}
                      </button>
                      <button onClick={() => handleDelete(a.id)} className="text-red-600 hover:underline text-sm">
                        Delete
                      </button>
                    </>
                  )}
                  {role === 'STUDENT' && (
                    <div className="flex items-center gap-2">
                      {mySubmissions[a.id] ? (
                        <span className="text-green-600 text-sm">Submitted</span>
                      ) : (
                        <>
                          <input
                            ref={submitInputRef}
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleSubmit(a.id, f);
                              e.target.value = '';
                            }}
                          />
                          <button
                            onClick={() => submitInputRef.current?.click()}
                            className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                          >
                            Upload Submission
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Create New Assignment</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                rows={3}
              />
              <select value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })} className="w-full border rounded-lg px-3 py-2" required>
                <option value="">Select class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.className}>{c.className}</option>
                ))}
              </select>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
              <div>
                <p className="text-sm text-slate-600 mb-1">Attachment (Optional)</p>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-400"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={(e) => setForm({ ...form, file: e.target.files?.[0] })}
                  />
                  {form.file ? form.file.name : 'Click to upload or drag and drop'}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg">Create Assignment</button>
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {submissionsModalOpen && selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Submissions - {selectedAssignment.title}</h2>
            <div className="space-y-2">
              {submissions.length ? (
                submissions.map((s) => (
                  <div key={s.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">{s.studentName}</p>
                      <p className="text-sm text-slate-500">{s.rollNo} | {s.className}</p>
                    </div>
                    {s.fileUrl && (
                      <button onClick={() => downloadUrl(s.fileUrl)} className="text-indigo-600 text-sm">Download</button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-slate-500">No submissions yet</p>
              )}
            </div>
            <button onClick={() => setSubmissionsModalOpen(false)} className="mt-4 px-4 py-2 border rounded-lg">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
