import type { User, LoginCredentials } from "@/types/auth";

// Example users for development and testing
export const exampleUsers: User[] = [
  {
    id: "1",
    fullname: "Super Admin",
    email: "superadmin@example.com",
    user_type: "superadmin",
    avatar: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    fullname: "Admin User",
    email: "admin@example.com",
    user_type: "admin",
    avatar: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    fullname: "Regular User",
    email: "user@example.com",
    user_type: "user",
    avatar: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock credentials for testing
export const getMockCredentials = (): Record<string, LoginCredentials> => {
  return {
    superadmin: {
      email: "superadmin@example.com",
      password: "superadmin123",
    },
    admin: {
      email: "admin@example.com",
      password: "admin123",
    },
    user: {
      email: "user@example.com",
      password: "user123",
    },
  };
}; 