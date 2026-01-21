import { prisma } from "@/lib/prisma";

export async function getGallery() {
  return await prisma.gallery.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}
