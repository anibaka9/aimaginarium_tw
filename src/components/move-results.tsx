import { auth, db } from "@/firebase/firebase-config";
import { Route } from "@/routes/room/$roomId.lazy";
import { collection, doc } from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { ImageCard } from "./image-card";
import { Button } from "./ui/button";
import { roomType } from "@/types";
import { useAuthState } from "react-firebase-hooks/auth";
import { goToNextMove } from "@/firebase/actions/go-to-next-move";
import { geSelctedCardsQuery } from "@/firebase/queries/selected-cards";

function MoveResults() {
  const { roomId } = Route.useParams();
  const [selectedCardsValue] = useCollection(geSelctedCardsQuery(roomId));

  const selectedCards =
    selectedCardsValue?.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as {
        selectedCardId: string;
        playerNickname: string;
        fileName: string;
        original: boolean;
        guesses?: string[];
      }),
    })) || [];

  const [resultsValue] = useCollection(
    collection(db, "rooms", roomId, "moveResult"),
  );
  const moveResult = resultsValue?.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as {
      score: number;
      playerNickname: string;
    }),
  }));
  const [user] = useAuthState(auth);

  const [roomValue] = useDocument(doc(db, "rooms", roomId));

  const room = roomValue?.data() as roomType;

  const { activePlayer } = room || {};

  const isActivePlayer = user?.uid === activePlayer;

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex flex-col items-center gap-4 p-4">
        {moveResult?.map((result) => (
          <div key={result.id}>
            <p>
              {result.playerNickname}: +{result.score}
            </p>
          </div>
        ))}
        {isActivePlayer ? (
          <Button onClick={() => goToNextMove(roomId)}>Go to next move</Button>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-4 w-full justify-center">
        {selectedCards.map((card) => (
          <div key={card.selectedCardId}>
            <p>card by {card.playerNickname}</p>
            <p>
              {card?.guesses?.length
                ? "Guessed by " + card?.guesses?.join(", ")
                : " "}
            </p>
            <ImageCard
              key={card.selectedCardId}
              id={card.selectedCardId}
              fileName={card.fileName}
              blocked={true}
              selected={card.original}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MoveResults;
