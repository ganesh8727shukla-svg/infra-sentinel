export const APP_NAME = "InfraSetu";
export const APP_TAGLINE = "Infrastructure Intelligence Platform";

export const API_BASE_URL =
  (import.meta.env["VITE_API_BASE_URL"] as string | undefined) ?? "/api";

/** Mock mode is on unless explicitly disabled with VITE_USE_MOCK_DATA=false */
export const USE_MOCK_DATA =
  (import.meta.env["VITE_USE_MOCK_DATA"] as string | undefined) !== "false";

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "mr", label: "मराठी" },
  { code: "hi", label: "हिंदी" },
] as const;

export const MAP_CENTER: [number, number] = [19.35, 73.4];
export const MAP_ZOOM = 9;
