export type gameStage = "lobby" | "game" | "end";
export type moveStage = "association" | "selecting" | "gassing";

export type roomType = {
  createdAt: Date;
  stage: gameStage;
  host: string;
  moveStage?: moveStage;
  activePlayerNick?: string;
};

export type playerType = {
  user: string;
  nickname: string;
  host: boolean;
};
