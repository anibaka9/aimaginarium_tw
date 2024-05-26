import { JoinRoom } from "@/features/before-game/join-room";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/join")({
  component: () => <JoinRoom />,
});
