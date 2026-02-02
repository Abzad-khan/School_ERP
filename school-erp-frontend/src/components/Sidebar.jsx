import { Link } from "react-router-dom";

import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>School ERP</h2>

      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/dashboard/students">Students</NavLink>
      <NavLink to="/dashboard/assignments">Assignments</NavLink>
      <NavLink to="/dashboard/attendance">Attendance</NavLink>
      <NavLink to="/dashboard/announcements">Announcements</NavLink>
      <NavLink to="/dashboard/fees">Fees</NavLink>
      <NavLink to="/dashboard/chat">Chat</NavLink>
      <NavLink to="/dashboard/certificates">Certificates</NavLink>
      <NavLink to="/dashboard/gamification">Gamification</NavLink>
    </div>
  );
}
