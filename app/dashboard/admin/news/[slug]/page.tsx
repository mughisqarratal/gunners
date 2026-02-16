export default async function NewsDetail({
  params,
}: {
  params: Promise<{ slug: string }>; // Ubah params menjadi Promise
}) {
  // Tunggu (await) params sebelum digunakan
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/news/slug/${slug}`, // Gunakan slug yang sudah di-await
    { cache: "no-store" }
  );

  const news = await res.json();

  return (
    <main className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold">{news.title}</h1>

      {news.images.map((img: any) => (
        <img key={img.id} src={img.image} className="my-4 rounded" />
      ))}

      <p className="mt-6 whitespace-pre-line">{news.content}</p>

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