import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase-config";

export async function generateCardList() {
  const cardsRef = collection(db, "cards");

  const cardsSnapshot = await getDocs(cardsRef);

  const cardIds = cardsSnapshot.docs.map((el) => el.id);

  await setDoc(doc(db, "cardIds", "cardIds"), {
    cardIds,
  });
}
