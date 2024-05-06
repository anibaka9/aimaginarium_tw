import {
  setDoc,
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase-config";
import { playerType } from "@/types";
import { idGenerator } from "@/lib/utils";
import { geSelctedCardsQuery } from "../queries/selected-cards";

export default async function selectCard(
  cardId: string,
  fileName: string,
  roomId: string,
  userId: string,
  original?: boolean,
) {
  const user = await getDoc(doc(db, "rooms", roomId, "players", userId));
  const { nickname } = user.data() as playerType;
  await setDoc(doc(db, "rooms", roomId, "selectedCards", userId), {
    selectedCardId: cardId,
    playerNickname: nickname,
    fileName: fileName,
    original: Boolean(original),
    randomKey: idGenerator.rnd(),
  });
  const selectedCards = await getDocs(geSelctedCardsQuery(roomId));
  const selectedCardsLength = selectedCards.docs.length;

  const playersLength = await getDocs(
    collection(db, "rooms", roomId, "players"),
  ).then((players) => players.docs.length);

  if (selectedCardsLength === playersLength) {
    await updateDoc(doc(db, "rooms", roomId), {
      moveStage: "guessing",
    });
  }
}
