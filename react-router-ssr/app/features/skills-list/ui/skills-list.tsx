import { XIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "~/shared/components/ui/button";
import { Input } from "~/shared/components/ui/input";
import { Label } from "~/shared/components/ui/label";
import { cn } from "~/shared/lib/utils";

export type SkillsListProps = {
  skills: string[];
  onChange: (skills: string[]) => void;
  disabled?: boolean;
  idPrefix?: string;
};

export function SkillsList({ skills, onChange, disabled, idPrefix = "skills" }: SkillsListProps) {
  const [draft, setDraft] = useState("");

  const addSkill = useCallback(() => {
    const next = draft.trim();
    if (!next || skills.some((s) => s.toLowerCase() === next.toLowerCase())) {
      return;
    }
    onChange([...skills, next]);
    setDraft("");
  }, [draft, onChange, skills]);

  const removeSkill = useCallback(
    (skill: string) => {
      onChange(skills.filter((s) => s !== skill));
    },
    [onChange, skills],
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="grid w-full gap-2 sm:max-w-md">
          <Label htmlFor={`${idPrefix}-input`}>Новый навык</Label>
          <Input
            id={`${idPrefix}-input`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
            placeholder="Например, React"
            disabled={disabled}
            autoComplete="off"
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          className="shrink-0"
          disabled={disabled || !draft.trim()}
          onClick={addSkill}
        >
          Добавить
        </Button>
      </div>
      {skills.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <li
              key={skill}
              className={cn(
                "inline-flex max-w-full items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-1 text-sm",
              )}
            >
              <span className="truncate">{skill}</span>
              <button
                type="button"
                className="shrink-0 rounded-sm text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none"
                disabled={disabled}
                onClick={() => removeSkill(skill)}
                aria-label={`Удалить навык ${skill}`}
              >
                <XIcon className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Пока нет навыков — добавьте хотя бы один.</p>
      )}
    </div>
  );
}
