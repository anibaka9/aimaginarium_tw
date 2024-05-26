import { auth } from "@/firebase/firebase-config";
import usePlayers from "@/firebase/hooks/usePlayers";
import useRoom from "@/firebase/hooks/useRoom";
import { useAuthState } from "react-firebase-hooks/auth";

export function GameHeader() {
  const [user] = useAuthState(auth);

  const players = usePlayers();

  const room = useRoom();

  const activePlayer = players.find(
    (player) => player.id === room?.activePlayer,
  );

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full">
      <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">AImaginarium</h1>
        <div className="flex items-center space-x-2">
          <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap">
            It's{"\n"}
            <span className="font-bold text-primary">
              {activePlayer?.nickname}'s
            </span>
            {"\n"}turn{"\n"}
          </span>
          <div className="w-3 h-3 bg-primary rounded-full" />
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        {players.map((player) => (
          <div
            key={player.id}
            className="bg-gray-200 dark:bg-gray-700 rounded-lg py-4 px-8 flex flex-col items-center justify-center max-w-sm"
          >
            <div className="w-10 h-10 bg-primary rounded-full mb-2" />
            <span className="text-sm font-medium">
              {player.nickname} {player.id === user?.uid ? "(You)" : ""}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              Score: {player.score || 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
