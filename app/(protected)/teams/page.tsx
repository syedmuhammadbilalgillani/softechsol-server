import { TeamMemberForm } from "@/components/forms/teams-form";
import { PageHeader } from "@/components/page-header";
import prisma from "@/lib/prisma";
import React from "react";
import TeamComponent from "./team-component";
import logger from "@/utils/logger";
export const dynamic = "force-dynamic";
const TeamsPage = async () => {
  const teams = await prisma.team.findMany({
    include: {
      featured_image: true,
    },
  });
  logger.info(teams);
  return (
    <main className="p-5">
      <div className="flex justify-between items-center">
        <PageHeader heading="Teams" paragraph="Manage your team members here" />{" "}
        <TeamMemberForm />
      </div>
      <TeamComponent teams={teams} />
    </main>
  );
};

export default TeamsPage;
