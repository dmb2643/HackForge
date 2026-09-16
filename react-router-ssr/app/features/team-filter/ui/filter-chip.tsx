import { X } from "lucide-react";
import { Button } from "~/shared/components/ui/button";
import { cn } from "~/shared/lib/utils";

type FilterChipProps = {
  label: string;
  onRemove: () => void;
  className?: string;
};

export function FilterChip({ label, onRemove, className }: FilterChipProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 max-w-full items-center gap-1 rounded-full border border-border bg-muted/80 px-2.5 text-xs font-medium text-foreground",
        className,
      )}
    >
      <span className="truncate">{label}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        className="size-5 shrink-0 text-muted-foreground hover:text-foreground"
        aria-label={`Remove ${label}`}
        onClick={onRemove}
      >
        <X />
      </Button>
    </span>
  );
}
