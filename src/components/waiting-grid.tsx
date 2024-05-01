import { auth, db } from "@/firebase/firebase-config";
import { collection } from "firebase/firestore";
import { useMemo } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { ImageCard } from "./image-card";
import { Route } from "@/routes/room/$roomId.lazy";
import { useAuthState } from "react-firebase-hooks/auth";

export function WaitingGrid() {
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
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex flex-col items-center gap-4 p-4">
        <div className="flex flex-col items-center gap-4 p-4">
          Waiting for player to select card
        </div>
      </div>
      <div className="flex flex-wrap gap-4 w-full justify-center">
        {cards.map((card) => (
          <ImageCard
            key={card.id}
            id={card.id}
            fileName={card.fileName}
            blocked
          />
        ))}
      </div>
    </div>
  );
}
