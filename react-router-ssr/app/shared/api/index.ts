import ky from "ky";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("x-user-id");
  } catch {
    return null;
  }
}

// В dev — same-origin "/api" (проксируется vite на localhost:8080, см. vite.config.ts).
// В prod — явный URL backend через build-arg VITE_API_URL (инлайнится Vite в клиентский бандл).
const API_PREFIX = import.meta.env.VITE_API_URL ?? "/api";

export const api = ky.create({
  prefix: API_PREFIX,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = getToken();
        const userId = getUserId();
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
        if (userId) {
          request.headers.set("X-User-ID", userId);
        }
      },
    ],
  },
  credentials: "include",
});
