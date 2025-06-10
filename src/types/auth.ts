export interface User {
  id: string;
  email: string;
  fullname: string;
  user_type: UserRole;
  avatar: string;
  created_at?: string;
  updated_at?: string;
}

export type UserRole = 'superadmin' | 'admin' | 'manager' | 'user';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  fullname: string;
  password: string;
  password_confirmation: string;
}

export interface SSOCredentials {
  provider: 'google' | 'facebook';
  token: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface CSRFToken {
  token: string;
} 