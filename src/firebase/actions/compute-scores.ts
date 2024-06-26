import { collection, doc, getDocs, writeBatch } from "firebase/firestore";
import { db } from "../firebase-config";
import { geSelectedCardsQuery } from "../queries/selected-cards";
import guessesQuery from "../queries/guesses";
import { selectedCardQuery } from "../queries/selectedCard";
import roomQuery from "../queries/room";

export async function computeScores(roomId: string) {
  const guesses = (await getDocs(guessesQuery(roomId))).docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as {
      selectedCardId: string;
      playerNickname: string;
    }),
  }));
  const selectCards = (await getDocs(geSelectedCardsQuery(roomId))).docs.map(
    (doc) => ({
      id: doc.id,
      ...(doc.data() as {
        selectedCardId: string;
        playerNickname: string;
        fileName: string;
        original: boolean;
      }),
    }),
  );

  const results: { [key: string]: number } = {};
  const batch = writeBatch(db);
  for (const card of selectCards) {
    const cardGuesses = guesses.filter(
      (guess) => guess.selectedCardId === card.selectedCardId,
    );
    const guessesLength = cardGuesses.length;
    batch.update(selectedCardQuery(roomId, card.id), {
      guesses: cardGuesses.map((guess) => guess.playerNickname),
    });
    if (card.original) {
      for (const guess of cardGuesses) {
        results[guess.id] = (results[guess.id] || 0) + 3;
      }
      if (guessesLength !== guesses.length && guessesLength !== 0) {
        results[card.id] = (results[card.id] || 0) + 3 + guessesLength;
      }
    } else {
      results[card.id] = (results[card.id] || 0) + guessesLength;
    }
  }
  batch.update(roomQuery(roomId), {
    moveStage: "end",
  });

  for (const card of selectCards) {
    const { id, playerNickname } = card;
    batch.set(doc(db, "rooms", roomId, "moveResult", id), {
      score: results[id] || 0,
      playerNickname,
    });
  }

  batch.commit();
}
