import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import AppLayout from "./components/layout/AppLayout";

import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentsPage from "./pages/admin/StudentsPage";
import EmployeesPage from "./pages/admin/EmployeesPage";
import ClassesPage from "./pages/admin/ClassesPage";
import FeesPage from "./pages/admin/FeesPage";
import AttendancePage from "./pages/admin/AttendancePage";
import CertificatesPage from "./pages/admin/CertificatesPage";

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import StudentFees from "./pages/student/StudentFees";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentCertificates from "./pages/student/StudentCertificates";

import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeProfile from "./pages/employee/EmployeeProfile";
import ClassAttendance from "./pages/employee/ClassAttendance";

import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AppLayout role="ADMIN" />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="classes" element={<ClassesPage />} />
        <Route path="fees" element={<FeesPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="certificates" element={<CertificatesPage />} />
      </Route>

      {/* Student */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <AppLayout role="STUDENT" />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="fees" element={<StudentFees />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="certificates" element={<StudentCertificates />} />
      </Route>

      {/* Employee */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
            <AppLayout role="EMPLOYEE" />
          </ProtectedRoute>
        }
      >
        <Route index element={<EmployeeDashboard />} />
        <Route path="profile" element={<EmployeeProfile />} />
        <Route path="attendance" element={<ClassAttendance />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
