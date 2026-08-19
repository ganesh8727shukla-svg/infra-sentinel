import type { AppUser, UserRole } from "@/types";
import { isMock, mockResponse, request, setToken } from "./client";

const USER_KEY = "infrasetu.user";

const MOCK_USERS: Record<UserRole, AppUser> = {
  admin: {
    id: "GOV-ADMIN",
    name: "Government Administrator",
    role: "admin",
    organisation: "Public Works Department",
  },
  citizen: { id: "USR-0001", name: "Citizen User", role: "citizen", organisation: "Maharashtra" },
  contractor: {
    id: "CON-01",
    name: "Apex Infrastructure",
    role: "contractor",
    organisation: "Empanelled Contractor",
  },
};

export async function login(payload: {
  userId: string;
  password: string;
  role: UserRole;
}): Promise<AppUser> {
  if (isMock()) {
    const user = MOCK_USERS[payload.role];
    setToken("mock-jwt-token");
    if (typeof window !== "undefined")
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    return mockResponse(user, 600);
  }
  const res = await request<{ access_token: string; user: AppUser }>("/auth/login", {
    method: "POST",
    json: payload,
  });
  setToken(res.access_token);
  return res.user;
}

export async function me(): Promise<AppUser | null> {
  if (isMock()) {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AppUser) : null;
  }
  return request<AppUser>("/auth/me");
}

export async function logout(): Promise<void> {
  setToken(null);
  if (typeof window !== "undefined") window.localStorage.removeItem(USER_KEY);
  if (!isMock()) await request<void>("/auth/logout", { method: "POST" });
}
