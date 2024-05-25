import { Route } from "@/routes/room/$roomId";
import playerCardsQuery from "../queries/playerCards";
import { cardType, cardTypeWithId } from "@/types";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth } from "../firebase-config";

export default function usePlayerCards(): cardTypeWithId[] {
  const { roomId } = Route.useParams();
  const loaderData = Route.useLoaderData();
  const [user] = useAuthState(auth);
  const playerCardsValueValueFromLoader = loaderData?.playerCardsValue;
  const [playerCardsValue] = useCollection(
    playerCardsQuery(roomId, user?.uid || ""),
  );
  return (
    (playerCardsValue || playerCardsValueValueFromLoader)?.docs.map((doc) => ({
      ...(doc.data() as cardType),
      id: doc.id,
    })) || []
  );
}
