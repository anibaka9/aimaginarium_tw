export type gameStage = "lobby" | "game" | "end";
export type moveStage = "association" | "selecting" | "gassing";

export type roomType = {
  createdAt: Date;
  stage: gameStage;
  host: string;
  moveStage?: moveStage;
  activePlayer?: string;
  selectedForAssociation?: string;
  association?: string;
};

export type playerType = {
  nickname: string;
  host: boolean;
};

export type playerWithIdType = playerType & { id: string };

export type CardType = {
  imageName: string;
  imageUrl?: string;
  id: string;
};
