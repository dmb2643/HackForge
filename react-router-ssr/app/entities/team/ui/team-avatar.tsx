import { Avatar, AvatarFallback } from "~/shared/components/ui/avatar";
import { cn } from "~/shared/lib/utils";

type TeamAvatarProps = {
  name: string;
  className?: string;
};

export function TeamAvatar({ name, className }: TeamAvatarProps) {
  const letter = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <Avatar
      className={cn(
        "size-12 rounded-xl bg-primary/15 text-lg font-semibold text-primary",
        className,
      )}
    >
      <AvatarFallback className="rounded-xl bg-primary/15 text-lg font-semibold text-primary">
        {letter}
      </AvatarFallback>
    </Avatar>
  );
}
