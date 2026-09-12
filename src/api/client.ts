import { API_BASE_URL, USE_MOCK_DATA } from "@/config";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const TOKEN_KEY = "infrasetu.token";

/**
 * Get the currently stored authentication token.
 */
export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(TOKEN_KEY);
}

/**
 * Store or remove the authentication token.
 */
export function setToken(token: string | null): void {
  if (typeof window === "undefined") {
    return;
  }

  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * Convert FastAPI/Pydantic validation errors into
 * a readable message instead of "[object Object]".
 */
function getApiErrorMessage(data: unknown): string {
  const fallback =
    "Unable to reach the InfraSetu service.";

  if (!data || typeof data !== "object") {
    return fallback;
  }

  const response = data as {
    detail?: unknown;
    message?: unknown;
  };

  // ---------------------------------------------------------
  // FastAPI validation error
  //
  // Example:
  //
  // {
  //   "detail": [
  //     {
  //       "loc": ["body", "role"],
  //       "msg": "Field required"
  //     }
  //   ]
  // }
  // ---------------------------------------------------------

  if (Array.isArray(response.detail)) {
    const messages = response.detail
      .map((item: unknown) => {
        if (!item || typeof item !== "object") {
          return null;
        }

        const error = item as {
          loc?: unknown;
          msg?: unknown;
        };

        const location = Array.isArray(error.loc)
          ? error.loc
              .filter(
                (value): value is string | number =>
                  typeof value === "string" ||
                  typeof value === "number",
              )
              .join(".")
          : "";

        const message =
          typeof error.msg === "string"
            ? error.msg
            : "Invalid value.";

        if (location) {
          return `${location}: ${message}`;
        }

        return message;
      })
      .filter(
        (message): message is string =>
          typeof message === "string" && message.length > 0,
      );

    if (messages.length > 0) {
      return messages.join(", ");
    }
  }

  // ---------------------------------------------------------
  // Normal FastAPI error
  //
  // Example:
  //
  // {
  //   "detail": "Invalid credentials"
  // }
  // ---------------------------------------------------------

  if (typeof response.detail === "string") {
    return response.detail;
  }

  // ---------------------------------------------------------
  // Generic API error
  // ---------------------------------------------------------

  if (typeof response.message === "string") {
    return response.message;
  }

  // ---------------------------------------------------------
  // If detail/message is an object, don't display
  // "[object Object]".
  // ---------------------------------------------------------

  if (
    response.detail !== undefined &&
    response.detail !== null
  ) {
    try {
      return JSON.stringify(response.detail);
    } catch {
      return fallback;
    }
  }

  return fallback;
}

/**
 * Main API request helper.
 *
 * Supports:
 *
 * request("/auth/login", {
 *   method: "POST",
 *   json: payload,
 * });
 */
export async function request<T>(
  path: string,
  init: RequestInit & { json?: unknown } = {},
): Promise<T> {
  const { json, ...rest } = init;

  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // ---------------------------------------------------------
  // Authentication
  // ---------------------------------------------------------
  //
  // Login does not have a token yet.
  // All other authenticated requests can use the stored token.
  //
  // Registration is also allowed without an existing token.
  // ---------------------------------------------------------

  if (
    token &&
    path !== "/auth/login" &&
    path !== "/auth/register"
  ) {
    headers.Authorization = `Bearer ${token}`;
  }

  // ---------------------------------------------------------
  // Preserve any custom headers supplied by the caller.
  // ---------------------------------------------------------

  if (rest.headers) {
    if (rest.headers instanceof Headers) {
      rest.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(rest.headers)) {
      for (const [key, value] of rest.headers) {
        headers[key] = value;
      }
    } else {
      Object.assign(headers, rest.headers);
    }
  }

  // ---------------------------------------------------------
  // Build request
  // ---------------------------------------------------------

  const requestInit: RequestInit = {
    ...rest,
    headers,
  };

  if (json !== undefined) {
    requestInit.body = JSON.stringify(json);
  }

  let res: Response;

  try {
    res = await fetch(
      `${API_BASE_URL}${path}`,
      requestInit,
    );
  } catch (error) {
    console.error("InfraSetu API request failed:", error);

    throw new ApiError(
      "Unable to connect to the InfraSetu backend. " +
        "Please make sure the backend server is running.",
      0,
    );
  }

  // ---------------------------------------------------------
  // HTTP ERROR
  // ---------------------------------------------------------

  if (!res.ok) {
    let message =
      "Unable to reach the InfraSetu service.";

    try {
      const data: unknown = await res.json();

      message = getApiErrorMessage(data);
    } catch {
      // If response isn't valid JSON, use status text.
      if (res.statusText) {
        message = res.statusText;
      }
    }

    console.error(
      `InfraSetu API error ${res.status}:`,
      message,
    );

    throw new ApiError(message, res.status);
  }

  // ---------------------------------------------------------
  // EMPTY RESPONSE
  // ---------------------------------------------------------

  if (res.status === 204) {
    return undefined as T;
  }

  // ---------------------------------------------------------
  // SUCCESS RESPONSE
  // ---------------------------------------------------------

  const contentType =
    res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }

  // Fallback for endpoints that return plain text.
  const text = await res.text();

  return text as T;
}

/**
 * Mock response helper.
 *
 * Used only when VITE_USE_MOCK_DATA=true.
 */
export function mockResponse<T>(
  value: T,
  delay = 320,
): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), delay);
  });
}

/**
 * Check whether mock mode is enabled.
 */
export const isMock = (): boolean => USE_MOCK_DATA;