import DataTable, { Column } from "@/components/data-table";
import { ProjectForm } from "@/components/forms/project-form";
import { PageHeader } from "@/components/page-header";
import prisma from "@/lib/prisma";
import logger from "@/utils/logger";
import ProjectPageComponent from "./project-page-component";

const ProjectsPage = async () => {
  const projects = await prisma.project.findMany({
    include: {
      images: {
        include: {
          image: true, // pulls the related GalleryItem row
        },
        orderBy: { display_order: "asc" }, // optional, if you care about order
      },
    },
  });

  logger.info(projects, "projects");
  const data = projects.map((project) => ({
    id: project.project_id,
    title: project.title,
    short_description: project.short_description,
    url: project.url,
    client_name: project.client_name,
    year: project.year,
    timeline: project.timeline,
    overview: project.overview,
    challenges: project.challenges,
    solution: project.solution,
    images: project.images.map((image) => image.image_id),
    // created_at: project.created_at,
    // updated_at: project.updated_at,
  }));

  logger.info(data, "data");

  return (
    <main>
      <PageHeader heading="Projects" />
      <div className="flex flex-col gap-4">
        <ProjectForm />
      </div>
      <div>
        <ProjectPageComponent data={data} />
      </div>
    </main>
  );
};

export default ProjectsPage;
