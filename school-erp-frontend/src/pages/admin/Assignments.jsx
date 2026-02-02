import { useEffect, useState } from "react";
import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from "../../api/assignmentApi";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    dueDate: "",
  });

  const load = async () => {
    const res = await getAssignments();
    setAssignments(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!form.title || !form.description || !form.dueDate) return;

    if (form.id) {
      await updateAssignment(form.id, form);
    } else {
      await createAssignment(form);
    }

    setForm({ id: null, title: "", description: "", dueDate: "" });
    load();
  };

  const edit = (a) => {
    setForm(a);
  };

  const remove = async (id) => {
    await deleteAssignment(id);
    load();
  };

  return (
    <div className="card">
      <h2>Manage Assignments</h2>

      <div className="grid">
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />
        <input
          type="date"
          value={form.dueDate}
          onChange={(e) =>
            setForm({ ...form, dueDate: e.target.value })
          }
        />

        <button className="btn-primary" onClick={save}>
          {form.id ? "Update Assignment" : "Add Assignment"}
        </button>
      </div>

      <hr style={{ margin: "20px 0" }} />

      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Due Date</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {assignments.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.dueDate}</td>
              <td>{a.description}</td>
              <td>
                <button
                  className="btn-outline"
                  onClick={() => edit(a)}
                >
                  Edit
                </button>{" "}
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
