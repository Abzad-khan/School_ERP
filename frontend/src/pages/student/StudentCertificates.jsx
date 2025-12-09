import DataTable from "../../components/common/DataTable";

export default function StudentCertificates() {
  const certs = [
    {
      id: 1,
      type: "Character Certificate",
      issueDate: "2025-06-15",
      status: "Available",
    },
    {
      id: 2,
      type: "Bonafide Certificate",
      issueDate: "2025-06-20",
      status: "Available",
    },
  ];

  const columns = [
    { Header: "Type", accessor: "type" },
    { Header: "Issue Date", accessor: "issueDate" },
    { Header: "Status", accessor: "status" },
    {
      Header: "Download",
      accessor: "download",
      Cell: (row) => (
        <button onClick={() => alert("Download " + row.type)}>
          Download
        </button>
      ),
    },
  ];

  return (
    <div>
      <h2>My Certificates</h2>
      <DataTable columns={columns} data={certs} />
    </div>
  );
}
