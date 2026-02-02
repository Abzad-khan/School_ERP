import { useEffect, useState } from "react";
import {
  getGamifications,
  createGamification,
  updateGamification,
  deleteGamification,
} from "../../api/gamificationApi";

export default function Gamification() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    id: null,
    studentName: "",
    points: "",
    badge: "",
  });

  const load = async () => {
    const res = await getGamifications();
    setItems(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!form.studentName || !form.points || !form.badge) return;

    const payload = {
      studentName: form.studentName,
      points: Number(form.points), // 👈 convert to number
      badge: form.badge,
    };

    if (form.id) {
      await updateGamification(form.id, payload);
    } else {
      await createGamification(payload);
    }

    setForm({ id: null, studentName: "", points: "", badge: "" });
    load();
  };

  const edit = (g) =>
    setForm({
      id: g.id,
      studentName: g.studentName || "",
      points: g.points || "",
      badge: g.badge || "",
    });

  const remove = async (id) => {
    await deleteGamification(id);
    load();
  };

  return (
    <div className="card">
      <h2>Gamification</h2>

      <div className="grid">
        <input
          placeholder="Student Name"
          value={form.studentName}
          onChange={(e) =>
            setForm({ ...form, studentName: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Points"
          value={form.points}
          onChange={(e) =>
            setForm({ ...form, points: e.target.value })
          }
        />

        <input
          placeholder="Badge"
          value={form.badge}
          onChange={(e) =>
            setForm({ ...form, badge: e.target.value })
          }
        />

        <button className="btn-primary" onClick={save}>
          {form.id ? "Update" : "Add"}
        </button>
      </div>

      <hr style={{ margin: "20px 0" }} />

      <table className="table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Points</th>
            <th>Badge</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map((g) => (
            <tr key={g.id}>
              <td>{g.studentName}</td>
              <td>{g.points}</td>
              <td>{g.badge}</td>
              <td>
                <button
                  className="btn-outline"
                  onClick={() => edit(g)}
                >
                  Edit
                </button>{" "}
                <button
                  className="btn-danger"
                  onClick={() => remove(g.id)}
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
