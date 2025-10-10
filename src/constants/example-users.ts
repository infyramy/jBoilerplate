import type { User, LoginCredentials } from "@/types/auth";

// Example users for development and testing
export const exampleUsers: User[] = [
  {
    id: "1",
    fullname: "Admin User",
    email: "admin@example.com",
    user_type: "admin",
    avatar: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    fullname: "Regular User",
    email: "user@example.com",
    user_type: "user",
    avatar: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    fullname: "HQ Admin",
    email: "hq@ovalparking.com",
    user_type: "hq_admin",
    avatar: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock credentials for testing
export const getMockCredentials = (): Record<string, LoginCredentials> => {
  return {
    admin: {
      email: "admin@example.com",
      password: "admin123",
    },
    user: {
      email: "user@example.com",
      password: "user123",
    },
    hq_admin: {
      email: "hq@ovalparking.com",
      password: "hq123",
    },
  };
}; 