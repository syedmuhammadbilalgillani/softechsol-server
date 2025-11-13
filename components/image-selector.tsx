"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { ImageIcon, UploadCloud } from "lucide-react";
import logger from "@/utils/logger";

type Image = {
  id: string;
  url: string;
  altText: string;
};

type Props = {
  name: string;
};

export function ImageSelector({ name }: Props) {
  const { register, setValue, watch } = useFormContext();
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const galleryItems = await fetch("/api/gallery")
        .then((res) => res.json())
        .then((data) => data as Image[]);
      setImages(galleryItems);
    };
    fetchImages();
  }, [open]);

  useEffect(() => {
    const currentValue = watch(name);
    setSelectedImageId(currentValue || null);
  }, [watch, name]);

  const handleSelect = (id: string) => {
    setSelectedImageId(id);
    const img = images.find((i) => i.id === id) || null;
    setSelectedImage(img);
    logger.info(`Selected image ID: ${id}`);
    setValue(name, id);
    setOpen(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Image</label>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div
            className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition hover:bg-gray-50 ${
              selectedImage
                ? "border-blue-400"
                : "border-gray-300 hover:border-blue-400"
            }`}
          >
            {selectedImage ? (
              <div className="relative group w-full max-w-xs">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.altText}
                  className="w-full h-48 object-cover rounded-xl shadow-sm"
                />
                <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <p className="text-white text-sm">Change Image</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-500">
                <UploadCloud className="w-10 h-10 text-gray-400" />
                <p className="text-sm">Click or drag to select an image</p>
              </div>
            )}
          </div>
        </DialogTrigger>

        <DialogContent className="w-full max-w-4xl mx-auto p-6">
          <DialogHeader>
            <DialogTitle>Select an Image</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-4">
            {images.map((image) => (
              <DialogClose asChild key={image.id}>
                <div
                  onClick={() => handleSelect(image.id)}
                  className={`border-2 p-1 rounded-lg cursor-pointer overflow-hidden transition ${
                    selectedImageId === image.id
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
                </div>
              </DialogClose>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <input type="hidden" {...register(name)} />

      {selectedImageId && (
        <p className="text-xs text-gray-500 mt-2">
          Selected Image ID: {selectedImageId}
        </p>
      )}
    </div>
  );
}
