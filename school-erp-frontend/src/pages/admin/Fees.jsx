import { useEffect, useState } from "react";
import {
  getFees,
  createFee,
  updateFee,
  deleteFee,
} from "../../api/feeApi";

export default function Fees() {
  const [fees, setFees] = useState([]);
  const [form, setForm] = useState({
    id: null,
    studentName: "",
    amount: "",
    status: "UNPAID",
  });

  const load = async () => {
    const res = await getFees();
    setFees(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!form.studentName || !form.amount) return;

    if (form.id) {
      await updateFee(form.id, form);
    } else {
      await createFee(form);
    }

    setForm({ id: null, studentName: "", amount: "", status: "UNPAID" });
    load();
  };

  const edit = (f) => setForm(f);

  const remove = async (id) => {
    await deleteFee(id);
    load();
  };

  return (
    <div className="card">
      <h2>Manage Fees</h2>

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
          placeholder="Amount"
          value={form.amount}
          onChange={(e) =>
            setForm({ ...form, amount: e.target.value })
          }
        />
        <select
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value })
          }
        >
          <option value="PAID">PAID</option>
          <option value="UNPAID">UNPAID</option>
        </select>

        <button className="btn-primary" onClick={save}>
          {form.id ? "Update Fee" : "Add Fee"}
        </button>
      </div>

      <hr style={{ margin: "20px 0" }} />

      <table className="table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {fees.map((f) => (
            <tr key={f.id}>
              <td>{f.studentName}</td>
              <td>₹{f.amount}</td>
              <td>{f.status}</td>
              <td>
                <button
                  className="btn-outline"
                  onClick={() => edit(f)}
                >
                  Edit
                </button>{" "}
                <button
                  className="btn-danger"
                  onClick={() => remove(f.id)}
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
