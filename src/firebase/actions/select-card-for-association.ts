import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase-config";

export default async function selectCardForAssociation(
  cardId: string,
  roomId: string,
) {
  await setDoc(
    doc(db, "rooms", roomId),
    {
      selectedForAssociation: cardId,
    },
    { merge: true },
  );
}
