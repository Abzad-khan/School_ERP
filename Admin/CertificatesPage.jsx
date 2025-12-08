import { useEffect, useState } from "react";
import DataTable from "../../components/common/DataTable";
import {
  getAllCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from "../../services/certificateService";

const emptyForm = {
  studentName: "",
  className: "",
  type: "Transfer Certificate",
  issueDate: "",
  remarks: "",
};

export default function CertificatesPage() {
  const [certs, setCerts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    const data = await getAllCertificates();
    setCerts(data);
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
      await updateCertificate(editingId, form);
    } else {
      await createCertificate(form);
    }
    setForm(emptyForm);
    setEditingId(null);
    load();
  };

  const handleEdit = (cert) => {
    setEditingId(cert.id);
    setForm({
      studentName: cert.studentName,
      className: cert.className,
      type: cert.type,
      issueDate: cert.issueDate,
      remarks: cert.remarks,
    });
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this certificate?")) {
      await deleteCertificate(id);
      load();
    }
  };

  const handleDownload = (cert) => {
    alert(`Download certificate for ${cert.studentName} (${cert.type})`);
  };

  const columns = [
    { Header: "Student", accessor: "studentName" },
    { Header: "Class", accessor: "className" },
    { Header: "Type", accessor: "type" },
    { Header: "Issue Date", accessor: "issueDate" },
    { Header: "Remarks", accessor: "remarks" },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: (row) => (
        <>
          <button onClick={() => handleEdit(row)}>Edit</button>{" "}
          <button onClick={() => handleDelete(row.id)}>Delete</button>{" "}
          <button onClick={() => handleDownload(row)}>Download</button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Certificates</h2>
      <div className="two-column">
        <div>
          <h3>{editingId ? "Edit Certificate" : "Create Certificate"}</h3>
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
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="Transfer Certificate">Transfer Certificate</option>
              <option value="Character Certificate">
                Character Certificate
              </option>
              <option value="Bonafide Certificate">Bonafide Certificate</option>
            </select>
            <input
              type="date"
              name="issueDate"
              value={form.issueDate}
              onChange={handleChange}
            />
            <input
              name="remarks"
              placeholder="Remarks"
              value={form.remarks}
              onChange={handleChange}
            />
            <button type="submit">
              {editingId ? "Update Certificate" : "Create Certificate"}
            </button>
          </form>
        </div>

        <div>
          <h3>Certificate List</h3>
          <DataTable columns={columns} data={certs} />
        </div>
      </div>
    </div>
  );
}
