let employees = [
  {
    id: 1,
    name: "Alice",
    designation: "Teacher",
    department: "Maths",
    contact: "9876543210",
    email: "alice@example.com",
    salary: "35000",
  },
];

export async function getAllEmployees() {
  return employees;
}

export async function createEmployee(emp) {
  const id = Date.now();
  const newEmp = { ...emp, id };
  employees.push(newEmp);
  return newEmp;
}

export async function updateEmployee(id, updates) {
  employees = employees.map((e) => (e.id === id ? { ...e, ...updates } : e));
  return employees.find((e) => e.id === id);
}

export async function deleteEmployee(id) {
  employees = employees.filter((e) => e.id !== id);
}
