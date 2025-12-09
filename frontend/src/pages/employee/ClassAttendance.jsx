import { useState } from "react";
import DataTable from "../../components/common/DataTable";

const initialStudents = [
  { id: 1, name: "John Doe", rollNo: "10A-01", status: "Present" },
  { id: 2, name: "Jane Smith", rollNo: "10A-02", status: "Present" },
  { id: 3, name: "Ravi Kumar", rollNo: "10A-03", status: "Absent" },
];

export default function ClassAttendance() {
  const [students, setStudents] = useState(initialStudents);
  const [date, setDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );

  const toggleStatus = (id) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "Present" ? "Absent" : "Present" }
          : s
      )
    );
  };

  const handleSave = () => {
    alert("Attendance saved for " + date);
  };

  const columns = [
    { Header: "Roll No", accessor: "rollNo" },
    { Header: "Name", accessor: "name" },
    { Header: "Status", accessor: "status" },
    {
      Header: "Toggle",
      accessor: "toggle",
      Cell: (row) => (
        <button onClick={() => toggleStatus(row.id)}>Toggle</button>
      ),
    },
  ];

  return (
    <div>
      <h2>Class Attendance</h2>
      <label>
        Date:{" "}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>

      <DataTable columns={columns} data={students} />

      <button onClick={handleSave} style={{ marginTop: "0.75rem" }}>
        Save Attendance
      </button>
    </div>
  );
}
