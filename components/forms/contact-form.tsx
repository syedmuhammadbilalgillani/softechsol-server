"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog"; // make sure you have a dialog component in your UI kit
import { DynamicForm, FieldConfig } from "@/components/dynamic-form"; // adjust path if needed
import { Button } from "@/components/ui/button";

export interface ContactUsFormValues {
  name: string;
  email: string;
  phone: string;
  service_id?: number;
  notes?: string;
}

interface ServiceOption {
  id: number;
  name: string;
}

interface ContactUsFormProps {
  services: ServiceOption[];
  onSuccess?: (data: any) => void;
}

export const ContactUsForm: React.FC<ContactUsFormProps> = ({
  services,
  onSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(false); // open state for the dialog

  const fields: FieldConfig[] = [
    {
      name: "name",
      label: "Name",
      type: "input",
      required: true,
      placeholder: "Enter your name",
      className: "col-span-2",
    },
    {
      name: "email",
      label: "Email",
      type: "input",
      required: true,
      placeholder: "Enter your email",
      className: "col-span-2",
    },
    {
      name: "phone",
      label: "Phone",
      type: "input",
      required: true,
      placeholder: "Enter your phone number",
      className: "col-span-2",
    },
    {
      name: "service_id",
      label: "Service",
      type: "select",
      options: services.map((service) => ({
        label: service.name,
        value: service.id.toString(),
      })),
      placeholder: "Select a service",
      className: "col-span-2",
    },
    {
      name: "notes",
      label: "Notes",
      type: "textarea",
      placeholder: "Any additional notes",
      className: "col-span-2",
    },
  ];

  const handleSubmit = async (values: ContactUsFormValues) => {
    try {
      const res = await fetch("/api/contact-us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data?.error || "Failed to create contact submission");
        return;
      }

      onSuccess?.(data);
      setIsOpen(false); // Close the dialog on success
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  return (
    <>
      {/* Button to open dialog */}
      <Button onClick={() => setIsOpen(true)} className="mt-4">
        Contact Us
      </Button>

      {/* Dialog (Modal) */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <h2 className="text-2xl font-bold">Contact Us</h2>
          <DynamicForm
            fields={fields}
            onSubmit={handleSubmit}
            parentClassName="grid grid-cols-2 gap-4"
            submitButton={
              <Button type="submit" className="col-span-2 mt-2">
                Submit Contact Us Form
              </Button>
            }
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
