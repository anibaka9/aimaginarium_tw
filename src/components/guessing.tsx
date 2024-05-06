import { auth, db } from "@/firebase/firebase-config";
import { Route } from "@/routes/room/$roomId.lazy";
import { collection, doc } from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { roomType } from "@/types";
import { ImageCard } from "./image-card";
import { useAuthState } from "react-firebase-hooks/auth";
import guessCard from "@/firebase/actions/guess-card";
import { geSelctedCardsQuery } from "@/firebase/queries/selected-cards";

function Guessing() {
  const [user] = useAuthState(auth);

  const { roomId } = Route.useParams();
  const [selectedCardsValue] = useCollection(geSelctedCardsQuery(roomId));

  const [guessedCardValue] = useDocument(
    doc(db, "rooms", roomId, "guesses", user?.uid || ""),
  );
  const guessedCard = guessedCardValue?.data();
  const { selectedCardId } = guessedCard || {};

  const selectedCards =
    selectedCardsValue?.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as {
        selectedCardId: string;
        playerNickname: string;
        fileName: string;
      }),
    })) || [];
  const onCardClick = (cardId: string) => {
    guessCard(cardId, roomId, user?.uid || "");
  };
  const [roomValue] = useDocument(doc(db, "rooms", roomId));

  const room = roomValue?.data() as roomType;

  const { association, activePlayer } = room || {};

  const isActivePlayer = user?.uid === activePlayer;

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {association && (
        <div className="flex flex-col items-center gap-4 p-4">
          <div className="flex flex-col items-center gap-4 p-4">
            Association: {association}
            <br />
            {isActivePlayer
              ? "Waiting for players to select cards"
              : "Guess the card"}
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-4 w-full justify-center">
        {selectedCards.map((card) => (
          <ImageCard
            key={card.selectedCardId}
            onCardClick={onCardClick}
            id={card.selectedCardId}
            fileName={card.fileName}
            blocked={isActivePlayer || card.id === user?.uid}
            selected={selectedCardId === card.selectedCardId}
          />
        ))}
      </div>
    </div>
  );
}

export default Guessing;
