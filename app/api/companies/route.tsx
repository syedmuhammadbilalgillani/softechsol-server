import prisma from "@/lib/prisma";
import logger from "@/utils/logger";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { featured_image_id } = await request.json();
    logger.debug(featured_image_id, "featured_image_id");
    const company = await prisma.myCompanies.create({
        data: {
          featured_image: { connect: { id: featured_image_id as string } },
        },
      });
    return NextResponse.json(company);
  } catch (error) {
    logger.error(error, "Error creating company");
    return NextResponse.json(
      { error: "Failed to create company" },
      { status: 500 }
    );
  }
}
export async function DELETE(request: Request) {
  try {
    const { company_id } = await request.json();
    logger.debug(company_id, "company_id");
    const company = await prisma.myCompanies.delete({
      where: { company_id: Number(company_id) },
    });
    return NextResponse.json(company);
  } catch (error) {
    logger.error(error, "Error deleting company");
    return NextResponse.json(
      { error: "Failed to delete company" },
      { status: 500 }
    );
  }
}
