import { Loader2 } from "lucide-react";

export const MainLoader = () => {
  return (
    <div className="flex h-svh items-center justify-center">
      <Loader2 className="size-10 animate-spin" />
    </div>
  );
};
