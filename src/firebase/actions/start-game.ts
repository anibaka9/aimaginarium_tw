import { playerType } from "@/types";
import {
  collection,
  query,
  getDocs,
  writeBatch,
  doc,
  startAt,
  endAt,
  orderBy,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase-config";
import { sampleSize } from "lodash-es";
import playersQuery from "../queries/players";
import roomQuery from "../queries/room";

const CARDS_PER_PLAYER = 5;
const DECK_SIZE = 20;

export async function startGame(roomId: string) {
  const players = (await getDocs(playersQuery(roomId))).docs.map((el) => ({
    id: el.id,
    ...(el.data() as playerType),
  }));

  if (players) {
    const randomIndex = Math.floor(Math.random() * players.length);
    const randomPlayer = players[randomIndex];
    const cardIdsData = await getDoc(doc(db, "cardIds", "cardIds"));

    const { cardIds } = cardIdsData.data() as { cardIds: string[] };
    const sampleCardIds = sampleSize(cardIds, DECK_SIZE);

    const batch = writeBatch(db);
    const promises = sampleCardIds.map(
      (cardId, index) =>
        new Promise((resolve) => {
          getDoc(doc(db, "cards", cardId)).then((cardData) => {
            const newCardRef = doc(db, "rooms", roomId, "deck", cardId);
            batch.set(newCardRef, { ...cardData.data(), index });
            resolve(newCardRef);
          });
        }),
    );

    await Promise.all(promises);

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
      cardsIndex = cardsIndex + CARDS_PER_PLAYER;
    }

    secondBatch.update(roomQuery(roomId), {
      stage: "game",
      moveStage: "association",
      activePlayer: randomPlayer?.id,
      cardsIndex: cardsIndex,
    });

    await secondBatch.commit();
  }
}
