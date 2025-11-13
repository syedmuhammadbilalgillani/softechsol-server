import prisma from "@/lib/prisma";
import logger from "@/utils/logger";

export const deleteCategory = async (category_id: number) => {
  try {
    const res = await prisma.blogCategory.delete({
      where: {
        category_id: category_id,
      },
    });
    return res;
  } catch (error) {
    logger.error(error);
    return null;
  }
};
