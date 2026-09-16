import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "~/shared/components/ui/input";
import { cn } from "~/shared/lib/utils";

type TeamSearchInputProps = {
  /** Debounced callback (ms: 300) */
  onQueryChange: (query: string) => void;
  placeholder?: string;
  /** Подпись для доступности поля поиска */
  ariaLabel?: string;
  className?: string;
};

export function TeamSearchInput({
  onQueryChange,
  placeholder = "Search teams, roles...",
  ariaLabel = "Search teams",
  className,
}: TeamSearchInputProps) {
  const [value, setValue] = useState("");
  const onQueryChangeRef = useRef(onQueryChange);
  onQueryChangeRef.current = onQueryChange;

  useEffect(() => {
    const id = window.setTimeout(() => {
      onQueryChangeRef.current(value.trim());
    }, 300);
    return () => window.clearTimeout(id);
  }, [value]);

  return (
    <div className={cn("relative min-w-[200px] max-w-md flex-1", className)}>
      <Search
        className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue((e.target as HTMLInputElement).value)}
        className="h-9 pl-9"
        aria-label={ariaLabel}
      />
    </div>
  );
}
