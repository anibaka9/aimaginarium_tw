import { CardsGrid } from "./cards-grid";
import { auth } from "@/firebase/firebase-config";
import { Route } from "@/routes/room/$roomId";
import { useAuthState } from "react-firebase-hooks/auth";
import selectCard from "@/firebase/actions/select-card";
import useRoom from "@/firebase/hooks/useRoom";
import useSelectedCard from "@/firebase/hooks/useSelectedCard";

export function SelectingCard() {
  const { roomId } = Route.useParams();
  const [user] = useAuthState(auth);

  const room = useRoom();

  const { association } = room || {};

  const { selectedCardId } = useSelectedCard() || {};

  function onCardClick(cardId: string, fileName: string) {
    selectCard(cardId, fileName, roomId, user?.uid || "");
  }

  return (
    <div>
      <div className="flex flex-col items-center gap-4 p-4">
        {association && (
          <div className="flex flex-col items-center gap-4 p-4">
            <div className="flex flex-col items-center gap-4 p-4">
              Association: {association}
            </div>
          </div>
        )}
        <CardsGrid selectedCardId={selectedCardId} onCardClick={onCardClick} />
      </div>
    </div>
  );
}
