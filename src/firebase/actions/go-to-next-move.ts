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
import { geSelectedCardsQuery } from "../queries/selected-cards";
import playersQuery from "../queries/players";
import moveResultQuery from "../queries/moveResult";
import roomQuery from "../queries/room";
import guessesQuery from "../queries/guesses";
import playerGuessQuery from "../queries/playerGuess";
import playerCardQuery from "../queries/playerCard";
import { selectedCardQuery } from "../queries/selectedCard";

export async function goToNextMove(roomId: string) {
  const batch = writeBatch(db);

  // update scores

  const results = (await getDocs(moveResultQuery(roomId))).docs.map((doc) => ({
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

  const guessesIds = (await getDocs(guessesQuery(roomId))).docs.map(
    (doc) => doc.id,
  );

  const selectedCards = (await getDocs(geSelectedCardsQuery(roomId))).docs.map(
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

  const players = (await getDocs(playersQuery(roomId))).docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as playerType),
  }));

  const deckRef = collection(db, "rooms", roomId, "deck");
  const room = (await getDoc(roomQuery(roomId))).data() as roomType;
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
      batch.set(playerCardQuery(roomId, player.id, newCard.id), newCard.data());
    }
  }

  //clean up

  for (const card of selectedCards) {
    const { id, selectedCardId } = card;
    batch.delete(selectedCardQuery(roomId, id));
    batch.delete(playerCardQuery(roomId, id, selectedCardId));
  }
  for (const guessId of guessesIds) {
    batch.delete(playerGuessQuery(roomId, guessId));
  }

  for (const result of results) {
    batch.delete(doc(db, "rooms", roomId, "moveResult", result.id));
  }

  // finish game if deck is empty

  const gameFinished = newCards.docs.length < players.length;

  if (gameFinished) {
    batch.update(roomQuery(roomId), {
      stage: "end",
    });
  } else {
    const nextActivePlayer =
      players[
        (players.findIndex((player) => player.id === activePlayer) + 1) %
          players.length
      ];
    batch.update(roomQuery(roomId), {
      activePlayer: nextActivePlayer?.id,
      cardsIndex: cardsIndex + players.length,
      association: "",
      moveStage: "association",
    });
  }

  batch.commit();
}
