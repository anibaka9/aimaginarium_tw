import { CreateRoom } from "@/components/create-room";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/create")({
  component: () => <CreateRoom />,
});
