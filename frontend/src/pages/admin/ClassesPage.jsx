import { useState } from "react";
import DataTable from "../../components/common/DataTable";

const emptyForm = {
  name: "",
  section: "",
  classTeacher: "",
  strength: "",
};

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setClasses((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, ...form } : c))
      );
    } else {
      const newClass = { ...form, id: Date.now() };
      setClasses((prev) => [...prev, newClass]);
    }

    setForm(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (cls) => {
    setEditingId(cls.id);
    setForm({
      name: cls.name,
      section: cls.section,
      classTeacher: cls.classTeacher,
      strength: cls.strength,
    });
  };

  const handleDelete = (id) => {
    if (confirm("Delete this class?")) {
      setClasses((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const columns = [
    { Header: "Class", accessor: "name" },
    { Header: "Section", accessor: "section" },
    { Header: "Class Teacher", accessor: "classTeacher" },
    { Header: "Strength", accessor: "strength" },
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
      <h2>Manage Classes</h2>
      <div className="two-column">
        <div>
          <h3>{editingId ? "Edit Class" : "Add Class"}</h3>
          <form onSubmit={handleSubmit} className="form-grid">
            <input
              name="name"
              placeholder="Class (e.g. 10)"
              value={form.name}
              onChange={handleChange}
            />
            <input
              name="section"
              placeholder="Section (e.g. A)"
              value={form.section}
              onChange={handleChange}
            />
            <input
              name="classTeacher"
              placeholder="Class Teacher"
              value={form.classTeacher}
              onChange={handleChange}
            />
            <input
              name="strength"
              placeholder="Strength"
              value={form.strength}
              onChange={handleChange}
            />
            <button type="submit">
              {editingId ? "Update Class" : "Add Class"}
            </button>
          </form>
        </div>

        <div>
          <h3>Class List</h3>
          <DataTable columns={columns} data={classes} />
        </div>
      </div>
    </div>
  );
}
