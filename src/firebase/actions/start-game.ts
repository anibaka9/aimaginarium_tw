import { playerWithIdType } from "@/types";
import {
  collection,
  query,
  limit,
  getDocs,
  writeBatch,
  doc,
  startAt,
  endAt,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase-config";

const CARDS_PER_PLAYER = 5;

export async function startGame(roomId: string, players: playerWithIdType[]) {
  if (players) {
    const randomIndex = Math.floor(Math.random() * players.length);
    const randomPlayer = players[randomIndex];

    const cardsRef = collection(db, "cards");
    const cards = query(cardsRef, limit(20));
    const cardsSnapshot = await getDocs(cards);

    const batch = writeBatch(db);
    for (let i = 0; i < cardsSnapshot.docs.length; i++) {
      const card = cardsSnapshot.docs[i];
      const newCardRef = doc(db, "rooms", roomId, "deck", card.id);
      batch.set(newCardRef, { ...card.data(), index: i });
    }

    await batch.commit();

    const secondBatch = writeBatch(db);

    let cardsIndex = 0;

    const deckRef = collection(db, "rooms", roomId, "deck");

    // deal cards
    for (const player of players) {
      const cards = query(
        deckRef,
        orderBy("index"),
        startAt(cardsIndex),
        endAt(cardsIndex + CARDS_PER_PLAYER - 1),
      );
      const cardsSnapshot = await getDocs(cards);

      for (const card of cardsSnapshot.docs) {
        const newCardRef = doc(
          db,
          "rooms",
          roomId,
          "players",
          player.id,
          "cards",
          card.id,
        );
        secondBatch.set(newCardRef, card.data());
      }
      cardsIndex = cardsIndex + 5;
    }

    await secondBatch.update(doc(db, "rooms", roomId), {
      stage: "game",
      moveStage: "association",
      activePlayer: randomPlayer?.id,
      cardsIndex: cardsIndex,
    });

    await secondBatch.commit();
  }
}
