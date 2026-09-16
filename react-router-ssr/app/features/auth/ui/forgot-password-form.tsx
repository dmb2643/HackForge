import { useForm } from "@tanstack/react-form";
import { Loader2Icon, Mail } from "lucide-react";
import { Link } from "react-router";
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

const forgotSchema = z.object({
  email: z.email("Введите корректный email адрес"),
});

export function ForgotPasswordForm() {
  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: forgotSchema,
      onBlur: forgotSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Forgot password:", value);
    },
  });

  return (
    <Card className="w-full max-w-md border-0 bg-card py-6 shadow-xl ring-1 ring-black/5 dark:ring-white/10">
      <CardHeader className="items-center space-y-1 px-6 text-center">
        <CardTitle className="text-xl font-semibold tracking-tight">
          Восстановление пароля
        </CardTitle>
        <CardDescription>Укажите email — отправим ссылку для сброса пароля</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6 px-6">
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

          <Button
            type="submit"
            size="lg"
            className="h-10 w-full font-medium"
            disabled={form.state.isSubmitting}
          >
            {form.state.isSubmitting ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              "Отправить ссылку"
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
