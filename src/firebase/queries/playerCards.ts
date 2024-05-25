import { collection } from "firebase/firestore";
import { db } from "../firebase-config";

export default function playerCardsQuery(roomId: string, userId: string) {
  return collection(db, "rooms", roomId, "players", userId, "cards");
}
