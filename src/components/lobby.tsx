/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/hiCwLoUm1uq
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Route } from "@/routes/room/$roomId.lazy";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "@/firebase/firebase-config";
import { playerType, roomType } from "@/types";
import { useAuthState } from "react-firebase-hooks/auth";
import { CopyRoomLink } from "./copy-room-link";
import { startGame } from "@/firebase/actions/start-game";

export function Lobby() {
  const [user] = useAuthState(auth);

  const { roomId } = Route.useParams();
  const [playersValue] = useCollection(
    collection(db, "rooms", roomId, "players"),
  );
  const players = playersValue?.docs.map((doc) => ({
    ...(doc.data() as playerType),
    id: doc.id,
  }));
  const [roomValue] = useDocument(doc(db, "rooms", roomId));
  const room = roomValue?.data() as roomType;

  console.log(players);

  const isHost = room?.host === user?.uid;

  if (!players || !room) {
    return <div>Loading2</div>;
  }

  const onSubmit = async () => {
    console.log("players", players);
    if (players) {
      await startGame(roomId, players);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">🎨 Room name: {roomId}</CardTitle>
          <div>
            <CopyRoomLink roomId={roomId} />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-t border-gray-200 dark:border-gray-800">
            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
              {players.map((player) => (
                <li
                  key={player.nickname}
                  className="flex items-center justify-between p-4 space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">A</Avatar>
                    <div className="font-medium">{player.nickname}</div>
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {player.id === user?.uid
                      ? "You"
                      : player.host
                        ? "Host"
                        : "Player"}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        {isHost && (
          <CardFooter>
            <Button className="w-full" onClick={onSubmit}>
              Start game
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
