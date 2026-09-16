import { HTTPError } from "ky";

/** Текст ошибки из ответа API (поле `message`) или запасной вариант для ky/Error. */
export async function getApiErrorMessage(error: unknown): Promise<string> {
  if (error instanceof HTTPError) {
    try {
      const body = (await error.response.json()) as { message?: string; error?: string };
      const text = body.message ?? body.error;
      if (text) {
        console.log(text);
        return text;
      }
    } catch {
      /* тело не JSON */
    }
    return error.message || "Ошибка сервера";
  }
  if (error instanceof Error) return error.message;
  return "Не удалось выполнить запрос";
}
