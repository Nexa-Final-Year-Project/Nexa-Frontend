export type User = {
  uid: string;
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  createdAt?: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
};
