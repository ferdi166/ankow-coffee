import { ChangeEvent } from "react";

export { cn } from "cn";

export function getImageData(event: ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0];

  if (!file) return null;

  return {
    file,
    displayUrl: URL.createObjectURL(file),
  };
}
