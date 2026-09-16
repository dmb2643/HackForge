import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { ROLE_LABELS } from "~/entities/team/lib/role-labels";
import type { TeamRole } from "~/entities/team/model/types";
import {
  AVAILABILITY_OPTIONS,
  EMPTY_FILTERS,
  SKILL_OPTIONS,
  TEAM_SIZE_OPTIONS,
  type TeamBoardFilters,
  TRACK_OPTIONS,
} from "~/features/team-filter/model/types";
import { FilterChip } from "~/features/team-filter/ui/filter-chip";
import { Button } from "~/shared/components/ui/button";
import { Checkbox } from "~/shared/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "~/shared/components/ui/popover";

type TeamFilterBarProps = {
  filters: TeamBoardFilters;
  onChange: (next: TeamBoardFilters) => void;
};

const ROLES: TeamRole[] = ["frontend", "backend", "fullstack", "designer", "qa", "pm"];

export function TeamFilterBar({ filters, onChange }: TeamFilterBarProps) {
  const hasActive =
    filters.skills.length > 0 ||
    filters.role != null ||
    filters.track != null ||
    filters.availability != null ||
    filters.teamSize != null;

  const chips: { key: string; label: string; clear: () => void }[] = [];

  for (const s of filters.skills) {
    chips.push({
      key: `skill-${s}`,
      label: `Skill: ${s}`,
      clear: () =>
        onChange({
          ...filters,
          skills: filters.skills.filter((x) => x !== s),
        }),
    });
  }

  if (filters.role) {
    chips.push({
      key: "role",
      label: `Role: ${ROLE_LABELS[filters.role]}`,
      clear: () => onChange({ ...filters, role: null }),
    });
  }

  if (filters.track) {
    chips.push({
      key: "track",
      label: `Track: ${filters.track}`,
      clear: () => onChange({ ...filters, track: null }),
    });
  }

  if (filters.availability) {
    chips.push({
      key: "avail",
      label: `Availability: ${filters.availability}`,
      clear: () => onChange({ ...filters, availability: null }),
    });
  }

  if (filters.teamSize) {
    chips.push({
      key: "size",
      label: `Team size: ${filters.teamSize}`,
      clear: () => onChange({ ...filters, teamSize: null }),
    });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="flex flex-wrap items-center gap-2">
        <FilterDropdown label="Skills">
          <div className="flex max-h-56 flex-col gap-2 overflow-y-auto pr-1">
            {SKILL_OPTIONS.map((skill) => (
              <label
                key={skill}
                className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-sm hover:bg-muted"
              >
                <Checkbox
                  checked={filters.skills.includes(skill)}
                  onCheckedChange={(checked) => {
                    const on = checked === true;
                    onChange({
                      ...filters,
                      skills: on
                        ? [...new Set([...filters.skills, skill])]
                        : filters.skills.filter((s) => s !== skill),
                    });
                  }}
                />
                <span>{skill}</span>
              </label>
            ))}
          </div>
        </FilterDropdown>

        <FilterDropdown label="Role">
          <div className="flex flex-col gap-1" role="group" aria-label="Role">
            {ROLES.map((role) => (
              <Button
                key={role}
                type="button"
                variant={filters.role === role ? "secondary" : "ghost"}
                size="sm"
                className="justify-start font-normal"
                onClick={() =>
                  onChange({
                    ...filters,
                    role: filters.role === role ? null : role,
                  })
                }
              >
                {ROLE_LABELS[role]}
              </Button>
            ))}
          </div>
        </FilterDropdown>

        <FilterDropdown label="Track">
          <div className="flex flex-col gap-1">
            {TRACK_OPTIONS.map((track) => (
              <Button
                key={track}
                type="button"
                variant={filters.track === track ? "secondary" : "ghost"}
                size="sm"
                className="justify-start font-normal"
                onClick={() =>
                  onChange({
                    ...filters,
                    track: filters.track === track ? null : track,
                  })
                }
              >
                {track}
              </Button>
            ))}
          </div>
        </FilterDropdown>

        <FilterDropdown label="Availability">
          <div className="flex flex-col gap-1">
            {AVAILABILITY_OPTIONS.map((opt) => (
              <Button
                key={opt}
                type="button"
                variant={filters.availability === opt ? "secondary" : "ghost"}
                size="sm"
                className="justify-start font-normal"
                onClick={() =>
                  onChange({
                    ...filters,
                    availability: filters.availability === opt ? null : opt,
                  })
                }
              >
                {opt}
              </Button>
            ))}
          </div>
        </FilterDropdown>

        <FilterDropdown label="Team size">
          <div className="flex flex-col gap-1">
            {TEAM_SIZE_OPTIONS.map((sz) => (
              <Button
                key={sz}
                type="button"
                variant={filters.teamSize === sz ? "secondary" : "ghost"}
                size="sm"
                className="justify-start font-normal"
                onClick={() =>
                  onChange({
                    ...filters,
                    teamSize: filters.teamSize === sz ? null : sz,
                  })
                }
              >
                {sz} members
              </Button>
            ))}
          </div>
        </FilterDropdown>
      </div>

      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        {chips.map((c) => (
          <FilterChip key={c.key} label={c.label} onRemove={c.clear} />
        ))}
        {hasActive && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => onChange({ ...EMPTY_FILTERS })}
          >
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
}

function FilterDropdown({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="font-normal">
          {label}
          <ChevronDown data-icon="inline-end" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <span className="sr-only">{label}</span>
        {children}
      </PopoverContent>
    </Popover>
  );
}
