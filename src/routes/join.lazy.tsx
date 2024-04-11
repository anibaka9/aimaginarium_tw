import { JoinRoom } from "@/components/join-room";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/join")({
  component: () => <JoinRoom />,
});
