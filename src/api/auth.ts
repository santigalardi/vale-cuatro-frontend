// src/api/auth.ts

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

interface LoginResponse {
  token: string;
  userId: string;
  username: string;
  avatar?: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const res = await axios.post<LoginResponse>(`${API_URL}/login`, { email, password });
  return res.data;
};
