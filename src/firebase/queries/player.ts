import { doc } from "firebase/firestore";
import { db } from "../firebase-config";

export default function playerQuery(roomId: string, playerId: string) {
  return doc(db, "rooms", roomId, "players", playerId);
}
