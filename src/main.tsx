import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { initSentry } from "./sentry";
initSentry();

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Analytics />
    <SpeedInsights />
  </React.StrictMode>,
);
