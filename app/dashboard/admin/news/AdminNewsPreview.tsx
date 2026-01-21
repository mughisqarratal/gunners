export default function AdminNewsPreview({ news, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* HEADER */}
        <div>
          <h2 className="text-2xl font-bold">{news.title}</h2>

          {news.excerpt && (
            <p className="text-sm text-gray-500 mt-1">
              {news.excerpt}
            </p>
          )}
        </div>

        {/* IMAGES */}
        {news.images?.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            {news.images.map((img: any) => (
              <img
                key={img.id}
                src={img.image}
                className="rounded"
                alt=""
              />
            ))}
          </div>
        )}

        {/* CONTENT */}
        <p className="mt-6 whitespace-pre-line leading-relaxed">
          {news.content}
        </p>

        {/* CTA SECTION */}
        {news.button && (
          <div className="mt-8">
            <a
              href={news.button.url}
              target="_blank"
              className="inline-block bg-black text-white px-5 py-2 rounded"
            >
              {news.button.label}
            </a>
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-10 pt-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="border px-4 py-1 rounded cursor-pointer bg-[#57564F] text-white hover:bg-black"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
