import { useForm } from "@tanstack/react-form";
import { Loader2Icon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { ROLE_LABELS } from "~/entities/team/lib/role-labels";
import type { TeamRole } from "~/entities/team/model/types";
import { useCreateTeamMutation } from "~/features/create-team/model";
import { TRACK_OPTIONS } from "~/features/team-filter/model/types";
import { Button } from "~/shared/components/ui/button";
import { Checkbox } from "~/shared/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/shared/components/ui/dialog";
import { Input } from "~/shared/components/ui/input";
import { Label } from "~/shared/components/ui/label";
import { getApiErrorMessage } from "~/shared/lib/get-api-error-message";
import { cn, formatFieldErrors } from "~/shared/lib/utils";

const ROLES: TeamRole[] = ["frontend", "backend", "fullstack", "designer", "qa", "pm"];

const roleEnum = z.enum(["frontend", "backend", "fullstack", "designer", "qa", "pm"]);

const createTeamSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  track: z.string().min(1, "Select a track"),
  openRoles: z.array(roleEnum).min(1, "Select at least one open role"),
});

function showFieldValidationMessage(meta: {
  isTouched: boolean;
  isValid: boolean;
  errors: unknown[];
}): boolean {
  return !meta.isValid && (meta.isTouched || meta.errors.length > 0);
}

type CreateTeamDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateTeamDialog({ open, onOpenChange }: CreateTeamDialogProps) {
  const defaultTrack: string = TRACK_OPTIONS[0] ?? "";
  const createTeamMutation = useCreateTeamMutation();
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (open) setFormError(null);
  }, [open]);

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      track: defaultTrack,
      openRoles: [] as TeamRole[],
    },
    validators: {
      onSubmit: createTeamSchema,
      onBlur: createTeamSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null);
      try {
        await createTeamMutation.mutateAsync({
          name: value.name.trim(),
          description: value.description.trim(),
        });
        onOpenChange(false);
        form.reset();
      } catch (err) {
        setFormError(await getApiErrorMessage(err));
      }
    },
  });

  const toggleRole = useCallback((role: TeamRole, current: TeamRole[]) => {
    return current.includes(role) ? current.filter((r) => r !== role) : [...current, role];
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>
          <DialogDescription>
            Add a name, describe the idea, and pick open roles. You can edit details later.
          </DialogDescription>
          {formError ? (
            <p className="text-sm text-destructive" role="alert">
              {formError}
            </p>
          ) : null}
        </DialogHeader>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          noValidate
        >
          <form.Field
            name="name"
            children={(field) => {
              const invalid = showFieldValidationMessage(field.state.meta);
              return (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="create-team-name">Team name</Label>
                  <Input
                    id="create-team-name"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange((e.target as HTMLInputElement).value)}
                    aria-invalid={invalid}
                  />
                  {invalid && (
                    <p className="text-xs text-destructive">
                      {formatFieldErrors(field.state.meta.errors)}
                    </p>
                  )}
                </div>
              );
            }}
          />

          <form.Field
            name="description"
            children={(field) => {
              const invalid = showFieldValidationMessage(field.state.meta);
              return (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="create-team-desc">Description</Label>
                  <textarea
                    id="create-team-desc"
                    data-slot="input"
                    rows={4}
                    className={cn(
                      "flex min-h-[80px] w-full min-w-0 resize-y rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
                    )}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange((e.target as HTMLTextAreaElement).value)}
                    aria-invalid={invalid}
                  />
                  {invalid && (
                    <p className="text-xs text-destructive">
                      {formatFieldErrors(field.state.meta.errors)}
                    </p>
                  )}
                </div>
              );
            }}
          />

          <form.Field
            name="track"
            children={(field) => {
              const invalid = showFieldValidationMessage(field.state.meta);
              return (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="create-team-track">Track</Label>
                  <select
                    id="create-team-track"
                    className={cn(
                      "flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30",
                    )}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange((e.target as HTMLSelectElement).value)}
                    aria-invalid={invalid}
                  >
                    {TRACK_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {invalid && (
                    <p className="text-xs text-destructive">
                      {formatFieldErrors(field.state.meta.errors)}
                    </p>
                  )}
                </div>
              );
            }}
          />

          <form.Field
            name="openRoles"
            children={(field) => {
              const invalid = showFieldValidationMessage(field.state.meta);
              return (
                <fieldset className="flex flex-col gap-2">
                  <legend className="text-sm font-medium">Open roles</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {ROLES.map((role) => (
                      <label
                        key={role}
                        className="flex cursor-pointer items-center gap-2 rounded-md border border-transparent px-1 py-1 text-sm hover:bg-muted/60"
                      >
                        <Checkbox
                          checked={field.state.value.includes(role)}
                          onCheckedChange={() => {
                            field.handleChange(toggleRole(role, field.state.value));
                          }}
                        />
                        {ROLE_LABELS[role]}
                      </label>
                    ))}
                  </div>
                  {invalid && (
                    <p className="text-xs text-destructive">
                      {formatFieldErrors(field.state.meta.errors)}
                    </p>
                  )}
                </fieldset>
              );
            }}
          />

          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={form.state.isSubmitting || createTeamMutation.isPending}
            >
              {form.state.isSubmitting || createTeamMutation.isPending ? (
                <Loader2Icon className="animate-spin" data-icon="inline-start" />
              ) : null}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
