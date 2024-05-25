import { roomType } from "@/types";
import {
  getDocs,
  collection,
  writeBatch,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase-config";
import { idGenerator } from "@/lib/utils";
import playerQuery from "../queries/player";
import roomQuery from "../queries/room";

export async function copyRoom(oldRoomId: string): Promise<string> {
  const players = await getDocs(collection(db, "rooms", oldRoomId, "players"));

  const oldRoomData = (await getDoc(roomQuery(oldRoomId))).data();

  const roomId = idGenerator.rnd();

  const roomData: roomType = {
    createdAt: new Date(),
    stage: "lobby",
    host: oldRoomData?.host,
  };
  const batch = writeBatch(db);
  batch.set(roomQuery(roomId), roomData);

  for (const player of players.docs) {
    batch.set(playerQuery(roomId, player.id), {
      nickname: player.data().nickname,
      ...(player.data().host ? { host: true } : {}),
    });
  }

  batch.update(roomQuery(oldRoomId), {
    newRoomId: roomId,
  });

  await batch.commit();
  return roomId;
}
