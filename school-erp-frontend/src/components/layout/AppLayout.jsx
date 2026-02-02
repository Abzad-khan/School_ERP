import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

export default function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}
