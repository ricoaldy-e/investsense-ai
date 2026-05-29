import api, { plainAxios } from "./api";

export const authService = {
  register: async (email, username, password) => {
    const response = await api.post("/auth/register", {
      email,
      username,
      password,
    });
    return response.data;
  },

  login: async (email, password, rememberMe) => {
    const response = await api.post("/auth/login", { email, password, rememberMe });
    return response.data;
  },

  refresh: async () => {
    const response = await plainAxios.post("/auth/refresh", {});
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },
};
