import { ImageCard } from "./image-card";
import usePlayerCards from "@/firebase/hooks/usePlayerCards";

type CardsGridProps = {
  selectedCardId?: string;
  onCardClick?: (cardId: string, fileName: string) => void;
};

export function CardsGrid({ selectedCardId, onCardClick }: CardsGridProps) {
  const cards = usePlayerCards();
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
