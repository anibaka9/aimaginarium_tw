import { type ClassValue, clsx } from "clsx";
import ShortUniqueId from "short-unique-id";
import { twMerge } from "tailwind-merge";

const alphabet = [...Array(26)].map((_, i) => String.fromCharCode(i + 65));

export const idGenerator = new ShortUniqueId({
  length: 4,
  dictionary: alphabet,
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
