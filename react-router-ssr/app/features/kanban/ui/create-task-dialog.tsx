import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useCreateTaskMutation } from "~/entities/task";
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

type Props = {
  teamId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateTaskDialog({ teamId, open, onOpenChange }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState<string | null>(null);
  const createMutation = useCreateTaskMutation();

  useEffect(() => {
    if (open) {
      setTitle("");
      setDescription("");
      setDeadline("");
      setError(null);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) {
      setError("Введите название задачи.");
      return;
    }
    setError(null);
    try {
      await createMutation.mutateAsync({
        teamId,
        body: {
          title: t,
          description: description.trim() || undefined,
          deadline: deadline.trim() || undefined,
        },
      });
      onOpenChange(false);
    } catch (err) {
      setError(await getApiErrorMessage(err));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Новая задача</DialogTitle>
          <DialogDescription>
            Задача появится в колонке «На согласовании». Капитан сможет перенести её в «К
            выполнению».
          </DialogDescription>
          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
        </DialogHeader>
        <form onSubmit={(ev) => void handleSubmit(ev)} className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Название</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
              maxLength={200}
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-desc">Описание (необязательно)</Label>
            <Input
              id="task-desc"
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-deadline">Дедлайн (необязательно)</Label>
            <Input
              id="task-deadline"
              type="date"
              value={deadline}
              onChange={(ev) => setDeadline(ev.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <Loader2Icon className="size-4 animate-spin" aria-hidden />
              ) : null}
              Создать
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
