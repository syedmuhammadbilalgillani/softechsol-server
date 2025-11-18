"use client";
import DataTable from "@/components/data-table";
import React from "react";
import { Team } from "@/app/generated/prisma/client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { TeamMemberForm } from "@/components/forms/teams-form";

const TeamComponent = ({ teams }: { teams: Team[] }) => {
  const router = useRouter();
  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`/api/teams`, { data: { id } });
      if (res.status === 200) {
        toast.success("Team deleted successfully");
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to delete team");
    }
  };
  return (
    <DataTable
      loading={false}
      columns={[
        { label: "Title", key: "title" },
        { label: "Position", key: "position" },
        { label: "LinkedIn URL", key: "linkedinUrl" },
        {
          label: "Featured Image",
          key: "featured_image.url",
          render: (row: any) => (
            <Image
              src={row.featured_image.url}
              alt={row.title}
              width={100}
              height={100}
              className="w-14 h-14 object-cover rounded-full"
            />
          ),
        },
        {
          label: "Actions",
          key: "actions",
          render: (row: any) => (
            <div className="flex gap-2 items-center">
              <Button
                variant={"destructive"}
                onClick={() => handleDelete(row.id)}
              >
                <Trash2Icon className="w-4 h-4" />
              </Button>
              <TeamMemberForm
                initialData={row}
                onSuccess={() => router.refresh()}
              />
            </div>
          ),
        },
      ]}
      data={teams}
    />
  );
};

export default TeamComponent;
