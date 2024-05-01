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

export async function copyRoom(oldRoomId: string): Promise<string> {
  const players = await getDocs(collection(db, "rooms", oldRoomId, "players"));

  const oldRoomData = (await getDoc(doc(db, "rooms", oldRoomId))).data();

  const roomId = idGenerator.rnd();

  const roomData: roomType = {
    createdAt: new Date(),
    stage: "lobby",
    host: oldRoomData?.host,
  };
  const batch = writeBatch(db);
  batch.set(doc(db, "rooms", roomId), roomData);

  for (const player of players.docs) {
    batch.set(doc(db, "rooms", roomId, "players", player.id), {
      nickname: player.data().nickname,
      ...(player.data().host ? { host: true } : {}),
    });
  }

  batch.update(doc(db, "rooms", oldRoomId), {
    newRoomId: roomId,
  });

  await batch.commit();
  return roomId;
}
