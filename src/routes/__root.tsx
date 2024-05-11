import { createRootRoute, Outlet } from "@tanstack/react-router";

import { Toaster } from "@/components/ui/toaster";
import { auth } from "@/firebase/firebase-config";
import { signInAnonymously } from "firebase/auth";

export const Route = createRootRoute({
  component: () => (
    <>
      <Toaster />
      <Outlet />
    </>
  ),
  loader: async () => {
    await signInAnonymously(auth);
  },
});
