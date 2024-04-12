import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

export function CopyRoomLink({ roomId }: { roomId: string }) {
  const { toast } = useToast();
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => {
        navigator.clipboard.writeText(
          window.location.origin + "/room/" + roomId,
        );
        toast({
          description: "Invite link copied to clipboard",
        });
      }}
    >
      Copy invite link
    </Button>
  );
}
