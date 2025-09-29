"use client";

import { useState, useCallback } from "react";

type Area = { x: number; y: number; width: number; height };

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);
    image.crossOrigin = "anonymous";
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  crop: Area
): Promise<Blob | null> {
  try {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    canvas.width = crop.width;
    canvas.height = crop.height;
    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg");
    });
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function useImageCropper() {
  const [crop, setCrop] = useState<Area | null>(null);
  const [zoom, setZoom] = useState(1);

  const reset = useCallback(() => {
    setCrop(null);
    setZoom(1);
  }, []);

  return { crop, setCrop, zoom, setZoom, reset, getCroppedImg };
}
