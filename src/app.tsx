import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <div className="flex h-screen bg-gradient-to-r from-cyan-500 to-blue-500 bg-cover"></div>
  );
}

export default App;
