export type gameStage = "lobby" | "game" | "end";

export type roomType = {
  createdAt: Date;
  stage: gameStage;
  host: string;
};

export type playerType = {
  user: string;
  nickname: string;
  host: boolean;
};
