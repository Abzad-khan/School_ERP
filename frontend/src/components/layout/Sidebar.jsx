import { NavLink } from "react-router-dom";

export default function Sidebar({ role }) {
  const adminLinks = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/students", label: "Students" },
    { to: "/admin/employees", label: "Employees" },
    { to: "/admin/classes", label: "Classes" },
    { to: "/admin/fees", label: "Fees" },
    { to: "/admin/attendance", label: "Attendance" },
    { to: "/admin/certificates", label: "Certificates" },
  ];

  const studentLinks = [
    { to: "/student", label: "Dashboard" },
    { to: "/student/profile", label: "Profile" },
    { to: "/student/fees", label: "Fee Status" },
    { to: "/student/attendance", label: "Attendance" },
    { to: "/student/certificates", label: "Certificates" },
  ];

  const employeeLinks = [
    { to: "/employee", label: "Dashboard" },
    { to: "/employee/profile", label: "Profile" },
    { to: "/employee/attendance", label: "Class Attendance" },
  ];

  const links =
    role === "ADMIN"
      ? adminLinks
      : role === "STUDENT"
      ? studentLinks
      : employeeLinks;

  return (
    <aside className="sidebar">
      <h2 className="logo">School ERP</h2>
      <nav>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
            end
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
