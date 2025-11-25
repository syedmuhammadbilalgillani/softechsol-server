import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import logger from "@/utils/logger";
import { revalidateTag } from "@/lib/revalidate";

// CREATE Team Member
export async function POST(req: Request) {
  try {
    const { title, position, linkedinUrl, featured_image_id } =
      await req.json();

    const team = await prisma.team.create({
      data: { title, position, linkedinUrl, featured_image_id },
    });
    await revalidateTag("teams");

    return NextResponse.json(team);
  } catch (error) {
    logger.debug(error);
    return NextResponse.json(
      { error: "Failed to create team member" },
      { status: 500 }
    );
  }
}

// UPDATE Team Member
export async function PUT(req: Request) {
  try {
    const { id, title, position, linkedinUrl, featured_image_id } =
      await req.json();

    const team = await prisma.team.update({
      where: { id },
      data: { title, position, linkedinUrl, featured_image_id },
    });

    await revalidateTag("teams");

    return NextResponse.json(team);
  } catch (error) {
    logger.debug(error);
    return NextResponse.json(
      { error: "Failed to update team member" },
      { status: 500 }
    );
  }
}

// DELETE Team Member
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    await prisma.team.delete({
      where: { id: Number(id) },
    });

    await revalidateTag("teams");

    return NextResponse.json({ message: "Team member deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete team member" },
      { status: 500 }
    );
  }
}
