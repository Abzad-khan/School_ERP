import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

// Admin pages features
import Dashboard from "./pages/admin/Dashboard";
import Students from "./pages/admin/Students";
import Assignments from "./pages/admin/Assignments";
import Attendance from "./pages/admin/Attendance";
import Announcements from "./pages/admin/Announcements";

import Fees from "./pages/admin/Fees";
import Chat from "./pages/admin/Chat";
import Certificates from "./pages/admin/Certificates";
import Gamification from "./pages/admin/Gamification";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />


      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="announcements" element={<Announcements />} />

        <Route path="fees" element={<Fees />} />
        <Route path="chat" element={<Chat />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="gamification" element={<Gamification />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
