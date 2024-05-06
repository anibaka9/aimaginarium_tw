import {
  getDocs,
  collection,
  writeBatch,
  doc,
  increment,
  endAt,
  orderBy,
  query,
  startAt,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase-config";
import { playerType, roomType } from "@/types";
import { geSelctedCardsQuery } from "../queries/selected-cards";

export async function goToNextMove(roomId: string) {
  const batch = writeBatch(db);

  // update scores

  const results = (
    await getDocs(collection(db, "rooms", roomId, "moveResult"))
  ).docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as {
      score: number;
      playerNickname: string;
    }),
  }));

  for (const result of results) {
    batch.update(doc(db, "rooms", roomId, "players", result.id), {
      score: increment(result.score),
    });
  }

  const guessesIds = (
    await getDocs(collection(db, "rooms", roomId, "guesses"))
  ).docs.map((doc) => doc.id);

  const selectedCards = (await getDocs(geSelctedCardsQuery(roomId))).docs.map(
    (doc) => ({
      id: doc.id,
      ...(doc.data() as {
        selectedCardId: string;
        playerNickname: string;
        fileName: string;
        original: boolean;
        guesses?: string[];
      }),
    }),
  );

  // deal new cards

  const players = (
    await getDocs(collection(db, "rooms", roomId, "players"))
  ).docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as playerType),
  }));

  const deckRef = collection(db, "rooms", roomId, "deck");
  const room = (await getDoc(doc(db, "rooms", roomId))).data() as roomType;
  const { cardsIndex = 0, activePlayer } = room;

  const newCards = await getDocs(
    query(
      deckRef,
      orderBy("index"),
      startAt(cardsIndex),
      endAt(cardsIndex + players.length - 1),
    ),
  );

  for (let i = 0; i < players.length; i++) {
    const newCard = newCards.docs[i];
    const player = players[i];
    if (newCard) {
      batch.set(
        doc(db, "rooms", roomId, "players", player.id, "cards", newCard.id),
        newCard.data(),
      );
    }
  }

  //clean up

  for (const card of selectedCards) {
    const { id, selectedCardId } = card;
    batch.delete(doc(db, "rooms", roomId, "selectedCards", id));
    batch.delete(
      doc(db, "rooms", roomId, "players", id, "cards", selectedCardId),
    );
  }
  for (const guessId of guessesIds) {
    batch.delete(doc(db, "rooms", roomId, "guesses", guessId));
  }

  for (const result of results) {
    batch.delete(doc(db, "rooms", roomId, "moveResult", result.id));
  }

  // finish game if deck is empty

  const gameFinished = newCards.docs.length < players.length;

  if (gameFinished) {
    batch.update(doc(db, "rooms", roomId), {
      stage: "end",
    });
  } else {
    const nextActivePlayer =
      players[
        (players.findIndex((player) => player.id === activePlayer) + 1) %
          players.length
      ];
    batch.update(doc(db, "rooms", roomId), {
      activePlayer: nextActivePlayer?.id,
      cardsIndex: cardsIndex + players.length,
      association: "",
      moveStage: "association",
    });
  }

  batch.commit();
}
