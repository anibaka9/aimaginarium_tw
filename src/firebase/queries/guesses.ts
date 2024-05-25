import { collection } from "firebase/firestore";
import { db } from "../firebase-config";

export default function guessesQuery(roomId: string) {
  return collection(db, "rooms", roomId, "guesses");
}
