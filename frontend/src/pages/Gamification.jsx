import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { gamificationApi, badgeApi, classApi, studentApi } from '../api/api';

export default function Gamification() {
  const { role } = useAuth();
  const [classes, setClasses] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [myClass, setMyClass] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pointsModalOpen, setPointsModalOpen] = useState(false);
  const [badgeModalOpen, setBadgeModalOpen] = useState(false);
  const [pointsForm, setPointsForm] = useState({ studentId: null, className: '', points: 0, badges: '' });
  const [badgeForm, setBadgeForm] = useState({ name: '', description: '', pointsRequired: 100 });
  const isAdmin = role === 'ADMIN';

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
    if (role === 'ADMIN') {
      studentApi.getAll().then((r) => setStudents(r.data)).catch(() => setStudents([]));
    }
  }, [role]);

  useEffect(() => {
    if (!selectedClass) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await gamificationApi.getStats(selectedClass);
        setStats(res.data);
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedClass]);

  const openPointsModal = () => {
    setPointsForm({
      studentId: students[0]?.id,
      className: selectedClass,
      points: 0,
      badges: '',
    });
    setPointsModalOpen(true);
  };

  const openBadgeModal = () => {
    setBadgeForm({ name: '', description: '', pointsRequired: 100 });
    setBadgeModalOpen(true);
  };

  const handlePointsSubmit = async (e) => {
    e.preventDefault();
    try {
      await gamificationApi.create({
        studentId: pointsForm.studentId,
        className: pointsForm.className,
        points: pointsForm.points,
        badges: pointsForm.badges || null,
      });
      setPointsModalOpen(false);
      const res = await gamificationApi.getStats(selectedClass);
      setStats(res.data);
    } catch {
      alert('Error adding points');
    }
  };

  const handleBadgeSubmit = async (e) => {
    e.preventDefault();
    try {
      await badgeApi.create(badgeForm);
      setBadgeModalOpen(false);
      const res = await gamificationApi.getStats(selectedClass);
      setStats(res.data);
    } catch {
      alert('Error creating badge');
    }
  };

  const classOptions = role === 'STUDENT' ? (myClass ? [{ id: 1, className: myClass }] : []) : classes;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Gamification</h1>
      <p className="text-slate-600 mb-6">Student achievements and leaderboard</p>
      <div className="flex justify-between items-center mb-6">
        {isAdmin && (
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            {classOptions.map((c) => (
              <option key={c.id} value={c.className}>{c.className}</option>
            ))}
          </select>
        )}
        {isAdmin && (
          <div className="flex gap-2">
            <button onClick={openPointsModal} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              + Award Points
            </button>
            <button onClick={openBadgeModal} className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700">
              Create Badge
            </button>
          </div>
        )}
      </div>
      {role === 'STUDENT' && !myClass && (
        <p className="text-slate-600 mb-4">You are not assigned to a class yet.</p>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : stats ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
                <div className="text-3xl mb-2">🏆</div>
                <p className="text-sm text-slate-600">Total Participants</p>
                <p className="text-2xl font-bold">{stats.totalParticipants}</p>
              </div>
              <div className="bg-violet-50 rounded-xl p-6 border border-violet-100">
                <div className="text-3xl mb-2">🛡️</div>
                <p className="text-sm text-slate-600">Available Badges</p>
                <p className="text-2xl font-bold">{stats.availableBadges}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <div className="text-3xl mb-2">⭐</div>
                <p className="text-sm text-slate-600">Top Score</p>
                <p className="text-2xl font-bold">{stats.topScore} pts</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Leaderboard</h2>
              {stats.leaderboard?.length ? (
                <div className="space-y-3">
                  {stats.leaderboard.map((g, i) => (
                    <div key={g.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                        </span>
                        <div>
                          <p className="font-semibold">{g.studentName}</p>
                          <p className="text-sm text-slate-500">{g.rollNo} | {g.className}</p>
                        </div>
                      </div>
                      <span className="font-bold text-indigo-600">{g.points} points</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <span className="text-4xl block mb-2">🏆</span>
                  No leaderboard data yet
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Available Badges</h2>
              {stats.badges?.length ? (
                <div className="space-y-3">
                  {stats.badges.map((b) => (
                    <div key={b.id} className="p-3 rounded-lg border border-slate-200">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl text-indigo-500">🛡️</span>
                        <div>
                          <p className="font-medium">{b.name}</p>
                          <p className="text-sm text-slate-600">{b.description}</p>
                          <p className="text-xs text-slate-500 mt-1">{b.pointsRequired} pts required</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-6">No badges available</p>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {pointsModalOpen && isAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Award Points</h2>
            <form onSubmit={handlePointsSubmit} className="space-y-3">
              <select value={pointsForm.studentId || ''} onChange={(e) => setPointsForm({ ...pointsForm, studentId: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2" required>
                <option value="">Select Student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} - {s.className}</option>
                ))}
              </select>
              <select value={pointsForm.className} onChange={(e) => setPointsForm({ ...pointsForm, className: e.target.value })} className="w-full border rounded-lg px-3 py-2">
                {classes.map((c) => (
                  <option key={c.id} value={c.className}>{c.className}</option>
                ))}
              </select>
              <input type="number" placeholder="Points" value={pointsForm.points || ''} onChange={(e) => setPointsForm({ ...pointsForm, points: parseInt(e.target.value) || 0 })} className="w-full border rounded-lg px-3 py-2" />
              <input placeholder="Badges (optional)" value={pointsForm.badges} onChange={(e) => setPointsForm({ ...pointsForm, badges: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg">Save</button>
                <button type="button" onClick={() => setPointsModalOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {badgeModalOpen && isAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create Badge</h2>
            <form onSubmit={handleBadgeSubmit} className="space-y-3">
              <input placeholder="Badge Name" value={badgeForm.name} onChange={(e) => setBadgeForm({ ...badgeForm, name: e.target.value })} className="w-full border rounded-lg px-3 py-2" required />
              <textarea placeholder="Description (e.g. Earned by reaching 100 points)" value={badgeForm.description} onChange={(e) => setBadgeForm({ ...badgeForm, description: e.target.value })} className="w-full border rounded-lg px-3 py-2" rows={2} />
              <input type="number" placeholder="Points Required" value={badgeForm.pointsRequired || ''} onChange={(e) => setBadgeForm({ ...badgeForm, pointsRequired: parseInt(e.target.value) || 0 })} className="w-full border rounded-lg px-3 py-2" />
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-2 bg-violet-600 text-white rounded-lg">Create</button>
                <button type="button" onClick={() => setBadgeModalOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
