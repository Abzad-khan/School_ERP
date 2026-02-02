import { useEffect, useState } from "react";
import {
  getAttendance,
  addAttendance,
  updateAttendance,
  deleteAttendance
} from "../../api/attendanceApi";

export default function Attendance() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    studentName: "",
    date: "",
    present: true
  });
  const [editId, setEditId] = useState(null);

  const load = async () => {
    const res = await getAttendance();
    setItems(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (!form.studentName || !form.date) {
      return alert("All fields required");
    }

    if (editId) {
      await updateAttendance(editId, form);
      setEditId(null);
    } else {
      await addAttendance(form);
    }

    setForm({ studentName: "", date: "", present: true });
    load();
  };

  const edit = (a) => {
    setEditId(a.id);
    setForm(a);
  };

  const remove = async (id) => {
    if (window.confirm("Delete this record?")) {
      await deleteAttendance(id);
      load();
    }
  };

  return (
    <div className="card">
      <h2>Manage Attendance</h2>

      <div className="form-group">
        <input
          className="input"
          placeholder="Student Name"
          value={form.studentName}
          onChange={(e) =>
            setForm({ ...form, studentName: e.target.value })
          }
        />

        <input
          className="input"
          type="date"
          value={form.date}
          onChange={(e) =>
            setForm({ ...form, date: e.target.value })
          }
        />

        <select
          className="input"
          value={form.present}
          onChange={(e) =>
            setForm({ ...form, present: e.target.value === "true" })
          }
        >
          <option value="true">Present</option>
          <option value="false">Absent</option>
        </select>

        <button className="btn-primary" onClick={submit}>
          {editId ? "Update Attendance" : "Mark Attendance"}
        </button>
      </div>

      <hr />

      <table className="table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((a) => (
            <tr key={a.id}>
              <td>{a.studentName}</td>
              <td>{a.date}</td>
              <td>{a.present ? "Present" : "Absent"}</td>
              <td>
                <button className="btn-outline" onClick={() => edit(a)}>
                  Edit
                </button>
                <button
                  className="btn-danger"
                  onClick={() => remove(a.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
