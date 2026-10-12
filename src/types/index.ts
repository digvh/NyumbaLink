// src/types/index.ts
export * from './user';
export * from './listing';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}