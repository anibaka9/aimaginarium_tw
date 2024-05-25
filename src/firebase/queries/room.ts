import { doc } from "firebase/firestore";
import { db } from "../firebase-config";

export default function roomQuery(roomId: string) {
  return doc(db, "rooms", roomId);
}
