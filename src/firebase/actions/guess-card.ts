import { setDoc, doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { playerType } from "@/types";
import { computeScores } from "./compute-scores";
import playersQuery from "../queries/players";
import guessesQuery from "../queries/guesses";
import playerGuessQuery from "../queries/playerGuess";
import playerQuery from "../queries/player";

export default async function guessCard(
  cardId: string,
  roomId: string,
  userId: string,
) {
  const user = await getDoc(playerQuery(roomId, userId));
  const { nickname } = user.data() as playerType;
  await setDoc(playerGuessQuery(roomId, userId), {
    selectedCardId: cardId,
    playerNickname: nickname,
  });
  const guesses = await getDocs(guessesQuery(roomId));
  const guessesLength = guesses.docs.length;

  const playersLength = await getDocs(playersQuery(roomId)).then(
    (players) => players.docs.length,
  );

  if (guessesLength === playersLength - 1) {
    await computeScores(roomId);
  }
}
