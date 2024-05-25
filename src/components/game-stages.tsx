import { auth } from "@/firebase/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { Association } from "./assosiation";
import { SelectingCard } from "./selecting-card";
import Guessing from "./guessing";
import MoveResults from "./move-results";
import { WaitingGrid } from "./waiting-grid";
import useRoom from "@/firebase/hooks/useRoom";

export function GameStages() {
  const [user] = useAuthState(auth);
  const room = useRoom();
  const { activePlayer, moveStage } = room || {};
  const isActivePlayer = user?.uid === activePlayer;
  if (moveStage === "association") {
    if (isActivePlayer) {
      return <Association />;
    } else {
      return <WaitingGrid />;
    }
  }

  if (moveStage === "selecting") {
    if (isActivePlayer) {
      return <WaitingGrid />;
    } else {
      return <SelectingCard />;
    }
  }

  if (moveStage === "guessing") {
    return <Guessing />;
  }

  if (moveStage === "end") {
    return <MoveResults />;
  }
}
