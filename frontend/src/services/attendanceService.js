let attendanceRecords = [
  {
    id: 1,
    date: "2025-07-01",
    className: "10-A",
    totalStudents: 40,
    present: 38,
    absent: 2,
  },
];

export async function getAllAttendanceRecords() {
  return attendanceRecords;
}

export async function createAttendanceRecord(record) {
  const id = Date.now();
  const newRec = { ...record, id };
  attendanceRecords.push(newRec);
  return newRec;
}

export async function updateAttendanceRecord(id, updates) {
  attendanceRecords = attendanceRecords.map((r) =>
    r.id === id ? { ...r, ...updates } : r
  );
  return attendanceRecords.find((r) => r.id === id);
}

export async function deleteAttendanceRecord(id) {
  attendanceRecords = attendanceRecords.filter((r) => r.id !== id);
}
