"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect, useRef } from "react";
import { toast } from "sonner";
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
import { useFormContext, FormProvider, useForm } from "react-hook-form";
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
        url: string;
      };
    }
);

// Custom file input with preview component
function FileInputWithPreview({ 
  name, 
  label, 
  existingImageUrl,
  required = false
}: { 
  name: string; 
  label: string;
  existingImageUrl?: string;
  required?: boolean;
}) {
  const { setValue, watch, formState: { errors }, setError, clearErrors } = useFormContext();
  const file = watch(name);
  const [preview, setPreview] = useState<string | null>(existingImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  useEffect(() => {
    if (file) {
      const fileObj = file instanceof FileList 
        ? file[0] 
        : Array.isArray(file) 
        ? file[0] 
        : file instanceof File 
        ? file 
        : null;
      
      if (fileObj instanceof File) {
        const url = URL.createObjectURL(fileObj);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
      }
    } else if (existingImageUrl) {
      setPreview(existingImageUrl);
    } else {
      setPreview(null);
    }
  }, [file, existingImageUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile instanceof File) {
      // Store the File object directly
      setValue(name, selectedFile, { 
        shouldValidate: true,
        shouldDirty: true,
      });
      // Clear any previous errors
      clearErrors(name);
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
    } else {
      setValue(name, null, { shouldValidate: true });
      setPreview(existingImageUrl || null);
      // Set error if required
      if (required) {
        setError(name, {
          type: "required",
          message: `${label} is required`,
        });
      }
    }
  };

  const error = errors[name]?.message as string;

  return (
    <div className="space-y-2">
      <Label className="block font-medium text-sm mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
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
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
            required={required}
          />
        </label>
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>
    </div>
  );
}

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
      type="submit"
      disabled={pending} 
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
          file: null,
        }
      : {
          altText: "",
          file: null,
        };

  // Create form methods at the parent level with validation rules
  const methods = useForm({
    defaultValues,
    mode: "onChange", // Validate on change for better UX
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      const newDefaults = props.mode === "update"
        ? {
            altText: props.initialData.altText,
            file: null,
          }
        : {
            altText: "",
            file: null,
          };
      methods.reset(newDefaults);
    }
  }, [open, props.mode]);

  const handleSubmit = async (values: Record<string, any>) => {
    // Validate file in create mode before submitting
    if (props.mode === "create") {
      const file = values.file instanceof File ? values.file : null;
      if (!file) {
        methods.setError("file", {
          type: "required",
          message: "Image is required",
        });
        toast.error("Please select an image file");
        return;
      }
    }

    startTransition(async () => {
      try {
        let response: Response;

        // Get file - it should be a File object directly
        const file = values.file instanceof File ? values.file : null;

        // In create mode, file is required
        if (props.mode === "create") {
          if (!file) {
            toast.error("Please select an image file");
            return;
          }

          const formData = new FormData();
          formData.append("file", file);
          formData.append("altText", values.altText || "");

          response = await fetch("/api/gallery", {
            method: "POST",
            body: formData,
          });
        } else {
          // Update mode
          if (file) {
            // New file provided
            const formData = new FormData();
            formData.append("file", file);
            formData.append("altText", values.altText || "");

            response = await fetch(`/api/gallery/${props.initialData.id}`, {
              method: "PUT",
              body: formData,
            });
          } else {
            // Only update alt text
            response = await fetch(`/api/gallery/${props.initialData.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                altText: values.altText || "",
              }),
            });
          }
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
        methods.reset();
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
        {/* Wrap everything in FormProvider */}
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(handleSubmit)}
            className="grid gap-4"
          >
            {/* Custom file input with preview */}
            <FileInputWithPreview
              name="file"
              label="Image"
              existingImageUrl={props.mode === "update" ? props.initialData.url : undefined}
              required={props.mode === "create"}
            />
            
            {/* Alt text field */}
            <div className="space-y-2">
              <Label className="block font-medium text-sm mb-1">
                Alt Text <span className="text-red-500">*</span>
              </Label>
              <Input
                {...methods.register("altText", {
                  required: "Alt text is required",
                })}
                placeholder="Alt text"
              />
              {methods.formState.errors.altText && (
                <p className="text-red-500 text-sm mt-1">
                  {methods.formState.errors.altText.message as string}
                </p>
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <GalleryFormSubmitButton 
                onSubmit={handleSubmit}
                pending={pending}
                mode={props.mode}
              />
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
