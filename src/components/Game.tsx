import { auth, db } from "@/firebase/firebase-config";
import { Route } from "@/routes/room/$roomId.lazy";
import { roomType } from "@/types";
import { doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import { Association } from "./assosiation";
import { SelectingCard } from "./selecting-card";

export function Game() {
  const { roomId } = Route.useParams();
  const [user] = useAuthState(auth);

  const [roomValue] = useDocument(doc(db, "rooms", roomId));
  const room = roomValue?.data() as roomType | undefined;
  const { activePlayer, moveStage } = room || {};
  const isActivePlayer = user?.uid === activePlayer;

  if (moveStage === "association") {
    if (isActivePlayer) {
      return <Association />;
    } else {
      return <div>Waiting for player</div>;
    }
  }

  if (moveStage === "selecting") {
    if (isActivePlayer) {
      return "Waiting for players to select cards";
    } else {
      return <SelectingCard />;
    }
  }

  if (moveStage === "gassing") {
    return <div>Gassing</div>;
  }
}
