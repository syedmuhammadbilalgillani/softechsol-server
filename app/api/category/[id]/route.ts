import { deleteCategory } from "@/actions/category";
import logger from "@/utils/logger";
import { NextResponse } from "next/server";
import { revalidateTag } from "@/lib/revalidate";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const res = await deleteCategory(parseInt(id));
  
  // Revalidate categories cache
  await revalidateTag("categories");

  if (res) {
    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { message: "Failed to delete category" },
      { status: 500 }
    );
  }
}
