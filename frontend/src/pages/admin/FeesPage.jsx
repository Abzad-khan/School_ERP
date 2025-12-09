import { useEffect, useState } from "react";
import DataTable from "../../components/common/DataTable";
import {
  getAllFees,
  createFeeRecord,
  updateFeeRecord,
  deleteFeeRecord,
} from "../../services/feeService";

const emptyForm = {
  studentName: "",
  className: "",
  term: "",
  total: "",
  paid: "",
  status: "Pending",
};

const statusOptions = ["All", "Paid", "Pending", "Overdue"];

export default function FeesPage() {
  const [fees, setFees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  const load = async () => {
    const data = await getAllFees();
    setFees(data);
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
      await updateFeeRecord(editingId, form);
    } else {
      await createFeeRecord(form);
    }
    setForm(emptyForm);
    setEditingId(null);
    load();
  };

  const handleEdit = (fee) => {
    setEditingId(fee.id);
    setForm({
      studentName: fee.studentName,
      className: fee.className,
      term: fee.term,
      total: fee.total,
      paid: fee.paid,
      status: fee.status,
    });
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this fee record?")) {
      await deleteFeeRecord(id);
      load();
    }
  };

  const filteredFees =
    filterStatus === "All"
      ? fees
      : fees.filter((f) => f.status === filterStatus);

  const columns = [
    { Header: "Student", accessor: "studentName" },
    { Header: "Class", accessor: "className" },
    { Header: "Term", accessor: "term" },
    { Header: "Total (₹)", accessor: "total" },
    { Header: "Paid (₹)", accessor: "paid" },
    { Header: "Status", accessor: "status" },
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
      <h2>Manage Fees</h2>

      <div className="two-column">
        <div>
          <h3>{editingId ? "Edit Fee Record" : "Add Fee Record"}</h3>
          <form onSubmit={handleSubmit} className="form-grid">
            <input
              name="studentName"
              placeholder="Student Name"
              value={form.studentName}
              onChange={handleChange}
            />
            <input
              name="className"
              placeholder="Class (e.g. 10-A)"
              value={form.className}
              onChange={handleChange}
            />
            <input
              name="term"
              placeholder="Term (e.g. Term 1)"
              value={form.term}
              onChange={handleChange}
            />
            <input
              name="total"
              type="number"
              placeholder="Total Fees"
              value={form.total}
              onChange={handleChange}
            />
            <input
              name="paid"
              type="number"
              placeholder="Paid Amount"
              value={form.paid}
              onChange={handleChange}
            />
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>

            <button type="submit">
              {editingId ? "Update Record" : "Add Record"}
            </button>
          </form>
        </div>

        <div>
          <h3>Fee Records</h3>

          <div style={{ marginBottom: "0.5rem" }}>
            <span>Filter by status: </span>
            {statusOptions.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus(status)}
                style={{
                  marginRight: "0.25rem",
                  opacity: filterStatus === status ? 1 : 0.7,
                }}
              >
                {status}
              </button>
            ))}
          </div>

          <DataTable columns={columns} data={filteredFees} />
        </div>
      </div>
    </div>
  );
}
