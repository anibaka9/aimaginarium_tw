import { CreateRoom } from "@/features/before-game/create-room";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/create")({
  component: () => <CreateRoom />,
});
