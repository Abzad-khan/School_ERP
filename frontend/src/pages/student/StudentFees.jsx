import DataTable from "../../components/common/DataTable";

export default function StudentFees() {
  const fees = [
    { id: 1, term: "Term 1", total: 10000, paid: 10000, status: "Paid" },
    { id: 2, term: "Term 2", total: 10000, paid: 5000, status: "Pending" },
  ];

  const columns = [
    { Header: "Term", accessor: "term" },
    { Header: "Total (₹)", accessor: "total" },
    { Header: "Paid (₹)", accessor: "paid" },
    { Header: "Status", accessor: "status" },
  ];

  return (
    <div>
      <h2>Fee Status</h2>
      <DataTable columns={columns} data={fees} />
    </div>
  );
}
