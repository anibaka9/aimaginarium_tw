import { Route } from "@/routes/room/$roomId";
import { playerType, playerWithIdType } from "@/types";
import { useCollection } from "react-firebase-hooks/firestore";
import playersQuery from "../queries/players";

export default function usePlayers(): playerWithIdType[] {
  const { roomId } = Route.useParams();
  const loaderData = Route.useLoaderData();
  const playersValueFromLoader = loaderData?.playersValue;
  const [playersValue] = useCollection(playersQuery(roomId));
  return (
    (playersValue || playersValueFromLoader)?.docs.map((doc) => ({
      ...(doc.data() as playerType),
      id: doc.id,
    })) || []
  );
}
