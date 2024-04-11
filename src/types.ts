export type gameStage = "lobby" | "game" | "end";

export type roomType = {
  createdAt: Date;
  stage: gameStage;
};

export type playerType = {
  user: string;
  nickname: string;
  host: boolean;
};
