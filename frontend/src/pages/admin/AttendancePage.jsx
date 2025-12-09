import { useEffect, useState } from "react";
import DataTable from "../../components/common/DataTable";
import {
  getAllAttendanceRecords,
  createAttendanceRecord,
  updateAttendanceRecord,
  deleteAttendanceRecord,
} from "../../services/attendanceService";

const emptyForm = {
  date: "",
  className: "",
  totalStudents: "",
  present: "",
  absent: "",
};

export default function AttendancePage() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    ...emptyForm,
    date: new Date().toISOString().slice(0, 10),
  });
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    const data = await getAllAttendanceRecords();
    setRecords(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateAttendanceRecord(editingId, form);
    } else {
      await createAttendanceRecord(form);
    }
    setForm({
      ...emptyForm,
      date: new Date().toISOString().slice(0, 10),
    });
    setEditingId(null);
    load();
  };

  const handleEdit = (rec) => {
    setEditingId(rec.id);
    setForm({
      date: rec.date,
      className: rec.className,
      totalStudents: rec.totalStudents,
      present: rec.present,
      absent: rec.absent,
    });
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this attendance record?")) {
      await deleteAttendanceRecord(id);
      load();
    }
  };

  const columns = [
    { Header: "Date", accessor: "date" },
    { Header: "Class", accessor: "className" },
    { Header: "Total Students", accessor: "totalStudents" },
    { Header: "Present", accessor: "present" },
    { Header: "Absent", accessor: "absent" },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: (row) => (
        <>
          <button onClick={() => handleEdit(row)}>Edit</button>{" "}
          <button onClick={() => handleDelete(row.id)}>Delete</button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Attendance Management</h2>
      <div className="two-column">
        <div>
          <h3>{editingId ? "Edit Attendance" : "Add Attendance"}</h3>
          <form onSubmit={handleSubmit} className="form-grid">
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
            <input
              name="className"
              placeholder="Class (e.g. 10-A)"
              value={form.className}
              onChange={handleChange}
            />
            <input
              name="totalStudents"
              type="number"
              placeholder="Total Students"
              value={form.totalStudents}
              onChange={handleChange}
            />
            <input
              name="present"
              type="number"
              placeholder="Present"
              value={form.present}
              onChange={handleChange}
            />
            <input
              name="absent"
              type="number"
              placeholder="Absent"
              value={form.absent}
              onChange={handleChange}
            />
            <button type="submit">
              {editingId ? "Update Record" : "Add Record"}
            </button>
          </form>
        </div>

        <div>
          <h3>Attendance Records</h3>
          <DataTable columns={columns} data={records} />
        </div>
      </div>
    </div>
  );
}
