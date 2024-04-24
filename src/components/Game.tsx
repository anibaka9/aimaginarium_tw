import { auth, db } from "@/firebase/firebase-config";
import { Route } from "@/routes/room/$roomId.lazy";
import { playerType, roomType } from "@/types";
import { collection, doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { Association } from "./assosiation";

export function Game() {
  const { roomId } = Route.useParams();
  const [user] = useAuthState(auth);

  const [playersValue] = useCollection(
    collection(db, "rooms", roomId, "players"),
  );
  const players = playersValue?.docs.map((doc) => ({
    ...(doc.data() as playerType),
    id: doc.id,
  }));
  const userNick = players?.find((player) => player.id === user?.uid)?.nickname;
  const [roomValue] = useDocument(doc(db, "rooms", roomId));
  const room = roomValue?.data() as roomType | undefined;
  const { activePlayerNick, moveStage } = room || {};
  const isActivePlayer = userNick === activePlayerNick;

  if (moveStage === "association") {
    if (isActivePlayer) {
      return <Association />;
    } else {
      return <div>Waiting for player</div>;
    }
  }

  if (moveStage === "selecting") {
    return <div>Selecting</div>;
  }

  if (moveStage === "gassing") {
    return <div>Gassing</div>;
  }
}
