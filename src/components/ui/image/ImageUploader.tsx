"use client";

import { useEffect, useRef, useState } from "react";
import { useFileUpload } from "@/hooks/use-file-upload";
import { ImageUploadButton } from "./ImageUploadButton";
import { ImageCropperDialog } from "./ImageCropperDialog";
import { useImageCropper } from "@/hooks/images/useImageCropper";

interface Props {
  initialImage?: string;
  onChange?: (file: Blob | null, url: string | null) => void;
  aspectRatio?: number;
  shape?: "circle" | "rect";
  size?: number;
}

export function ImageUploader({
  initialImage,
  onChange,
  aspectRatio = 1,
  shape = "rect",
  size = 64,
}: Props) {
  const [{ files }, { openFileDialog, getInputProps }] = useFileUpload({
    accept: "image/*",
  });
  const previewUrl = files[0]?.preview || null;

  const [finalImage, setFinalImage] = useState(initialImage || null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { crop, setCrop, zoom, setZoom, reset, getCroppedImg } =
    useImageCropper();
  const prevFileRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (files[0]?.id && files[0].id !== prevFileRef.current) {
      setDialogOpen(true);
      reset();
    }
    prevFileRef.current = files[0]?.id;
  }, [files, reset]);

  const applyCrop = async () => {
    if (!previewUrl || !crop) return;
    const blob = await getCroppedImg(previewUrl, crop);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    setFinalImage(url);
    onChange?.(blob, url);
    setDialogOpen(false);
  };

  const removeImage = () => {
    setFinalImage(null);
    onChange?.(null, null);
  };

  return (
    <div className="flex flex-col gap-2">
      <ImageUploadButton
        imageUrl={finalImage}
        onPick={openFileDialog}
        onRemove={removeImage}
        size={size}
        shape={shape}
      />
      <input {...getInputProps()} className="sr-only" />

      {previewUrl && (
        <ImageCropperDialog
          open={isDialogOpen}
          onClose={() => setDialogOpen(false)}
          imageUrl={previewUrl}
          zoom={zoom}
          setZoom={setZoom}
          onCropChange={setCrop}
          onApply={applyCrop}
        />
      )}
    </div>
  );
}
