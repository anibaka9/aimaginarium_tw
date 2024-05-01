export type gameStage = "lobby" | "game" | "end";
export type moveStage = "association" | "selecting" | "guessing";

export type roomType = {
  createdAt: Date;
  stage: gameStage;
  host: string;
  moveStage?: moveStage;
  activePlayer?: string;
  selectedForAssociation?: string;
  association?: string;
  result?: { [key: string]: number };
  cardsIndex?: number;
};

export type playerType = {
  nickname: string;
  host: boolean;
  score: number;
};

export type playerWithIdType = playerType & { id: string };

export type CardType = {
  imageName: string;
  imageUrl?: string;
  id: string;
};
