import { collection } from "firebase/firestore";
import { db } from "../firebase-config";

export default function playersQuery(roomId: string) {
  return collection(db, "rooms", roomId, "players");
}
