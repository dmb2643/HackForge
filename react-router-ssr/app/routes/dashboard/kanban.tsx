import { KanbanPage } from "~/features/kanban";

export function meta() {
  return [{ title: "Канбан — HackForge" }];
}

export default function Kanban() {
  return <KanbanPage />;
}
