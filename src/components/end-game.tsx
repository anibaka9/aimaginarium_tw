import { Button } from "@/components/ui/button";
import { Route } from "@/routes/room/$roomId";
import { cn } from "@/lib/utils";
import { copyRoom } from "@/firebase/actions/copy-room";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import usePlayers from "@/firebase/hooks/usePlayers";
import useRoom from "@/firebase/hooks/useRoom";
import { auth } from "@/firebase/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";

type PlayerCardProps = {
  isWinner: boolean;
  nickname: string;
  score: number;
};

function PlayerCard({ isWinner, nickname, score }: PlayerCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg p-4 flex flex-col items-center justify-center",
        isWinner ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700",
      )}
    >
      <div className="w-10 h-10 rounded-full mb-2 bg-white" />
      <span className="text-sm font-medium">{nickname}</span>
      <span
        className={cn(
          " text-sm",
          isWinner ? "text-white" : "text-gray-500 dark:text-gray-400",
        )}
      >
        Score: {score}
      </span>
    </div>
  );
}

export function EndGame() {
  const { roomId } = Route.useParams();
  const navigate = useNavigate();

  const players = usePlayers();

  const winner = players.reduce((winner, player) => {
    if (player.score > winner?.score) {
      return player;
    }
    return winner;
  }, players[0]);

  const onStartNewGame = async () => {
    await copyRoom(roomId);
  };

  const room = useRoom();

  const newRoomId = room?.newRoomId;

  const [user] = useAuthState(auth);

  const isHost = room?.host === user?.uid;

  useEffect(() => {
    if (newRoomId) {
      navigate({ to: "/room/$roomId", params: { roomId: newRoomId } });
    }
  }, [newRoomId, navigate]);

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Imaginarium</h1>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 dark:text-gray-400">
              Winner: {winner?.nickname}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              isWinner={player.id === winner?.id}
              score={player.score}
              nickname={player.nickname}
            />
          ))}
        </div>
        {isHost && (
          <div className="flex justify-center mt-8">
            <Button onClick={onStartNewGame}>New Game</Button>
          </div>
        )}
      </div>
    </main>
  );
}
