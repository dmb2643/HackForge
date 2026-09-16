import { RecoveryPasswordPage } from "~/pages/auth-page";

export function meta() {
  return [
    { title: "Новый пароль — HackForge" },
    { name: "description", content: "Задайте новый пароль для аккаунта" },
  ];
}

export default function RecoveryPassword() {
  return <RecoveryPasswordPage />;
}
