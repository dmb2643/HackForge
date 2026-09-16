import { ForgotPasswordPage } from "~/pages/auth-page";

export function meta() {
  return [
    { title: "Забыли пароль — HackForge" },
    { name: "description", content: "Восстановление доступа к аккаунту" },
  ];
}

export default function ForgotPassword() {
  return <ForgotPasswordPage />;
}
