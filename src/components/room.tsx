import { auth } from "@/firebase/firebase-config";
import { Lobby } from "./lobby";
import { useAuthState } from "react-firebase-hooks/auth";
import { JoinCreatedRoom } from "./join-created-room";
import { Game } from "./Game";
import { EndGame } from "./end-game";
import usePlayers from "@/firebase/hooks/usePlayers";
import useRoom from "@/firebase/hooks/useRoom";

function Room() {
  const room = useRoom();
  const stage = room?.stage;
  const [user] = useAuthState(auth);

  const players = usePlayers();

  const isPlayerLoggedIn = players?.some((player) => player.id === user?.uid);

  if (!isPlayerLoggedIn) {
    if (stage === "lobby") {
      return <JoinCreatedRoom />;
    } else {
      return <>game already started</>;
    }
  }
  switch (stage) {
    case "lobby":
      return <Lobby />;
    case "game":
      return <Game />;
    case "end":
      return <EndGame />;
    default:
      return <div>Unknown</div>;
  }
}

export default Room;
