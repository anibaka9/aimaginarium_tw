import Room from "@/components/room";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/room/$roomId")({
  component: () => <Room />,
});
