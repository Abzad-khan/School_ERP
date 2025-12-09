import { useEffect, useState } from "react";
import DataTable from "../../components/common/DataTable";
import {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../services/employeeService";

const emptyForm = {
  name: "",
  designation: "",
  department: "",
  contact: "",
  email: "",
  salary: "",
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    const data = await getAllEmployees();
    setEmployees(data);
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
      await updateEmployee(editingId, form);
    } else {
      await createEmployee(form);
    }
    setForm(emptyForm);
    setEditingId(null);
    load();
  };

  const handleEdit = (emp) => {
    setEditingId(emp.id);
    setForm({
      name: emp.name,
      designation: emp.designation,
      department: emp.department,
      contact: emp.contact,
      email: emp.email,
      salary: emp.salary,
    });
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this employee?")) {
      await deleteEmployee(id);
      load();
    }
  };

  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Designation", accessor: "designation" },
    { Header: "Department", accessor: "department" },
    { Header: "Contact", accessor: "contact" },
    { Header: "Email", accessor: "email" },
    { Header: "Salary", accessor: "salary" },
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
      <h2>Manage Employees</h2>
      <div className="two-column">
        <div>
          <h3>{editingId ? "Edit Employee" : "Add Employee"}</h3>
          <form onSubmit={handleSubmit} className="form-grid">
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
            />
            <input
              name="designation"
              placeholder="Designation"
              value={form.designation}
              onChange={handleChange}
            />
            <input
              name="department"
              placeholder="Department"
              value={form.department}
              onChange={handleChange}
            />
            <input
              name="contact"
              placeholder="Contact"
              value={form.contact}
              onChange={handleChange}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
            <input
              name="salary"
              placeholder="Salary"
              value={form.salary}
              onChange={handleChange}
            />
            <button type="submit">
              {editingId ? "Update Employee" : "Add Employee"}
            </button>
          </form>
        </div>

        <div>
          <h3>Employee List</h3>
          <DataTable columns={columns} data={employees} />
        </div>
      </div>
    </div>
  );
}
