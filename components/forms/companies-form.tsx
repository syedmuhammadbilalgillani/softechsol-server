"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { DynamicForm, FieldConfig } from "../dynamic-form";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const CompaniesForm = ({ className }: { className?: string }) => {
  const [open, setopen] = useState(false);
  const [loading, setloading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (data: any) => {
    try {
      setloading(true);
      const res = await axios.post("/api/companies", data);
      setloading(false);
      if (res.status === 200) {
        toast.success("Company created successfully");
        router.refresh();
        setopen(false);
      } else {
        toast.error("Failed to create company");
      }
    } catch (error) {
      toast.error("Failed to create company");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setopen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={cn(className, "")}>
          Add <Plus />{" "}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Company</DialogTitle>
        </DialogHeader>
        <DynamicForm
          fields={
            [
              {
                label: "Company Logo",
                name: "featured_image_id",
                type: "media",
              },
            ] as FieldConfig[]
          }
          formId="company"
          onSubmit={handleSubmit}
          submitButton={
            <Button form="company" type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Create Company"
              )}
            </Button>
          }
        />
      </DialogContent>
    </Dialog>
  );
};

export default CompaniesForm;
