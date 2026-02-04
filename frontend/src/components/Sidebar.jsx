import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const menuItems = {
  ADMIN: [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/students', label: 'Students', icon: '👥' },
    { path: '/employees', label: 'Employees', icon: '👨‍🏫' },
    { path: '/classes', label: 'Classes', icon: '📚' },
    { path: '/attendance', label: 'Attendance', icon: '✅' },
    { path: '/assignments', label: 'Assignments', icon: '📝' },
    { path: '/announcements', label: 'Announcements', icon: '📢' },
    { path: '/fees', label: 'Fees', icon: '💰' },
    { path: '/certificates', label: 'Certificates', icon: '📜' },
    { path: '/gamification', label: 'Gamification', icon: '🏆' },
    { path: '/chat', label: 'Chat', icon: '💬' },
  ],
  EMPLOYEE: [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/attendance', label: 'Attendance', icon: '✅' },
    { path: '/assignments', label: 'Assignments', icon: '📝' },
    { path: '/announcements', label: 'Announcements', icon: '📢' },
    { path: '/chat', label: 'Chat', icon: '💬' },
  ],
  STUDENT: [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/attendance', label: 'Attendance', icon: '✅' },
    { path: '/assignments', label: 'Assignments', icon: '📝' },
    { path: '/announcements', label: 'Announcements', icon: '📢' },
    { path: '/fees', label: 'Fees', icon: '💰' },
    { path: '/certificates', label: 'Certificates', icon: '📜' },
    { path: '/gamification', label: 'Gamification', icon: '🏆' },
    { path: '/chat', label: 'Chat', icon: '💬' },
  ],
};

export default function Sidebar({ open, onToggle }) {
  const { role, username, logout } = useAuth();
  const navigate = useNavigate();
  const items = menuItems[role] || menuItems.STUDENT;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`${
        open ? 'w-64' : 'w-20'
      } bg-slate-800 text-white flex flex-col transition-all duration-300 shrink-0`}
    >
      <div className="p-4 flex items-center justify-between border-b border-slate-700">
        {open && <span className="font-semibold text-lg">School ERP</span>}
        <button
          onClick={onToggle}
          className="p-2 rounded hover:bg-slate-700 transition"
        >
          {open ? '◀' : '▶'}
        </button>
      </div>
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            {open && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700">
        {open && (
          <p className="text-sm text-slate-400 mb-2 truncate">{username}</p>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-600/20 text-red-400 transition"
        >
          <span>🚪</span>
          {open && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
