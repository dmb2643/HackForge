import { Link } from "react-router";

/** Подсказка: вступление по модели README — приглашение от участника команды, не self-invite. */
export function TeamCardActions() {
  return (
    <p className="max-w-[13rem] text-right text-[11px] leading-snug text-muted-foreground">
      To join, you need an invitation from someone already in that team. If you recruit, invite
      people here:{" "}
      <Link to="/dashboard" className="text-primary underline underline-offset-2">
        Find Team Board
      </Link>
    </p>
  );
}
