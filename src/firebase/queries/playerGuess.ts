import { doc } from "firebase/firestore";
import { db } from "../firebase-config";

export default function playerGuessQuery(roomId: string, playerId: string) {
  return doc(db, "rooms", roomId, "guesses", playerId);
}
