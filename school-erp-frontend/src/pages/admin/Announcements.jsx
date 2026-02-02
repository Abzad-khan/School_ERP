import { useEffect, useState } from "react";
import {
  getAnnouncements,
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} from "../../api/announcementApi";

export default function Announcements() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);

  const load = async () => {
    const res = await getAnnouncements();
    setItems(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (!message.trim()) {
      return alert("Message is required");
    }

    if (editId) {
      await updateAnnouncement(editId, { message });
      setEditId(null);
    } else {
      await addAnnouncement({ message });
    }

    setMessage("");
    load();
  };

  const edit = (a) => {
    setEditId(a.id);
    setMessage(a.message);
  };

  const remove = async (id) => {
    if (window.confirm("Delete this announcement?")) {
      await deleteAnnouncement(id);
      load();
    }
  };

  return (
    <div className="card">
      <h2>Manage Announcements</h2>

      <div className="form-group">
        <input
          className="input"
          placeholder="Enter announcement message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button className="btn-primary" onClick={submit}>
          {editId ? "Update Announcement" : "Add Announcement"}
        </button>
      </div>

      <hr />

      <table className="table">
        <thead>
          <tr>
            <th>Message</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((a) => (
            <tr key={a.id}>
              <td>{a.message}</td>
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
