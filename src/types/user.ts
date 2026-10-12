// src/types/user.ts
export type UserRole = 'GUEST' | 'OWNER' | 'ADMIN';
export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface User {
  id: string;
  phoneNumber: string;
  email?: string;
  fullName: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  phoneNumber: string;
  password: string;
}

export interface RegisterData {
  phoneNumber: string;
  fullName: string;
  email?: string;
  password: string;
  role?: UserRole;
}