import { createLazyFileRoute } from "@tanstack/react-router";
import { Forms } from "@/features/before-game/forms";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return <Forms />;
}
