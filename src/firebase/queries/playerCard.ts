import { doc } from "firebase/firestore";
import { db } from "../firebase-config";

export default function playerCardQuery(
  roomId: string,
  playerId: string,
  cardId: string,
) {
  return doc(db, "rooms", roomId, "players", playerId, "cards", cardId);
}
