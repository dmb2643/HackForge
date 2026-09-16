import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff, Loader2Icon, Lock } from "lucide-react";
import { useCallback, useState } from "react";
import { Link, useSearchParams } from "react-router";
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
import { formatFieldErrors } from "~/shared/lib/utils";

function showFieldValidationMessage(meta: {
  isTouched: boolean;
  isValid: boolean;
  errors: unknown[];
}): boolean {
  return !meta.isValid && (meta.isTouched || meta.errors.length > 0);
}

const recoverySchema = z.object({
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
  confirmPassword: z.string(),
});

export function RecoveryPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: recoverySchema,
      onBlur: recoverySchema,
    },
    onSubmit: async ({ value }) => {
      const { confirmPassword: _, ...data } = value;
      console.log("Recovery password:", { ...data, token });
    },
  });

  const confirmPassword = useCallback(
    ({ value }: { value: string }) => {
      return value !== form.getFieldValue("password") ? "Пароли не совпадают" : undefined;
    },
    [form],
  );

  const tokenMissing = !token;

  return (
    <Card className="w-full max-w-md border-0 bg-card py-6 shadow-xl ring-1 ring-black/5 dark:ring-white/10">
      <CardHeader className="items-center space-y-1 px-6 text-center">
        <CardTitle className="text-xl font-semibold tracking-tight">Новый пароль</CardTitle>
        <CardDescription>Придумайте надёжный пароль для вашего аккаунта</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6 px-6">
        {tokenMissing && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-center text-xs text-destructive">
            Ссылка неполная: откройте письмо со ссылкой сброса или запросите новое письмо на
            странице восстановления.
          </p>
        )}

        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          noValidate
        >
          <form.Field
            name="password"
            children={(field) => {
              const isInvalid = showFieldValidationMessage(field.state.meta);
              return (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>Новый пароль</Label>
                  <div className="relative">
                    <Lock
                      className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden
                    />
                    <Input
                      id={field.name}
                      name={field.name}
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
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

          <Button
            type="submit"
            size="lg"
            className="h-10 w-full font-medium"
            disabled={form.state.isSubmitting || tokenMissing}
          >
            {form.state.isSubmitting ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              "Сохранить пароль"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          <Link to="/" className="font-medium text-primary hover:underline">
            ← Вернуться ко входу
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
