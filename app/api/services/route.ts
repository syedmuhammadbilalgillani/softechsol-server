import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Prisma client instance

// POST - Create a new service
export async function POST(req: Request) {
  const data = await req.json();

  try {
    const service = await prisma.service.create({
      data: {
        title: data.title,
        slug: data.slug,
        short_description: data.short_description,
        description: data.description,
        icon: data.icon,
        price: data.price,
        price_type: data.price_type,
        currency: data.currency || "USD",
        price_note: data.price_note,
        features: data.features,
        deliverables: data.deliverables,
        technologies: data.technologies,
        process_steps: data.process_steps,
        duration: data.duration,
        ideal_for: data.ideal_for,
        status: data.status,
        is_featured: data.is_featured,
        is_popular: data.is_popular,
        display_order: data.display_order,
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        meta_keywords: data.meta_keywords,
        cta_text: data.cta_text,
        cta_url: data.cta_url,
        categories: {
          connect: data.categories?.map((categoryId: string) => ({
            id: categoryId,
          })),
        },
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating service" },
      { status: 500 }
    );
  }
}

// PUT - Update an existing service
export async function PUT(req: Request) {
  const { service_id, ...data } = await req.json();

  try {
    const service = await prisma.service.update({
      where: { service_id },
      data: {
        title: data.title,
        slug: data.slug,
        short_description: data.short_description,
        description: data.description,
        icon: data.icon,
        price: data.price,
        price_type: data.price_type,
        currency: data.currency || "USD",
        price_note: data.price_note,
        features: data.features,
        deliverables: data.deliverables,
        technologies: data.technologies,
        process_steps: data.process_steps,
        duration: data.duration,
        ideal_for: data.ideal_for,
        status: data.status,
        is_featured: data.is_featured,
        is_popular: data.is_popular,
        display_order: data.display_order,
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        meta_keywords: data.meta_keywords,
        cta_text: data.cta_text,
        cta_url: data.cta_url,
        categories: {
          connect: data.categories?.map((categoryId: string) => ({
            id: categoryId,
          })),
        },
      },
    });

    return NextResponse.json(service, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating service" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a service
export async function DELETE(req: Request) {
  const { service_id } = await req.json();

  try {
    const service = await prisma.service.delete({
      where: { service_id },
    });

    return NextResponse.json(
      { message: "Service deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting service" },
      { status: 500 }
    );
  }
}
