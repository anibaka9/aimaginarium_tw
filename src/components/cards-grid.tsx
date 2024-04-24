import { ImageCard } from "./image-card";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase-config";
import { Route } from "@/routes/room/$roomId.lazy";
import { useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import selectCard from "@/firebase/actions/select-card-for-association";
import { playerType, roomType } from "@/types";

type CardsGridProps = {
  selectedCardId?: string;
  onCardClick?: (cardId: string) => void;
};

export function CardsGrid({ selectedCardId, onCardClick }: CardsGridProps) {
  const { roomId } = Route.useParams();
  const [user] = useAuthState(auth);

  const [cardsValue] = useCollection(
    collection(db, "rooms", roomId, "players", user?.uid || "", "cards"),
  );

  const cards = useMemo(
    () =>
      cardsValue?.docs.map((doc) => ({
        id: doc.id,
        fileName: doc.data()?.fileName,
      })) || [],
    [cardsValue],
  );

  return (
    <div className="flex flex-wrap gap-4 w-full justify-center">
      {cards.map((card) => (
        <ImageCard
          key={card.id}
          onCardClick={onCardClick}
          id={card.id}
          fileName={card.fileName}
          selected={selectedCardId === card.id}
        />
      ))}
    </div>
  );
}
