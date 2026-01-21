import { prisma } from "@/lib/prisma";

/* ================= FETCH DETAIL ================= */
async function getNewsDetail(slug: string) {
  return prisma.news.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: {
          order: "asc",
        },
      },
      button: true,
    },
  });
}

export default async function NewsDetail({
  params,
}: {
  params: { slug: string };
}) {
  const news = await getNewsDetail(params.slug);

  if (!news) {
    return <p className="p-10">News tidak ditemukan</p>;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">{news.title}</h1>

      {news.excerpt && (
        <p className="text-gray-500 italic">{news.excerpt}</p>
      )}

      {/* IMAGES */}
      {news.images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {news.images.map((img) => (
            <img
              key={img.id}
              src={img.image}
              className="rounded"
              alt=""
            />
          ))}
        </div>
      )}

      <article className="whitespace-pre-line leading-relaxed">
        {news.content}
      </article>

      {/* OPTIONAL BUTTON */}
      {news.button && (
        <a
          href={news.button.url}
          target="_blank"
          className="inline-block mt-6 bg-black text-white px-6 py-2 rounded"
        >
          {news.button.label}
        </a>
      )}
    </main>
  );
}
