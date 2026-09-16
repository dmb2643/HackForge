import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useGetProfile } from "~/entities/user";
import { CreateTeamDialog } from "~/features/create-team/ui/create-team-dialog";
import { Button } from "~/shared/components/ui/button";

export function CreateTeamButton() {
  const [open, setOpen] = useState(false);
  const { data } = useGetProfile();
  const { lookingForTeam } = data ?? {};

  const handleClick = () => {
    if (data && lookingForTeam === false) {
      toast.error("У вас уже есть команда");
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <Button type="button" size="default" onClick={handleClick}>
        <Plus data-icon="inline-start" />
        Create Team
      </Button>
      <CreateTeamDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
