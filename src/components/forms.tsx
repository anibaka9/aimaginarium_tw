/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/WcpTGX3zRIj
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function Forms() {
  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      <div className="flex space-x-4">
        <Button asChild>
          <Link to="/create">Create Room</Link>
        </Button>
        <Button asChild>
          <Link to="/join">Join Room</Link>
        </Button>
      </div>
    </div>
  );
}
