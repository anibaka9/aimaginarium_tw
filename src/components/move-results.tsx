import { db } from "@/firebase/firebase-config";
import { Route } from "@/routes/room/$roomId.lazy";
import { collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { ImageCard } from "./image-card";

function MoveResults() {
  const { roomId } = Route.useParams();
  const [selectedCardsValue] = useCollection(
    collection(db, "rooms", roomId, "selectedCards"),
  );

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
      </div>
      <div className="flex flex-wrap gap-4 w-full justify-center">
        {selectedCards.map((card) => (
          <div>
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
