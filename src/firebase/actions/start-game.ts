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
  console.log("roomId", roomId);
  console.log("players", players);
  if (players) {
    console.log("players", players);
    const randomIndex = Math.floor(Math.random() * players.length);
    const randomPlayer = players[randomIndex];

    const cardsRef = collection(db, "cards");
    const cards = query(cardsRef, limit(20));
    const cardsSnapshot = await getDocs(cards);
    console.log("cardsSnapshot.docs", cardsSnapshot.docs);

    const batch = writeBatch(db);
    for (let i = 0; i < cardsSnapshot.docs.length; i++) {
      const card = cardsSnapshot.docs[i];
      const newCardRef = doc(db, "rooms", roomId, "deck", card.id);
      batch.set(newCardRef, { ...card.data(), index: i });
    }

    await batch.set(doc(db, "rooms", roomId), {
      stage: "game",
      moveStage: "association",
      activePlayerNick: randomPlayer?.nickname,
    });

    await batch.commit();

    const cardsBatch = writeBatch(db);

    let cardsIndex = 0;

    const deckRef = collection(db, "rooms", roomId, "deck");

    // deal cards
    for (const player of players) {
      console.log("player", player);
      const deckRef = collection(db, "rooms", roomId, "deck");
      const cards = query(
        deckRef,
        orderBy("index"),
        startAt(cardsIndex),
        endAt(cardsIndex + CARDS_PER_PLAYER - 1),
      );
      const cardsSnapshot = await getDocs(cards);

      console.log("cardsSnapshot.docs", cardsSnapshot.docs);

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
        cardsBatch.set(newCardRef, card.data());
      }
      cardsIndex = cardsIndex + 5;
    }

    await cardsBatch.commit();
  }
}
