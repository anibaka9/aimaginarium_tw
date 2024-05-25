import { doc } from "firebase/firestore";
import { db } from "../firebase-config";

export function selectedCardQuery(roomId: string, userId: string) {
  return doc(db, "rooms", roomId, "selectedCards", userId);
}
