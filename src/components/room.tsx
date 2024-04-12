import { auth, db } from "@/firebase-config";
import { Route } from "@/routes/room/$roomId.lazy";
import { playerType, roomType } from "@/types";
import { collection, doc } from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { Lobby } from "./lobby";
import { useAuthState } from "react-firebase-hooks/auth";
import { JoinCreatedRoom } from "./join-created-room";
import { Game } from "./Game";

function Room() {
  const { roomId } = Route.useParams();
  const [value, loading, error] = useDocument(doc(db, "rooms", roomId));
  const data = value?.data() as roomType | undefined;
  const stage = data?.stage;
  const [user] = useAuthState(auth);

  const [playersValue] = useCollection(
    collection(db, "rooms", roomId, "users"),
  );
  const players = playersValue?.docs.map((doc) => ({
    ...(doc.data() as playerType),
    id: doc.id,
  }));

  console.log(players);

  const isPlayerLoggedIn = players?.some((player) => player.id === user?.uid);

  if (loading || error) {
    return <div>Loading1</div>;
  }

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
    default:
      return <div>Unknown</div>;
  }
}

export default Room;
