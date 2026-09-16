import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff, Loader2Icon, Lock, Mail, User } from "lucide-react";
import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { Button } from "~/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/shared/components/ui/card";
import { Input } from "~/shared/components/ui/input";
import { Label } from "~/shared/components/ui/label";
import { getApiErrorMessage } from "~/shared/lib/get-api-error-message";
import { cn, formatFieldErrors } from "~/shared/lib/utils";
import { useLoginMutation, useRegisterMutation } from "../model";
import { login as loginApi } from "../model/api/login";

type AuthTab = "login" | "signup";

/** Показывать текст ошибки после blur/ввода или после неудачной отправки (иначе «Повторите пароль» без фокуса молчит). */
function showFieldValidationMessage(meta: {
  isTouched: boolean;
  isValid: boolean;
  errors: unknown[];
}): boolean {
  return !meta.isValid && (meta.isTouched || meta.errors.length > 0);
}

const loginAuthSchema = z.object({
  email: z.email("Введите корректный email адрес"),
  name: z.string(),
  password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
  confirmPassword: z.string(),
});

const signupAuthSchema = z
  .object({
    email: z.email("Введите корректный email адрес"),
    name: z.string().trim().min(1, "Введите имя"),
    password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

type AuthFormValues = z.infer<typeof loginAuthSchema>;

function isAuthFormReady(tab: AuthTab, values: AuthFormValues): boolean {
  const schema = tab === "login" ? loginAuthSchema : signupAuthSchema;
  return schema.safeParse(values).success;
}

const EMAIL_CONFLICT_MESSAGE = "Этот email уже занят";

/** 409 Conflict (занятый email) — без привязки к `instanceof` из ky. */
function isConflictHttpError(error: unknown): boolean {
  let current: unknown = error;
  const seen = new Set<unknown>();
  while (current != null && !seen.has(current)) {
    seen.add(current);
    if (typeof current === "object" && current !== null && "response" in current) {
      const res = (current as { response: unknown }).response;
      if (res instanceof Response && res.status === 409) return true;
    }
    current = current instanceof Error ? current.cause : undefined;
  }
  return false;
}

export function AuthForm() {
  const [tab, setTab] = useState<AuthTab>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();

  const form = useForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: tab === "login" ? loginAuthSchema : signupAuthSchema,
      onBlur: tab === "login" ? loginAuthSchema : signupAuthSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null);
      try {
        const loginData =
          tab === "login"
            ? await loginMutation.mutateAsync({
                email: value.email,
                password: value.password,
              })
            : await (async () => {
                await registerMutation.mutateAsync({
                  email: value.email,
                  password: value.password,
                  name: value.name.trim(),
                });
                return loginApi({
                  email: value.email,
                  password: value.password,
                });
              })();
        localStorage.setItem("token", loginData.token);
        localStorage.setItem("x-user-id", loginData.id);
        void navigate("/dashboard");
      } catch (error) {
        if (isConflictHttpError(error)) {
          setFormError(EMAIL_CONFLICT_MESSAGE);
        } else {
          setFormError(await getApiErrorMessage(error));
        }
      }
    },
  });

  const handleTabChange = (newTab: AuthTab) => {
    setTab(newTab);
    form.reset();
    setShowPassword(false);
    setFormError(null);
    loginMutation.reset();
    registerMutation.reset();
  };

  const confirmPassword = useCallback(
    ({ value }: { value: string }) => {
      return value !== form.getFieldValue("password") ? "Пароли не совпадают" : undefined;
    },
    [form],
  );

  return (
    <Card className="w-full max-w-md border-0 bg-card py-6 shadow-xl ring-1 ring-black/5 dark:ring-white/10">
      <CardHeader className="items-center space-y-1 px-6 text-center">
        <CardTitle className="text-xl font-semibold tracking-tight">
          {tab === "login" ? "С возвращением" : "Создать аккаунт"}
        </CardTitle>
        <CardDescription>
          {tab === "login"
            ? "Введите данные для входа в аккаунт"
            : "Заполните форму для регистрации"}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6 px-6">
        <div
          className="flex rounded-lg bg-muted/80 p-1 ring-1 ring-border/60"
          role="tablist"
          aria-label="Режим входа"
        >
          {(["login", "signup"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              className={cn(
                "flex-1 rounded-md py-2 text-sm font-medium transition-all",
                tab === t
                  ? "bg-card text-foreground shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => handleTabChange(t)}
            >
              {t === "login" ? "Вход" : "Регистрация"}
            </button>
          ))}
        </div>

        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          noValidate
        >
          <form.Field
            name="email"
            children={(field) => {
              const isInvalid = showFieldValidationMessage(field.state.meta);
              return (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>Email</Label>
                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden
                    />
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      autoComplete="email"
                      placeholder="name@company.com"
                      className="h-10 pl-9"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange((e.target as HTMLInputElement).value)}
                      aria-invalid={isInvalid}
                    />
                  </div>
                  {isInvalid && (
                    <p className="text-xs text-destructive">
                      {formatFieldErrors(field.state.meta.errors)}
                    </p>
                  )}
                </div>
              );
            }}
          />

          {tab === "signup" && (
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid = showFieldValidationMessage(field.state.meta);
                return (
                  <div className="grid gap-2">
                    <Label htmlFor={field.name}>Имя</Label>
                    <div className="relative">
                      <User
                        className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden
                      />
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        autoComplete="name"
                        placeholder="Ваше имя"
                        className="h-10 pl-9"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange((e.target as HTMLInputElement).value)}
                        aria-invalid={isInvalid}
                      />
                    </div>
                    {isInvalid && (
                      <p className="text-xs text-destructive">
                        {formatFieldErrors(field.state.meta.errors)}
                      </p>
                    )}
                  </div>
                );
              }}
            />
          )}

          <form.Field
            name="password"
            children={(field) => {
              const isInvalid = showFieldValidationMessage(field.state.meta);
              return (
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={field.name}>Пароль</Label>
                    {tab === "login" && (
                      <Link
                        to="/auth/forgot-password"
                        className="ml-auto text-xs font-medium text-primary hover:underline"
                      >
                        Забыли пароль?
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <Lock
                      className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden
                    />
                    <Input
                      id={field.name}
                      name={field.name}
                      type={showPassword ? "text" : "password"}
                      autoComplete={tab === "login" ? "current-password" : "new-password"}
                      placeholder="••••••••"
                      className="h-10 pl-9 pr-10"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange((e.target as HTMLInputElement).value)}
                      aria-invalid={isInvalid}
                    />
                    <button
                      type="button"
                      className="absolute right-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {isInvalid && (
                    <p className="text-xs text-destructive">
                      {formatFieldErrors(field.state.meta.errors)}
                    </p>
                  )}
                </div>
              );
            }}
          />

          {tab === "signup" && (
            <form.Field
              name="confirmPassword"
              validators={{
                onBlur: confirmPassword,
                onSubmit: confirmPassword,
              }}
              children={(field) => {
                const isInvalid = showFieldValidationMessage(field.state.meta);
                return (
                  <div className="grid gap-2">
                    <Label htmlFor={field.name}>Повторите пароль</Label>
                    <div className="relative">
                      <Lock
                        className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden
                      />
                      <Input
                        id={field.name}
                        name={field.name}
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        className="h-10 pl-9"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange((e.target as HTMLInputElement).value)}
                        aria-invalid={isInvalid}
                      />
                    </div>
                    {isInvalid && (
                      <p className="text-xs text-destructive">
                        {formatFieldErrors(field.state.meta.errors)}
                      </p>
                    )}
                  </div>
                );
              }}
            />
          )}

          <div className="flex items-center gap-2">
            <input
              id="remember"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember((e.target as HTMLInputElement).checked)}
              className="size-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
            <Label htmlFor="remember" className="cursor-pointer font-normal text-muted-foreground">
              Запомнить на 30 дней
            </Label>
          </div>

          {formError ? (
            <p className="text-center text-sm text-destructive" role="alert">
              {formError}
            </p>
          ) : null}

          <form.Subscribe selector={(state) => state.values}>
            {(values) => (
              <Button
                type="submit"
                size="lg"
                className="h-10 w-full font-medium"
                disabled={
                  form.state.isSubmitting ||
                  loginMutation.isPending ||
                  registerMutation.isPending ||
                  !isAuthFormReady(tab, values)
                }
              >
                {form.state.isSubmitting ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : tab === "login" ? (
                  "Войти"
                ) : (
                  "Создать аккаунт"
                )}
              </Button>
            )}
          </form.Subscribe>
        </form>

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          Входя в систему, вы соглашаетесь с{" "}
          <a
            href="/terms"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Условиями использования
          </a>{" "}
          и{" "}
          <a
            href="/privacy"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Политикой конфиденциальности
          </a>
          .
        </p>
      </CardContent>
    </Card>
  );
}
