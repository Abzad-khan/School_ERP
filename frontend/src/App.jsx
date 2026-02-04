import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { RoleRoute } from './routes/RoleRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Employees from './pages/Employees';
import Classes from './pages/Classes';
import Attendance from './pages/Attendance';
import Assignments from './pages/Assignments';
import Announcements from './pages/Announcements';
import Fees from './pages/Fees';
import Certificates from './pages/Certificates';
import Gamification from './pages/Gamification';
import Chat from './pages/Chat';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route
          path="students"
          element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <Students />
            </RoleRoute>
          }
        />
        <Route
          path="employees"
          element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <Employees />
            </RoleRoute>
          }
        />
        <Route
          path="classes"
          element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <Classes />
            </RoleRoute>
          }
        />
        <Route path="attendance" element={<Attendance />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="fees" element={<Fees />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="gamification" element={<Gamification />} />
        <Route path="chat" element={<Chat />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
