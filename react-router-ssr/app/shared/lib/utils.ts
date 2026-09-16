import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Сообщения TanStack Form + Zod могут быть строками или объектами — для UI нужна строка. */
export function formatFieldErrors(errors: unknown[] | undefined): string {
  if (!errors?.length) return "";
  const parts = errors.map(errorToDisplayString).filter(Boolean);
  if (parts.length) return parts.join(", ");
  return "Ошибка валидации";
}

function errorToDisplayString(e: unknown): string {
  if (e == null || e === "") return "";
  if (typeof e === "string") return e;
  if (typeof e === "number" || typeof e === "boolean") return String(e);
  if (typeof e === "object" && e !== null) {
    const o = e as Record<string, unknown>;
    if (typeof o.message === "string") return o.message;
    if (typeof o.issue === "object" && o.issue !== null) {
      const nested = errorToDisplayString(o.issue);
      if (nested) return nested;
    }
    if (Array.isArray(o.issues)) {
      return o.issues.map(errorToDisplayString).filter(Boolean).join(", ");
    }
  }
  return "";
}
