"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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

type GalleryFormProps =
  | { mode: "create" }
  | {
      mode: "update";
      initialData: {
        id: string;
        altText: string;
        description?: string | null;
      };
    };

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

  {
    name: "description",
    type: "textarea",
    label: "Description",
    required: false,
  },
];

export function GalleryForm(props: GalleryFormProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const defaultValues =
    props.mode === "update"
      ? {
          altText: props.initialData.altText,
          description: props.initialData.description ?? "",
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
          if (values.description) {
            formData.append("description", values.description);
          }

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
              description: values.description,
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
      } catch (error: any) {
        toast.error(error.message ?? "Something went wrong");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          {props.mode === "create" ? (
            <PlusIcon className="w-4 h-4" />
          ) : (
            <PencilIcon className="w-4 h-4" />
          )}
          {props.mode === "create" ? "Add" : ""}
        </Button>
      </DialogTrigger>
      <DialogContent>
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
        <DynamicForm
          fields={galleryFields}
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          isUpdateMode={props.mode === "update"}
          parentClassName="grid gap-4"
          formId="gallery-form"
          submitButton={
            <Button type="submit" disabled={pending} form="gallery-form">
              {pending
                ? "Saving…"
                : props.mode === "create"
                ? "Create"
                : "Update"}
            </Button>
          }
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
