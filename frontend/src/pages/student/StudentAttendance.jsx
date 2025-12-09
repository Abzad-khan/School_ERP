import DataTable from "../../components/common/DataTable";

export default function StudentAttendance() {
  const records = [
    { id: 1, date: "2025-07-01", status: "Present" },
    { id: 2, date: "2025-07-02", status: "Absent" },
    { id: 3, date: "2025-07-03", status: "Present" },
  ];

  const columns = [
    { Header: "Date", accessor: "date" },
    { Header: "Status", accessor: "status" },
  ];

  return (
    <div>
      <h2>Attendance Records</h2>
      <DataTable columns={columns} data={records} />
    </div>
  );
}
