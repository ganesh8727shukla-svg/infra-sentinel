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

  citizen: {
    id: "USR-0001",
    name: "Citizen User",
    role: "citizen",
    organisation: "Maharashtra",
  },

  contractor: {
    id: "CON-01",
    name: "Apex Infrastructure",
    role: "contractor",
    organisation: "Empanelled Contractor",
  },
};

export type RegisterPayload = {
  name: string;
  password: string;
  role: "citizen" | "contractor";
  organisation?: string;
  district?: string;
  licenseNumber?: string;
};

export async function login(payload: {
  userId: string;
  password: string;
  role: UserRole;
}): Promise<AppUser> {
  if (isMock()) {
    const user = MOCK_USERS[payload.role];

    setToken("mock-jwt-token");

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        USER_KEY,
        JSON.stringify(user),
      );
    }

    return mockResponse(user, 600);
  }

  const res = await request<{
    access_token: string;
    user: AppUser;
  }>("/auth/login", {
    method: "POST",
    json: payload,
  });

  setToken(res.access_token);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      USER_KEY,
      JSON.stringify(res.user),
    );
  }

  return res.user;
}


/*
 * REGISTER
 *
 * Important:
 * This function returns AppUser directly.
 *
 * Therefore register.tsx must use:
 *
 *   const registeredUser = await register(...);
 *   registeredUser.id
 *
 * NOT:
 *
 *   response.user.id
 */
export async function register(
  payload: RegisterPayload,
): Promise<AppUser> {
  if (isMock()) {
    const mockUser: AppUser = {
      id:
        payload.role === "citizen"
          ? `USR-${Math.random()
              .toString(16)
              .slice(2, 10)
              .toUpperCase()}`
          : `CON-${Math.random()
              .toString(16)
              .slice(2, 10)
              .toUpperCase()}`,

      name: payload.name,
      role: payload.role,
      organisation:
        payload.organisation ||
        (payload.role === "citizen"
          ? "Citizen"
          : "Empanelled Contractor"),
    };

    return mockResponse(mockUser, 600);
  }

  const res = await request<{
    access_token: string;
    user: AppUser;
  }>("/auth/register", {
    method: "POST",
    json: payload,
  });

  /*
   * Registration should NOT automatically keep
   * the user logged in.
   *
   * We only return the generated user so that
   * register.tsx can send the user to login.
   */

  return res.user;
}


export async function me(): Promise<AppUser | null> {
  if (isMock()) {
    if (typeof window === "undefined") {
      return null;
    }

    const raw = window.localStorage.getItem(USER_KEY);

    return raw
      ? (JSON.parse(raw) as AppUser)
      : null;
  }

  try {
    return await request<AppUser>("/auth/me");
  } catch {
    setToken(null);

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(USER_KEY);
    }

    return null;
  }
}


export async function logout(): Promise<void> {
  try {
    if (!isMock()) {
      try {
        await request<void>("/auth/logout", {
          method: "POST",
        });
      } catch {
        // Logout should still clear local session.
      }
    }
  } finally {
    setToken(null);

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(USER_KEY);
    }
  }
}
