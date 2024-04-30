import { setDoc, doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { playerType } from "@/types";

export default async function selectCard(
  cardId: string,
  fileName: string,
  roomId: string,
  userId: string,
  original?: boolean,
) {
  const user = await getDoc(doc(db, "rooms", roomId, "players", userId));
  const { nickname } = user.data() as playerType;
  await setDoc(
    doc(db, "rooms", roomId, "selectedCards", userId),
    {
      selectedCardId: cardId,
      playerNickname: nickname,
      fileName: fileName,
      original: Boolean(original),
    },
    { merge: true },
  );
  const selectedCards = await getDocs(
    collection(db, "rooms", roomId, "selectedCards"),
  );
  const selectedCardsLength = selectedCards.docs.length;

  const playersLength = await getDocs(
    collection(db, "rooms", roomId, "players"),
  ).then((players) => players.docs.length);

  if (selectedCardsLength === playersLength) {
    await setDoc(
      doc(db, "rooms", roomId),
      {
        moveStage: "guessing",
      },
      { merge: true },
    );
  }
}
