let registeredUsers = [];

export async function fakeRegister(user) {
  if (!user.username || !user.password || !user.role) {
    throw new Error("All fields are required");
  }

  const exists = registeredUsers.find(
    (u) => u.username === user.username && u.role === user.role
  );

  if (exists) {
    throw new Error("User already exists");
  }

  registeredUsers.push({
    ...user,
    id: Date.now(),
  });

  return { message: "Registered successfully" };
}

export function getRegisteredUsers() {
  return registeredUsers;
}
