import { useEffect, useState } from "react";
import DataTable from "../../components/common/DataTable";
import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../../services/studentService";

const emptyForm = {
  name: "",
  className: "",
  rollNo: "",
  contact: "",
  feesTotal: "",
  feesPaid: "",
};

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    const data = await getAllStudents();
    setStudents(data);
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
      await updateStudent(editingId, form);
    } else {
      await createStudent(form);
    }
    setForm(emptyForm);
    setEditingId(null);
    load();
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setForm({
      name: student.name,
      className: student.className,
      rollNo: student.rollNo,
      contact: student.contact,
      feesTotal: student.feesTotal,
      feesPaid: student.feesPaid,
    });
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this student?")) {
      await deleteStudent(id);
      load();
    }
  };

  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Class", accessor: "className" },
    { Header: "Roll No", accessor: "rollNo" },
    { Header: "Contact", accessor: "contact" },
    { Header: "Fees Paid", accessor: "feesPaid" },
    { Header: "Fees Total", accessor: "feesTotal" },
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
      <h2>Manage Students</h2>
      <div className="two-column">
        <div>
          <h3>{editingId ? "Edit Student" : "Add Student"}</h3>
          <form onSubmit={handleSubmit} className="form-grid">
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
            />
            <input
              name="className"
              placeholder="Class (e.g. 10-A)"
              value={form.className}
              onChange={handleChange}
            />
            <input
              name="rollNo"
              placeholder="Roll No"
              value={form.rollNo}
              onChange={handleChange}
            />
            <input
              name="contact"
              placeholder="Contact"
              value={form.contact}
              onChange={handleChange}
            />
            <input
              name="feesTotal"
              type="number"
              placeholder="Total Fees"
              value={form.feesTotal}
              onChange={handleChange}
            />
            <input
              name="feesPaid"
              type="number"
              placeholder="Fees Paid"
              value={form.feesPaid}
              onChange={handleChange}
            />
            <button type="submit">
              {editingId ? "Update Student" : "Add Student"}
            </button>
          </form>
        </div>

        <div>
          <h3>Student List</h3>
          <DataTable columns={columns} data={students} />
        </div>
      </div>
    </div>
  );
}
