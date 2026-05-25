// src/mocks/authMock.js

export const mockUsers = [
  {
    id: "uuid-user-1",
    username: "alex_j",
    email: "alex@investsense.ai",
    password_hash: "password123", // Ingat: di real backend ini di-hash dengan bcrypt!
    created_at: new Date().toISOString()
  }
];
