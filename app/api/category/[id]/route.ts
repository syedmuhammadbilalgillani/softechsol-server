import { deleteCategory } from "@/actions/category";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const res = await deleteCategory(parseInt(id));
  if (res) {
    return NextResponse.json({ message: "Category deleted successfully" }, { status: 200 });
  } else {
    return NextResponse.json({ message: "Failed to delete category" }, { status: 500 });
  }
}
