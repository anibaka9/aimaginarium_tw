import { storage } from "@/firebase/firebase-config";
import { ref as storageRef } from "firebase/storage";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

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
        "max-w-[300px] aspect-card overflow-hidden border-2 border-transparent",
        selected && "border-2 border-red-500",
        !blocked &&
          "hover:border-blue-500 hover:border-2  hover:shadow-lg cursor-pointer",
      )}
      onClick={() => onCardClick && onCardClick(id, fileName)}
    >
      {loading ? (
        <Skeleton className="h-[523.5px] w-[300px] rounded-xl" />
      ) : (
        <img
          alt="Image"
          className="aspect-cover object-center h-[523.5px] w-[300px]"
          height={523.5}
          width={300}
          src={downloadUrl}
        />
      )}
    </Card>
  );
}
