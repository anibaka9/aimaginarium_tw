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
    <div className="flex flex-col items-start gap-4 p-4">
      <div className="flex flex-col  gap-4 p-4">
        {moveResult?.map((result) => (
          <div
            key={result.id}
            className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 font-medium"
          >
            {result.playerNickname}: {result.score} points
          </div>
        ))}
        {isActivePlayer ? (
          <Button onClick={() => goToNextMove(roomId)}>Go to next move</Button>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-4 w-full justify-center">
        {selectedCards.map((card) => (
          <div
            key={card.selectedCardId}
            className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex flex-col items-center"
          >
            <ImageCard
              key={card.selectedCardId}
              id={card.selectedCardId}
              fileName={card.fileName}
              blocked={true}
              selected={card.original}
            />
            {card.original ? (
              <div className="text-gray-700 dark:text-gray-300 text-lg">
                Original card
              </div>
            ) : null}
            <div className="text-gray-700 dark:text-gray-300">
              Card by {card.playerNickname}
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              {card?.guesses?.length
                ? "Guessed by " + card?.guesses?.join(", ")
                : " "}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MoveResults;
