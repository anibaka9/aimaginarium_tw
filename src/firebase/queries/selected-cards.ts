import { query, collection, orderBy } from "firebase/firestore";
import { db } from "../firebase-config";

export const geSelectedCardsQuery = (roomId: string) =>
  query(collection(db, "rooms", roomId, "selectedCards"), orderBy("randomKey"));
