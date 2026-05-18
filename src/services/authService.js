import api from './api';
import { mockUsers } from './mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

// Kita simpan mock data dalam variabel memori sementara agar user yang baru register
// bisa langsung login di sesi yang sama tanpa me-refresh browser.
let usersDb = [...mockUsers];

export const authService = {
  login: async (email, password) => {
    if (USE_MOCK) {
      // 1. Mode Mock Data: Mensimulasikan delay internet 800ms
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const user = usersDb.find(u => u.email === email && u.password_hash === password);
          if (user) {
            // Simulasi sukses login
            const token = "mock-jwt-token-777";
            resolve({ 
              user: { id: user.id, username: user.username, email: user.email }, 
              token 
            });
          } else {
            // Simulasi gagal login
            reject(new Error("Invalid email or password"));
          }
        }, 800);
      });
    } else {
      // 2. Mode Real API: Menghubungi backend Express.js
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    }
  },

  register: async (username, email, password) => {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const userExists = usersDb.find(u => u.email === email || u.username === username);
          if (userExists) {
            reject(new Error("User with this email or username already exists"));
          } else {
            const newUser = {
              id: `uuid-user-${Date.now()}`,
              username,
              email,
              password_hash: password,
              created_at: new Date().toISOString()
            };
            usersDb.push(newUser); // Simpan ke database mock sementara
            const token = "mock-jwt-token-777";
            resolve({ 
              user: { id: newUser.id, username: newUser.username, email: newUser.email }, 
              token 
            });
          }
        }, 800);
      });
    } else {
      const response = await api.post('/auth/register', { username, email, password });
      return response.data;
    }
  }
};
