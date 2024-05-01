import { doc, writeBatch } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import { signInAnonymously } from "firebase/auth";
import { roomType } from "@/types";
import { idGenerator } from "@/lib/utils";

export async function createRoom(nickname: string): Promise<string> {
  const {
    user: { uid },
  } = await signInAnonymously(auth);
  const roomId = idGenerator.rnd();
  const roomData: roomType = {
    createdAt: new Date(),
    stage: "lobby",
    host: uid,
  };
  const batch = writeBatch(db);
  batch.set(doc(db, "rooms", roomId), roomData);
  batch.set(doc(db, "rooms", roomId, "players", uid), {
    nickname: nickname,
    host: true,
  });
  await batch.commit();
  return roomId;
}
