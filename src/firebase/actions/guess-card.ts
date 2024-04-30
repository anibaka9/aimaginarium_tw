import { setDoc, doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { playerType } from "@/types";
import { computeScores } from "./compute-scores";

export default async function guessCard(
  cardId: string,
  roomId: string,
  userId: string,
) {
  const user = await getDoc(doc(db, "rooms", roomId, "players", userId));
  const { nickname } = user.data() as playerType;
  await setDoc(doc(db, "rooms", roomId, "guesses", userId), {
    selectedCardId: cardId,
    playerNickname: nickname,
  });
  const guesses = await getDocs(collection(db, "rooms", roomId, "guesses"));
  const guessesLength = guesses.docs.length;

  const playersLength = await getDocs(
    collection(db, "rooms", roomId, "players"),
  ).then((players) => players.docs.length);

  if (guessesLength === playersLength - 1) {
    await computeScores(roomId);
  }
}
