import { useEffect, useState } from "react";
import {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from "../../api/certificateApi";

export default function Certificates() {
  const [certs, setCerts] = useState([]);
  const [form, setForm] = useState({
    id: null,
    studentName: "",
    title: "",
    issueDate: "",
  });

  const load = async () => {
    const res = await getCertificates();
    setCerts(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!form.studentName || !form.title || !form.issueDate) return;

    const payload = {
      studentName: form.studentName,
      certificateType: form.title,
      issueDate: form.issueDate,
    };

    if (form.id) {
      await updateCertificate(form.id, payload);
    } else {
      await createCertificate(payload);
    }

    setForm({ id: null, studentName: "", title: "", issueDate: "" });
    load();
  };

  const edit = (c) =>
    setForm({
      id: c.id,
      studentName: c.studentName,
      title: c.certificateType,
      issueDate: c.issueDate,
    });

  const remove = async (id) => {
    await deleteCertificate(id);
    load();
  };

  return (
    <div className="card">
      <h2>Manage Certificates</h2>

      <div className="grid">
        <input
          placeholder="Student Name"
          value={form.studentName}
          onChange={(e) =>
            setForm({ ...form, studentName: e.target.value })
          }
        />
        <input
          placeholder="Certificate Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />
        <input
          type="date"
          value={form.issueDate}
          onChange={(e) =>
            setForm({ ...form, issueDate: e.target.value })
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
            <th>Certificate</th>
            <th>Issue Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {certs.map((c) => (
            <tr key={c.id}>
              <td>{c.studentName}</td>
              <td>{c.certificateType}</td>
              <td>{c.issueDate}</td>
              <td>
                <button
                  className="btn-outline"
                  onClick={() => edit(c)}
                >
                  Edit
                </button>{" "}
                <button
                  className="btn-danger"
                  onClick={() => remove(c.id)}
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
