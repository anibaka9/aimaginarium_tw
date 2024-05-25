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
import { geSelectedCardsQuery } from "../queries/selected-cards";
import playersQuery from "../queries/players";
import playerQuery from "../queries/player";
import { selectedCardQuery } from "../queries/selectedCard";

export default async function selectCard(
  cardId: string,
  fileName: string,
  roomId: string,
  userId: string,
  original?: boolean,
) {
  const user = await getDoc(playerQuery(roomId, userId));
  const { nickname } = user.data() as playerType;
  await setDoc(selectedCardQuery(roomId, userId), {
    selectedCardId: cardId,
    playerNickname: nickname,
    fileName: fileName,
    original: Boolean(original),
    randomKey: idGenerator.rnd(),
  });
  const selectedCards = await getDocs(geSelectedCardsQuery(roomId));
  const selectedCardsLength = selectedCards.docs.length;

  const playersLength = await getDocs(playersQuery(roomId)).then(
    (players) => players.docs.length,
  );

  if (selectedCardsLength === playersLength) {
    await updateDoc(doc(db, "rooms", roomId), {
      moveStage: "guessing",
    });
  }
}
