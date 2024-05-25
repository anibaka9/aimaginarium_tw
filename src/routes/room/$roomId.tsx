import Room from "@/components/room";
import { auth, db } from "@/firebase/firebase-config";
import guessesQuery from "@/firebase/queries/guesses";
import moveResultQuery from "@/firebase/queries/moveResult";
import playerCardsQuery from "@/firebase/queries/playerCards";
import playersQuery from "@/firebase/queries/players";
import roomQuery from "@/firebase/queries/room";
import { selectedCardQuery } from "@/firebase/queries/selectedCard";
import { createFileRoute } from "@tanstack/react-router";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

export const Route = createFileRoute("/room/$roomId")({
  component: () => <Room />,
  loader: async ({ params }) => {
    const { roomId } = params;
    const { currentUser } = auth;
    if (currentUser?.uid) {
      const { uid } = currentUser;
      const [
        roomValue,
        playersValue,
        moveResultsValue,
        selectedCardValue,
        playerCardsValue,
      ] = await Promise.all([
        getDoc(roomQuery(roomId)),
        getDocs(playersQuery(roomId)),
        getDocs(moveResultQuery(roomId)),
        getDoc(selectedCardQuery(roomId, uid)),
        getDocs(playerCardsQuery(roomId, uid)),
      ]);
      return {
        roomValue,
        playersValue,
        moveResultsValue,
        selectedCardValue,
        playerCardsValue,
      };
    }
  },
});
