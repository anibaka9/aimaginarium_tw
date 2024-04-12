import { createRootRoute, Outlet } from "@tanstack/react-router";

import { Toaster } from "@/components/ui/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export const Route = createRootRoute({
  component: () => (
    <>
      <Toaster />
      <Outlet />
      <SpeedInsights />
      <Analytics />
    </>
  ),
});
