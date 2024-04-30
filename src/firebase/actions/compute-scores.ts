import { collection, doc, getDocs, writeBatch } from "firebase/firestore";
import { db } from "../firebase-config";

export async function computeScores(roomId: string) {
  const guesses = (
    await getDocs(collection(db, "rooms", roomId, "guesses"))
  ).docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as {
      selectedCardId: string;
      playerNickname: string;
    }),
  }));
  const selectCards = (
    await getDocs(collection(db, "rooms", roomId, "selectedCards"))
  ).docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as {
      selectedCardId: string;
      playerNickname: string;
      fileName: string;
      original: boolean;
    }),
  }));

  const results: { [key: string]: number } = {};
  const batch = writeBatch(db);
  for (const card of selectCards) {
    const cardGuesses = guesses.filter(
      (guess) => guess.selectedCardId === card.selectedCardId,
    );
    const guessesLength = cardGuesses.length;
    batch.set(
      doc(db, "rooms", roomId, "selectedCards", card.id),
      {
        guesses: cardGuesses.map((guess) => guess.playerNickname),
      },
      { merge: true },
    );
    if (card.original) {
      for (const guess of cardGuesses) {
        results[guess.id] = (results[guess.id] || 0) + 3;
      }
      if (guessesLength !== guesses.length) {
        results[card.id] = (results[card.id] || 0) + 3 + guessesLength;
      }
    } else {
      results[card.id] = (results[card.id] || 0) + guessesLength;
    }
  }
  batch.set(
    doc(db, "rooms", roomId),
    {
      moveStage: "end",
    },
    { merge: true },
  );
  for (const card of selectCards) {
    const { id, playerNickname } = card;
    batch.set(
      doc(db, "rooms", roomId, "moveResult", id),
      {
        score: results[id] || 0,
        playerNickname,
      },
      { merge: true },
    );
  }

  batch.commit();
}
