// src/user/user.interface.ts
export interface UserDetails {
  id: number;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  posts?: any[];
  createdAt?: Date;
  updatedAt?: Date;
}
