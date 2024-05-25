import { collection } from "firebase/firestore";
import { db } from "../firebase-config";

export default function moveResultQuery(roomId: string) {
  return collection(db, "rooms", roomId, "moveResult");
}
