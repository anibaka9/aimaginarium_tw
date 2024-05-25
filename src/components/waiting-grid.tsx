import { ImageCard } from "./image-card";
import usePlayerCards from "@/firebase/hooks/usePlayerCards";

export function WaitingGrid() {
  const cards = usePlayerCards();

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
