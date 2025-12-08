let students = [
  {
    id: 1,
    name: "John Doe",
    className: "10-A",
    rollNo: "10A-01",
    contact: "9876543210",
    feesPaid: 15000,
    feesTotal: 20000,
  },
];

export async function getAllStudents() {
  return students;
}

export async function createStudent(student) {
  const id = Date.now();
  const newStudent = { ...student, id };
  students.push(newStudent);
  return newStudent;
}

export async function updateStudent(id, updates) {
  students = students.map((s) => (s.id === id ? { ...s, ...updates } : s));
  return students.find((s) => s.id === id);
}

export async function deleteStudent(id) {
  students = students.filter((s) => s.id !== id);
}
