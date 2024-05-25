import { Route } from "@/routes/room/$roomId";
import { useDocument } from "react-firebase-hooks/firestore";
import { selectedCardQuery } from "../queries/selectedCard";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase-config";

export default function useSelectedCard() {
  const [user] = useAuthState(auth);
  const { roomId } = Route.useParams();
  const loaderData = Route.useLoaderData();
  const selectedCardValueFromLoader = loaderData?.selectedCardValue;
  const [selectedCardValue] = useDocument(
    selectedCardQuery(roomId, user?.uid || ""),
  );
  return (selectedCardValue || selectedCardValueFromLoader)?.data() as
    | {
        selectedCardId: string | undefined;
      }
    | undefined;
}
