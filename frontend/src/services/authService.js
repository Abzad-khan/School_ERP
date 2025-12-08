// Completely fake login for frontend demo
export async function fakeLogin(username, password, role) {
  if (!username || !password) {
    throw new Error("Username and password are required");
  }

  return {
    id: 1,
    username,
    role, // "ADMIN" | "STUDENT" | "EMPLOYEE"
    name:
      role === "ADMIN"
        ? "Administrator"
        : role === "STUDENT"
        ? "Student User"
        : "Employee User",
  };
}
