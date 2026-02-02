import { useEffect, useState } from "react";
import {
  getMessages,
  createMessage,
  updateMessage,
  deleteMessage,
} from "../../api/chatApi";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState({
    id: null,
    sender: "",
    message: "",
  });

  const load = async () => {
    const res = await getMessages();
    setMessages(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!form.sender || !form.message) return;

    if (form.id) {
      await updateMessage(form.id, form);
    } else {
      await createMessage(form);
    }

    setForm({ id: null, sender: "", message: "" });
    load();
  };

  const edit = (m) => setForm(m);

  const remove = async (id) => {
    await deleteMessage(id);
    load();
  };

  return (
    <div className="card">
      <h2>Chat Messages</h2>

      <div className="grid">
        <input
          placeholder="Sender"
          value={form.sender}
          onChange={(e) =>
            setForm({ ...form, sender: e.target.value })
          }
        />
        <input
          placeholder="Message"
          value={form.message}
          onChange={(e) =>
            setForm({ ...form, message: e.target.value })
          }
        />

        <button className="btn-primary" onClick={save}>
          {form.id ? "Update" : "Send"}
        </button>
      </div>

      <hr style={{ margin: "20px 0" }} />

      <table className="table">
        <thead>
          <tr>
            <th>Sender</th>
            <th>Message</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {messages.map((m) => (
            <tr key={m.id}>
              <td>{m.sender}</td>
              <td>{m.message}</td>
              <td>
                <button
                  className="btn-outline"
                  onClick={() => edit(m)}
                >
                  Edit
                </button>{" "}
                <button
                  className="btn-danger"
                  onClick={() => remove(m.id)}
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
