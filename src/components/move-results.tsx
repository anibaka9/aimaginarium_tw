import { auth } from "@/firebase/firebase-config";
import { Route } from "@/routes/room/$roomId";
import { useCollection } from "react-firebase-hooks/firestore";
import { ImageCard } from "./image-card";
import { Button } from "./ui/button";
import { useAuthState } from "react-firebase-hooks/auth";
import { goToNextMove } from "@/firebase/actions/go-to-next-move";
import { geSelectedCardsQuery } from "@/firebase/queries/selected-cards";
import useMoveResults from "@/firebase/hooks/useMoveResults";
import useRoom from "@/firebase/hooks/useRoom";

function MoveResults() {
  const { roomId } = Route.useParams();
  const [selectedCardsValue] = useCollection(geSelectedCardsQuery(roomId));

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

  const moveResult = useMoveResults();

  const [user] = useAuthState(auth);

  const room = useRoom();

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
