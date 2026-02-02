import { useEffect, useState } from "react";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../../api/studentApi";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    className: "",
  });

  const load = async () => {
    const res = await getStudents();
    setStudents(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!form.name || !form.email || !form.className) return;

    if (form.id) {
      await updateStudent(form.id, form);
    } else {
      await createStudent(form);
    }

    setForm({ id: null, name: "", email: "", className: "" });
    load();
  };

  const edit = (s) => {
    setForm(s);
  };

  const remove = async (id) => {
    await deleteStudent(id);
    load();
  };

  return (
    <div className="card">
      <h2>Manage Students</h2>

      <div className="grid">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Class"
          value={form.className}
          onChange={(e) =>
            setForm({ ...form, className: e.target.value })
          }
        />

        <button className="btn-primary" onClick={save}>
          {form.id ? "Update Student" : "Add Student"}
        </button>
      </div>

      <hr style={{ margin: "20px 0" }} />

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Class</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.className}</td>
              <td>{s.email}</td>
              <td>
                <button
                  className="btn-outline"
                  onClick={() => edit(s)}
                >
                  Edit
                </button>{" "}
                <button
                  className="btn-danger"
                  onClick={() => remove(s.id)}
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
