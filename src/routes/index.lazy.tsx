import { createLazyFileRoute } from "@tanstack/react-router";
import { Forms } from "@/components/forms";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return <Forms />;
}
