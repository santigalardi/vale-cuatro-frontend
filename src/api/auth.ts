// src/api/auth.ts

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

interface LoginResponse {
  token: string;
  userId: string;
  username: string;
  avatar?: string;
}

interface RegisterResponse {
  token: string;
  userId: string;
  username: string;
  avatar?: string;
}

interface CompleteProfileResponse {
  message: string;
  user: {
    username: string;
    avatar?: string;
  };
}

export const register = async (email: string, password: string): Promise<RegisterResponse> => {
  const res = await axios.post<RegisterResponse>(`${API_URL}/register`, { email, password });
  return res.data;
};

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const res = await axios.post<LoginResponse>(`${API_URL}/login`, { email, password });
  return res.data;
};

export const completeProfile = async (
  token: string,
  username: string,
  avatar?: string
): Promise<CompleteProfileResponse> => {
  const res = await axios.put<CompleteProfileResponse>(
    `${API_URL}/complete-profile`,
    { username, avatar },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
