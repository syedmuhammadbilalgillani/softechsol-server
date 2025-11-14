import DataTable, { Column } from "@/components/data-table";
import { ProjectForm } from "@/components/forms/project-form";
import React from "react";

const ProjectPageComponent = ({ data }: { data: any }) => {
  const columns: Column<(typeof data)[number]>[] = [
    {
      label: "Title",
      key: "title",
    },
    {
      label: "Short Description",
      key: "short_description",
    },
    {
      label: "URL",
      key: "url",
    },
    {
      label: "Client Name",
      key: "client_name",
    },
    {
      label: "Year",
      key: "year",
    },
    {
      label: "Timeline",
      key: "timeline",
    },
    {
      label: "Overview",
      key: "overview",
    },
    {
      label: "Challenges",
      key: "challenges",
    },
    {
      label: "Solution",
      key: "solution",
    },
    // {
    //   label: "Images",
    //   key: "images",
    // },
    // {
    //   label: "Created At",
    //   key: "created_at",
    // },
    // {
    //   label: "Updated At",
    //   key: "updated_at",
    // },
    {
      label: "Actions",
      key: "actions",
      render: (row) => <ProjectForm  project={row} />,
    },
  ];
  return (
    <>
      <DataTable
        data={data}
        columns={columns as Column<(typeof data)[number]>[]}
        loading={false}
      />
    </>
  );
};

export default ProjectPageComponent;
