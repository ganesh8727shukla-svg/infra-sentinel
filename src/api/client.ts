import { API_BASE_URL, USE_MOCK_DATA } from "@/config";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 0) {
    super(message);
    this.status = status;
  }
}

const TOKEN_KEY = "infrasetu.token";

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;

  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

export async function request<T>(
  path: string,
  init: RequestInit & { json?: unknown } = {},
): Promise<T> {
  const { json, ...rest } = init;

  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token && path !== "/auth/login") {
    headers.Authorization = `Bearer ${token}`;
  }

  if (rest.headers) {
    Object.assign(headers, rest.headers);
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers,
    ...(json !== undefined ? { body: JSON.stringify(json) } : {}),
  });

  if (!res.ok) {
    let message = "Unable to reach the InfraSetu service.";

    try {
      const data = await res.json();
      if (data?.detail) {
        message = data.detail;
      }
    } catch {}

    throw new ApiError(message, res.status);
  }

  return (await res.json()) as T;
}

export function mockResponse<T>(value: T, delay = 320): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), delay));
}

export const isMock = () => USE_MOCK_DATA;