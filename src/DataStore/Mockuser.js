// mockUsers.js
import bcrypt from "bcryptjs";

export const mockUsers = [
  {
    id: 1,
    username: "Ankit",
    password: bcrypt.hashSync("Ankit123", 10), // hashed
    role: "admin",
  },
  {
    id: 2,
    username: "Divya",
    password: bcrypt.hashSync("Divya123", 10),
    role: "hr",
  },
  {
    id: 3,
    username: "Naveen",
    password: bcrypt.hashSync("Naveen123", 10),
    role: "tl",
  },
  {
    id: 4,
    username: "Abdul",
    password: bcrypt.hashSync("Abdul123", 10),
    role: "employee",
  },
];
