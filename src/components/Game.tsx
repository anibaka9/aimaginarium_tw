import { auth, db } from "@/firebase/firebase-config";
import { Route } from "@/routes/room/$roomId.lazy";
import { roomType } from "@/types";
import { doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import { Association } from "./assosiation";
import { SelectingCard } from "./selecting-card";
import Guessing from "./guessing";
import MoveResults from "./move-results";
import { GameHeader } from "./game-header";
import { WaitingGrid } from "./waiting-grid";

export function Game() {
  const { roomId } = Route.useParams();
  const [user] = useAuthState(auth);

  const [roomValue] = useDocument(doc(db, "rooms", roomId));
  const room = roomValue?.data() as roomType | undefined;
  const { activePlayer, moveStage } = room || {};
  const isActivePlayer = user?.uid === activePlayer;

  return (
    <div>
      <GameHeader />
      {(() => {
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
      })()}
    </div>
  );
}
