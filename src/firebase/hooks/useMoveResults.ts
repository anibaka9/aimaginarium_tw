import { Route } from "@/routes/room/$roomId";
import { useCollection } from "react-firebase-hooks/firestore";
import moveResultQuery from "../queries/moveResult";

export default function useMoveResults() {
  const { roomId } = Route.useParams();
  const loaderData = Route.useLoaderData();
  const resultsValueFromLoader = loaderData?.moveResultsValue;
  const [resultsValue] = useCollection(moveResultQuery(roomId));
  return (resultsValue || resultsValueFromLoader)?.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as {
      score: number;
      playerNickname: string;
    }),
  }));
}
