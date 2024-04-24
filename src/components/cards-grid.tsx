import { ImageCard } from "./image-card";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase-config";
import { Route } from "@/routes/room/$roomId.lazy";
import { useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export function CardsGrid() {
  function selectCard() {}
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
          selectCard={selectCard}
          id={card.id}
          fileName={card.fileName}
        />
      ))}
    </div>
  );
}
