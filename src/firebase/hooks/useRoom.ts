import { Route } from "@/routes/room/$roomId";
import { roomType } from "@/types";
import { useDocument } from "react-firebase-hooks/firestore";
import roomQuery from "../queries/room";

export default function useRoom(): roomType | undefined {
  const { roomId } = Route.useParams();
  const loaderData = Route.useLoaderData();
  const roomValueFromLoader = loaderData?.roomValue;
  const [roomValue] = useDocument(roomQuery(roomId));
  return (roomValue || roomValueFromLoader)?.data() as roomType | undefined;
}
