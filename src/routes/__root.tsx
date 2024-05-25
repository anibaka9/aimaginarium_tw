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
  beforeLoad: async () => {
    const {
      user: { uid },
    } = await signInAnonymously(auth);
    console.log("beforeLoad", uid);
    return uid;
  },
});
