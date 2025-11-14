"use client";

import { useEffect, useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { UploadCloud } from "lucide-react";
import logger from "@/utils/logger";

type Image = {
  id: string;
  url: string;
  altText: string;
};

type Props = {
  name: string;
  multiple?: boolean;
};

export function ImageSelector({ name, multiple = false }: Props) {
  const { register, setValue, watch } = useFormContext();
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<Image[]>([]);

  // Single or multiple selected state
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);

  const fieldValue = watch(name);

  // Use refs to track if we're updating from form or from user action
  const isInternalUpdate = useRef(false);

  logger.info({ name, multiple, fieldValue }, "ImageSelector render");

  // Fetch images from API
  const fetchImages = async () => {
    logger.info("Fetching images from /api/gallery");
    try {
      const raw = await fetch("/api/gallery").then((res) => res.json());
      const galleryItems = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.images)
        ? raw.images
        : [];
      logger.info({ count: galleryItems.length }, "Fetched images");
      setImages(galleryItems);
    } catch (error) {
      logger.error({ error }, "Failed to fetch images");
      setImages([]);
    }
  };

  // Fetch images when component mounts (when dynamic form is shown)
  useEffect(() => {
    fetchImages();
  }, []);

  // Also fetch images when dialog opens (refresh)
  useEffect(() => {
    if (open) {
      fetchImages();
    }
  }, [open]);

  // Sync form value to local state (when form value changes externally)
  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      logger.info("Skipping form value sync (internal update)");
      return;
    }

    logger.info({ fieldValue, multiple }, "Syncing form value to local state");

    if (multiple) {
      const next = Array.isArray(fieldValue)
        ? fieldValue
        : typeof fieldValue === "string" && fieldValue
        ? [fieldValue]
        : [];
      setSelectedImageIds((prev) => {
        const arraysEqual = (a: string[], b: string[]) =>
          a.length === b.length &&
          a.every((value, index) => value === b[index]);

        if (arraysEqual(prev, next)) {
          logger.info("SelectedImageIds unchanged, skipping update");
          return prev;
        }
        logger.info(
          { prev, next },
          "Updating selectedImageIds from form value"
        );
        return next;
      });
    } else {
      const next = fieldValue || null;
      setSelectedImageId((prev) => {
        if (prev === next) {
          logger.info("SelectedImageId unchanged, skipping update");
          return prev;
        }
        logger.info({ prev, next }, "Updating selectedImageId from form value");
        return next;
      });
    }
  }, [fieldValue, multiple]);

  // Sync local state to form value (when user selects/deselects)
  useEffect(() => {
    if (!multiple) {
      if (selectedImageId === null) return;

      logger.info({ selectedImageId }, "Syncing selectedImageId to form");
      isInternalUpdate.current = true;
      setValue(name, selectedImageId, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [selectedImageId, multiple, name, setValue]);

  useEffect(() => {
    if (!multiple) return;

    logger.info({ selectedImageIds }, "Syncing selectedImageIds to form");
    isInternalUpdate.current = true;
    setValue(name, selectedImageIds, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [selectedImageIds, multiple, name, setValue]);

  const currentSelectedImages = multiple
    ? images.filter((img) => selectedImageIds.includes(img.id))
    : images.filter((img) => img.id === selectedImageId);

  logger.info(
    {
      currentSelectedCount: currentSelectedImages.length,
      selectedImageId,
      selectedImageIds,
      imagesCount: images.length,
    },
    "Current selection state"
  );

  const handleSelectSingle = (id: string) => {
    logger.info({ id }, "handleSelectSingle called");
    setSelectedImageId(id);
    const img = images.find((i) => i.id === id) || null;
    logger.info({ id, img: img ? img.altText : null }, "Selected single image");
    setOpen(false);
  };

  const handleToggleMultiple = (id: string) => {
    logger.info(
      { id, current: selectedImageIds },
      "handleToggleMultiple called"
    );
    setSelectedImageIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((x) => x !== id) : [...prev, id];
      logger.info(
        {
          id,
          action: exists ? "removed" : "added",
          prev,
          next,
        },
        "Toggled image selection"
      );
      // Don't call setValue here - it will be synced via useEffect
      return next;
    });
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {multiple ? "Images" : "Image"}
      </label>

      <Dialog
        open={open}
        onOpenChange={(newOpen) => {
          logger.info({ newOpen }, "Dialog open state changed");
          setOpen(newOpen);
        }}
      >
        <DialogTrigger asChild>
          <div
            className={`border-2 border-dashed rounded-2xl p-4 flex flex-col gap-3 items-center justify-center cursor-pointer transition hover:bg-gray-50 ${
              currentSelectedImages.length
                ? "border-blue-400"
                : "border-gray-300 hover:border-blue-400"
            }`}
          >
            {currentSelectedImages.length ? (
              <div className="flex flex-wrap gap-3 w-full justify-center">
                {currentSelectedImages.map((img) => (
                  <div
                    key={img.id}
                    className="relative w-28 h-24 rounded-lg overflow-hidden shadow-sm"
                  >
                    <img
                      src={img.url}
                      alt={img.altText}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-xs text-white">
                      Change
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-500">
                <UploadCloud className="w-10 h-10 text-gray-400" />
                <p className="text-sm">
                  Click to {multiple ? "select images" : "select an image"}
                </p>
              </div>
            )}
          </div>
        </DialogTrigger>

        <DialogContent className="w-full max-w-4xl mx-auto p-6">
          <DialogHeader>
            <DialogTitle>
              {multiple ? "Select Images" : "Select an Image"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2  gap-4 mt-4">
            {images.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">
                No images available
              </p>
            ) : (
              images.map((image) => {
                const isSelected = multiple
                  ? selectedImageIds.includes(image.id)
                  : selectedImageId === image.id;

                const onClick = () => {
                  logger.info(
                    { imageId: image.id, isSelected, multiple },
                    "Image clicked"
                  );
                  if (multiple) {
                    handleToggleMultiple(image.id);
                  } else {
                    handleSelectSingle(image.id);
                  }
                };

                return (
                  <button
                    type="button"
                    key={image.id}
                    onClick={onClick}
                    className={`border-2 p-1 rounded-lg cursor-pointer overflow-hidden transition ${
                      isSelected
                        ? "border-blue-500 ring-2 ring-blue-300"
                        : "border-gray-200 hover:border-blue-400"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.altText}
                      className="w-full h-28 object-cover rounded-md"
                    />
                    <p className="mt-1 text-center text-xs text-gray-500 truncate">
                      {image.altText}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden field to keep RHF in sync */}
      <input type="hidden" {...register(name)} />

      {multiple
        ? selectedImageIds.length > 0 && (
            <p className="text-xs text-gray-500 mt-2 text-wrap break-all">
              Selected Image IDs: {selectedImageIds.join(", ")}
            </p>
          )
        : selectedImageId && (
            <p className="text-xs text-gray-500 mt-2 text-wrap break-all">
              Selected Image ID: {selectedImageId}
            </p>
          )}
    </div>
  );
}
