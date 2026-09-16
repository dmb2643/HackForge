import { useForm } from "@tanstack/react-form";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useCreateIdeaMutation } from "~/features/ideas/model/mutations/use-create-idea-mutation";
import { Button } from "~/shared/components/ui/button";
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

const createIdeaSchema = z.object({
  title: z.string().trim().min(1, "Введите название"),
  description: z.string().trim().min(1, "Введите описание"),
});

function showFieldValidationMessage(meta: {
  isTouched: boolean;
  isValid: boolean;
  errors: unknown[];
}): boolean {
  return !meta.isValid && (meta.isTouched || meta.errors.length > 0);
}

type CreateIdeaDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateIdeaDialog({ open, onOpenChange }: CreateIdeaDialogProps) {
  const createIdeaMutation = useCreateIdeaMutation();
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (open) setFormError(null);
  }, [open]);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    validators: {
      onSubmit: createIdeaSchema,
      onBlur: createIdeaSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null);
      try {
        await createIdeaMutation.mutateAsync({
          title: value.title.trim(),
          description: value.description.trim(),
        });
        onOpenChange(false);
        form.reset();
      } catch (err) {
        setFormError(await getApiErrorMessage(err));
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Предложить идею</DialogTitle>
          <DialogDescription>
            Укажите название и краткое описание. Новые идеи сохраняются как черновики. В списке идей
            нажмите «Отправить на голосование», чтобы другие могли оценить предложение.
          </DialogDescription>
          {formError ? (
            <p className="text-sm text-destructive" role="alert">
              {formError}
            </p>
          ) : null}
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <form.Field name="title">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="idea-title">Название</Label>
                <Input
                  id="idea-title"
                  value={field.state.value}
                  onChange={(ev) => field.handleChange(ev.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Название проекта или концепции"
                  autoComplete="off"
                />
                {showFieldValidationMessage(field.state.meta) ? (
                  <p className="text-xs text-destructive">
                    {formatFieldErrors(field.state.meta.errors)}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>
          <form.Field name="description">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="idea-description">Описание</Label>
                <textarea
                  id="idea-description"
                  value={field.state.value}
                  onChange={(ev) => field.handleChange(ev.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Какую задачу решает идея?"
                  rows={4}
                  className={cn(
                    "border-input bg-background ring-offset-background placeholder:text-muted-foreground",
                    "focus-visible:ring-ring flex min-h-[100px] w-full rounded-md border px-3 py-2 text-sm",
                    "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                  )}
                />
                {showFieldValidationMessage(field.state.meta) ? (
                  <p className="text-xs text-destructive">
                    {formatFieldErrors(field.state.meta.errors)}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={createIdeaMutation.isPending}>
              {createIdeaMutation.isPending ? (
                <Loader2Icon className="size-4 animate-spin" aria-hidden />
              ) : null}
              Отправить идею
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
