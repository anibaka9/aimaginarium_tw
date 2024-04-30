import { storage } from "@/firebase/firebase-config";
import { ref as storageRef } from "firebase/storage";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CardProps = {
  id: string;
  fileName: string;
  onCardClick?: (id: string, fileName: string) => void;
  selected?: boolean;
  blocked?: boolean;
};

export function ImageCard({
  id,
  fileName,
  onCardClick,
  selected,
  blocked,
}: CardProps) {
  const [downloadUrl, loading] = useDownloadURL(
    storageRef(storage, "cards/" + fileName),
  );

  return (
    <Card
      className={cn(
        "max-w-[300px] aspect-card overflow-hidden ",
        selected && "border-2 border-red-500",
        !blocked &&
          "hover:border-blue-500 hover:border-2  hover:shadow-lg cursor-pointer",
      )}
      onClick={() => onCardClick && onCardClick(id, fileName)}
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
