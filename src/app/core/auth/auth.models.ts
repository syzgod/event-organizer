export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}
