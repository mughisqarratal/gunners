import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

/* ================= FETCH NEWS ================= */
async function getNews() {
  return prisma.news.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      createdAt: true,
      images: {
        select: {
          image: true,
        },
        take: 1, // hanya 1 thumbnail
      },
    },
  });
}

export default async function NewsPage() {
  const news = await getNews();

  return (
    <main className="max-w-5xl mx-auto px-4">
      <h1 className="text-3xl font-bold mt-3 text-center">NEWS</h1>

      {/* ✅ LIST WRAPPER (INI KUNCINYA) */}
      <ul className="flex flex-col gap-6 py-6">
        {news.map((n) => {
          const thumbnail = n.images?.[0]?.image;

          return (
            <li key={n.id}>
              <Link
                href={`/news/${n.slug}`}
                className="
                  block
                  bg-white rounded shadow
                  hover:bg-gray-50 transition
                "
              >
                <article
                  className="
                    flex flex-col sm:flex-row
                    gap-4 p-4
                  "
                >
                  {/* THUMBNAIL */}
                  {thumbnail && (
                    <div className="relative w-full sm:w-48 h-48 sm:h-32 shrink-0 overflow-hidden rounded">
                      <Image
                        src={thumbnail}
                        alt={n.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 192px"
                      />
                    </div>
                  )}

                  {/* CONTENT */}
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <h2 className="text-xl font-semibold">{n.title}</h2>

                      {n.excerpt && (
                        <p className="text-gray-600 mt-2 line-clamp-3">
                          {n.excerpt}
                        </p>
                      )}
                    </div>

                    <p className="text-sm text-gray-400 mt-3">
                      {new Date(n.createdAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </article>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
