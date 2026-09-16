import { useTeamById } from "~/entities/team";
import { useGetProfile } from "~/entities/user";
import { ProfileEditForm } from "~/features/profile-edit";
import { Button } from "~/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/shared/components/ui/card";
import { Skeleton } from "~/shared/components/ui/skeleton";

export function meta() {
  return [{ title: "User Profile — HackForge" }];
}

export default function Profile() {
  const { data, isLoading, isError, error, refetch, isFetching } = useGetProfile();
  const {
    name: teamName,
    captainId: teamCaptainId,
    isNameLoading: isTeamNameLoading,
  } = useTeamById(data?.teamId);

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 md:p-6">
        <Skeleton className="h-7 w-44" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Не удалось загрузить профиль</CardTitle>
            <CardDescription>
              {error instanceof Error
                ? error.message
                : "Попробуйте обновить страницу или войти заново."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => void refetch()} disabled={isFetching}>
              Повторить
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Профиль</CardTitle>
          <CardDescription>
            Редактируйте имя, роль и навыки. Статус команды отображается автоматически. Изменения
            сохраняются на сервере.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProfileEditForm
            profile={data}
            teamName={teamName}
            teamCaptainId={teamCaptainId}
            isTeamNameLoading={isTeamNameLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
