"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { DynamicForm, FieldConfig } from "@/components/dynamic-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "../ui/dialog";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadIcon } from "lucide-react";

type GalleryFormProps = {
  onSuccess?: () => void;
} & (
  | { mode: "create" }
  | {
      mode: "update";
      initialData: {
        id: string;
        altText: string;
        url: string; // Add URL to initialData
      };
    }
);

// Custom file input with preview component
function FileInputWithPreview({ 
  name, 
  label, 
  existingImageUrl 
}: { 
  name: string; 
  label: string;
  existingImageUrl?: string;
}) {
  const { register, setValue, watch } = useFormContext();
  const file = watch(name) as File | File[] | undefined;
  const [preview, setPreview] = useState<string | null>(existingImageUrl || null);

  // Handle file selection
  useEffect(() => {
    if (file) {
      const fileObj = Array.isArray(file) ? file[0] : file;
      if (fileObj instanceof File) {
        const url = URL.createObjectURL(fileObj);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
      }
    } else if (existingImageUrl) {
      setPreview(existingImageUrl);
    }
  }, [file, existingImageUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected instanceof File) {
      setValue(name, selected, { shouldValidate: true });
      const url = URL.createObjectURL(selected);
      setPreview(url);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="block font-medium text-sm mb-1">
        {label}
      </Label>
      <div className="flex flex-col gap-4">
        {/* Preview */}
        {preview && (
          <div className="w-full max-w-xs">
            <div className="relative aspect-video rounded-lg border border-gray-200 overflow-hidden bg-gray-100">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            {existingImageUrl && preview === existingImageUrl && (
              <p className="text-xs text-gray-500 mt-1">Current image</p>
            )}
          </div>
        )}
        {/* File input */}
        <label className="flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 bg-white hover:bg-gray-50 cursor-pointer transition-colors">
          <UploadIcon className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">
            {preview ? "Change Image" : "Select Image"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            {...register(name)}
            onChange={handleChange}
          />
        </label>
      </div>
    </div>
  );
}

const galleryFields: FieldConfig[] = [
  {
    name: "file",
    type: "input",
    InputType: "file",
    label: "Image",
    required: true,
  },
  {
    name: "altText",
    type: "input",
    label: "Alt Text",
    required: true,
  },
];

// Submit button component that uses form context
function GalleryFormSubmitButton({ 
  onSubmit, 
  pending,
  mode 
}: { 
  onSubmit: (data: any) => void;
  pending: boolean;
  mode: "create" | "update";
}) {
  const { handleSubmit } = useFormContext();
  
  return (
    <Button 
      type="button" 
      disabled={pending} 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit(onSubmit)(e);
      }}
    >
      {pending
        ? "Saving…"
        : mode === "create"
        ? "Create"
        : "Update"}
    </Button>
  );
}

export function GalleryForm(props: GalleryFormProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const defaultValues =
    props.mode === "update"
      ? {
          altText: props.initialData.altText,
        }
      : {};

  const handleSubmit = async (values: Record<string, any>) => {
    startTransition(async () => {
      try {
        let response: Response;

        if (props.mode === "create" || values.file?.[0]) {
          const formData = new FormData();
          if (values.file?.[0]) {
            formData.append("file", values.file[0]);
          }
          formData.append("altText", values.altText);

          response = await fetch(
            props.mode === "create"
              ? "/api/gallery"
              : `/api/gallery/${props.initialData.id}`,
            {
              method: props.mode === "create" ? "POST" : "PUT",
              body: formData,
            }
          );
        } else {
          response = await fetch(`/api/gallery/${props.initialData.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              altText: values.altText,
            }),
          });
        }

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message ?? "Request failed");
        }

        toast.success(
          props.mode === "create"
            ? "Image added to gallery"
            : "Gallery item updated"
        );
        router.refresh();
        setOpen(false);
        props.onSuccess?.();
      } catch (error: any) {
        toast.error(error.message ?? "Something went wrong");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
        >
          {props.mode === "create" ? (
            <PlusIcon className="w-4 h-4" />
          ) : (
            <PencilIcon className="w-4 h-4" />
          )}
          {props.mode === "create" ? "Add" : ""}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {props.mode === "create" ? "Add Image" : "Edit Image"}
          </DialogTitle>
          <DialogDescription>
            {props.mode === "create"
              ? "Add a new image to the gallery"
              : "Edit the image details"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          {/* Custom file input with preview */}
          <FileInputWithPreview
            name="file"
            label="Image"
            existingImageUrl={props.mode === "update" ? props.initialData.url : undefined}
          />
          
          {/* Alt text field */}
          <DynamicForm
            fields={[
              {
                name: "altText",
                type: "input",
                label: "Alt Text",
                required: true,
              },
            ]}
            onSubmit={handleSubmit}
            defaultValues={defaultValues}
            isUpdateMode={props.mode === "update"}
            parentClassName="grid gap-4"
            formId="gallery-form"
            submitButton={
              <GalleryFormSubmitButton 
                onSubmit={handleSubmit}
                pending={pending}
                mode={props.mode}
              />
            }
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
