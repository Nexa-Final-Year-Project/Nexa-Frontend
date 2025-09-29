"use client";

import { CircleUserRoundIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  imageUrl: string | null;
  onPick: () => void;
  onRemove: () => void;
  size?: number;
  shape?: "circle" | "rect";
}

export function ImageUploadButton({
  imageUrl,
  onPick,
  onRemove,
  size = 64,
  shape = "rect",
}: Props) {
  return (
    <div className="relative inline-flex">
      <button
        style={{ width: size, height: size }}
        className={`border-input hover:bg-accent/50 relative flex items-center justify-center overflow-hidden rounded-${
          shape === "circle" ? "full" : "md"
        } border border-dashed`}
        onClick={onPick}
      >
        {imageUrl ? (
          <img src={imageUrl} className="size-full object-cover" />
        ) : (
          <CircleUserRoundIcon className="size-4 opacity-60" />
        )}
      </button>
      {imageUrl && (
        <Button
          onClick={onRemove}
          size="icon"
          className="absolute -top-1 -left-1 size-6 rounded-full border-2"
        >
          <XIcon className="size-3.5" />
        </Button>
      )}
    </div>
  );
}
