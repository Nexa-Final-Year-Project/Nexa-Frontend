"use client";

import { ArrowLeftIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Cropper,
  CropperCropArea,
  CropperDescription,
  CropperImage,
} from "@/components/ui/cropper";

interface Props {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  zoom: number;
  setZoom: (z: number) => void;
  onCropChange: (area: any) => void;
  onApply: () => void;
}

export function ImageCropperDialog({
  open,
  onClose,
  imageUrl,
  zoom,
  setZoom,
  onCropChange,
  onApply,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="gap-0 p-0 sm:max-w-140">
        <DialogDescription className="sr-only">
          Crop image dialog
        </DialogDescription>
        <DialogHeader className="contents text-left">
          <DialogTitle className="flex items-center justify-between border-b p-4 text-base">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <ArrowLeftIcon />
              </Button>
              <span>Crop image</span>
            </div>
            <Button onClick={onApply} disabled={!imageUrl}>
              Apply
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Cropper
          className="h-96 sm:h-120"
          image={imageUrl}
          zoom={zoom}
          onCropChange={onCropChange}
          onZoomChange={setZoom}
        >
          <CropperDescription />
          <CropperImage />
          <CropperCropArea />
        </Cropper>

        <DialogFooter className="border-t px-4 py-6">
          <div className="mx-auto flex w-full max-w-80 items-center gap-4">
            <ZoomOutIcon size={16} className="opacity-60" />
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(v) => setZoom(v[0])}
            />
            <ZoomInIcon size={16} className="opacity-60" />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
