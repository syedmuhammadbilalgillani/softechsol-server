import { ProjectForm } from "@/components/forms/project-form";
import { PageHeader } from "@/components/page-header";
import prisma from "@/lib/prisma";
import logger from "@/utils/logger";
import ProjectPageComponent from "./project-page-component";



export const dynamic = "force-dynamic";
export const revalidate = 100

const ProjectsPage = async () => {
  const projects = await prisma.project.findMany({
    include: {
      image: true, // single image relation
    },
  });

  logger.info(projects, "projects");
  const data = projects.map((project) => ({
    id: project.project_id,
    project_id: project.project_id,
    title: project.title,
    description: project.description,
    url: project.url,
    status: project.status,
    technologies: project.technologies,
    image_id: project.image_id,
    image: project.image,
    created_at: project.created_at,
    updated_at: project.updated_at,
  }));

  logger.info(data, "data");

  return (
    <div className="p-5">
      <div className="flex justify-between items-center gap-5">
        <PageHeader heading="Projects" paragraph="Manage your projects" />
        <ProjectForm />
      </div>
      <div className="mt-4">
        <ProjectPageComponent data={data} />
      </div>
    </div>
  );
};

export default ProjectsPage;
