import { storage } from "@/firebase/firebase-config";
import { ref as storageRef } from "firebase/storage";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { Card } from "@/components/ui/card";

type CardProps = {
  id: string;
  fileName: string;
  selectCard?: (id: string) => void;
};

export function ImageCard({ id, fileName, selectCard }: CardProps) {
  const [downloadUrl, loading] = useDownloadURL(
    storageRef(storage, "cards/" + fileName),
  );

  console.log(downloadUrl);

  return (
    <Card
      className="max-w-[300px] aspect-card overflow-hidden hover:border-blue-500 hover:border-2  hover:shadow-lg"
      onClick={() => selectCard && selectCard(id)}
    >
      {loading ? (
        "loading"
      ) : (
        <img
          alt="Image"
          className="aspect-cover object-center"
          height={2912}
          width={1664}
          src={downloadUrl}
        />
      )}
    </Card>
  );
}
