"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DynamicForm } from "@/components/dynamic-form"; // adjust path if needed
import { Button } from "@/components/ui/button";
import type { FieldConfig } from "@/components/dynamic-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { PencilIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

export interface TeamMemberFormValues {
  title: string;
  position: string;
  linkedinUrl?: string;
  featured_image_id?: string;
}

export interface TeamMemberInitialData extends TeamMemberFormValues {
  id: string;
}

interface TeamMemberFormProps {
  initialData?: TeamMemberInitialData | null;
  onSuccess?: (data: any) => void;
}

export const TeamMemberForm: React.FC<TeamMemberFormProps> = ({
  initialData,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const isUpdateMode = !!initialData?.id;

  const defaultValues: TeamMemberFormValues = {
    title: initialData?.title ?? "",
    position: initialData?.position ?? "",
    linkedinUrl: initialData?.linkedinUrl ?? "",
    featured_image_id: initialData?.featured_image_id ?? "",
  };

  const fields: FieldConfig[] = [
    {
      name: "title",
      label: "Name / Title",
      type: "input",
      required: true,
      placeholder: "Enter team member name",
      className: "col-span-full",
    },
    {
      name: "position",
      label: "Position",
      type: "input",
      required: true,
      placeholder: "Enter position (e.g. CEO, Developer)",
      className: "col-span-full",
    },
    {
      name: "linkedinUrl",
      label: "LinkedIn URL",
      type: "input",
      placeholder: "https://linkedin.com/in/username",
      className: "col-span-full",
    },
    {
      name: "featured_image_id",
      label: "Profile Image",
      type: "media",
      multiple: false, // single image
      className: "col-span-full",
    },
  ];

  const handleSubmit = async (values: TeamMemberFormValues) => {
    try {
      const url = "/api/teams";
      const method = isUpdateMode ? "PUT" : "POST";

      const payload = isUpdateMode
        ? { id: initialData?.id, ...values }
        : { ...values };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data?.error || "Failed to save team member");
        return;
      }

      onSuccess?.(data);
      router.refresh();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to save team member");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} size={"sm"}>
          {isUpdateMode ? (
            <PencilIcon className="w-4 h-4" />
          ) : (
            <PlusIcon className="w-4 h-4" />
          )}
          {isUpdateMode ? "" : "Add"}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle>
            {isUpdateMode ? "Update Team Member" : "Create Team Member"}
          </DialogTitle>
          <DialogDescription>
            {isUpdateMode
              ? "Update the team member details"
              : "Create a new team member"}
          </DialogDescription>
        </DialogHeader>
        <DynamicForm
          fields={fields}
          onSubmit={handleSubmit}
          formId="team-member-form"
          defaultValues={defaultValues}
          isUpdateMode={isUpdateMode}
          submitButton={
            <Button
              type="submit"
              className="col-span-2 mt-2"
              form="team-member-form"
            >
              {isUpdateMode ? "Update Team Member" : "Create Team Member"}
            </Button>
          }
        />
      </DialogContent>
    </Dialog>
  );
};
