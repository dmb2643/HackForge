import { Code2, KeyRound, Lightbulb, Rocket, Users } from "lucide-react";
import { ForgotPasswordForm } from "~/features/auth";
import { cn } from "~/shared/lib/utils";

export const ForgotPasswordPage = () => {
  return (
    <div className="flex min-h-svh flex-col bg-background md:flex-row">
      <aside
        className={cn(
          "relative hidden flex-1 flex-col justify-between overflow-hidden p-8 text-primary-foreground md:flex lg:p-12",
          "bg-linear-to-br from-violet-950 via-violet-700 to-indigo-500",
        )}
      >
        <div className="relative z-10 flex flex-col gap-8">
          <div className="flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20">
              <Code2 className="size-5" strokeWidth={2.25} />
            </span>
            <span className="text-lg font-semibold tracking-tight">HackForge</span>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
            <KeyRound className="size-3.5 opacity-90" aria-hidden />
            Безопасный сброс пароля
          </div>

          <div className="space-y-3">
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance lg:text-4xl">
              Восстановите доступ к аккаунту
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-white/85">
              Мы отправим ссылку на ваш email — перейдите по ней и задайте новый пароль. Письмо
              может прийти в течение нескольких минут.
            </p>
          </div>

          <ul className="flex flex-col gap-4 text-sm">
            <li className="flex items-start gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                <Users className="size-4" />
              </span>
              <span className="pt-1.5 text-white/95">Smart team formation &amp; matching</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                <Lightbulb className="size-4" />
              </span>
              <span className="pt-1.5 text-white/95">Idea pitching &amp; community voting</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                <Rocket className="size-4" />
              </span>
              <span className="pt-1.5 text-white/95">Project tracking &amp; mentor access</span>
            </li>
          </ul>
        </div>

        <div className="relative z-10 mt-10 rounded-xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {["bg-violet-300", "bg-fuchsia-300", "bg-cyan-300"].map((bg, i) => (
                <span
                  key={i}
                  className={cn(
                    "inline-flex size-9 items-center justify-center rounded-full ring-2 ring-violet-950/80",
                    bg,
                  )}
                  aria-hidden
                />
              ))}
            </div>
            <p className="text-sm font-medium text-white/95">10,000+ Builders joined</p>
          </div>
        </div>

        <div
          className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-white/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 size-72 rounded-full bg-indigo-400/20 blur-3xl"
          aria-hidden
        />
      </aside>

      <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-10 md:px-8 lg:px-12">
        <ForgotPasswordForm />
      </main>
    </div>
  );
};
