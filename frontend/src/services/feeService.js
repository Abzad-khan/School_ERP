let fees = [
  {
    id: 1,
    studentName: "John Doe",
    className: "10-A",
    term: "Term 1",
    total: 10000,
    paid: 10000,
    status: "Paid",
  },
  {
    id: 2,
    studentName: "John Doe",
    className: "10-A",
    term: "Term 2",
    total: 10000,
    paid: 5000,
    status: "Pending",
  },
];

export async function getAllFees() {
  return fees;
}

export async function createFeeRecord(record) {
  const id = Date.now();
  const newRec = { ...record, id };
  fees.push(newRec);
  return newRec;
}

export async function updateFeeRecord(id, updates) {
  fees = fees.map((f) => (f.id === id ? { ...f, ...updates } : f));
  return fees.find((f) => f.id === id);
}

export async function deleteFeeRecord(id) {
  fees = fees.filter((f) => f.id !== id);
}
