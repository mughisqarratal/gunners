export default function AdminBiographyPreview({ biography, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div
        className="
          bg-white rounded
          w-full max-w-sm
          max-h-[90vh]
          flex flex-col
        "
      >
        {/* ================= CONTENT (SCROLLABLE) ================= */}
        <div className="p-6 overflow-y-auto">
          {biography.image && (
            <img
              src={biography.image}
              className="w-40 h-40 object-cover mx-auto rounded"
            />
          )}

          <h2 className="text-xl font-bold text-center mt-4">
            {biography.name}
          </h2>

          <p className="text-center text-gray-500">
            {biography.role}
          </p>

          <p className="text-sm mt-4 text-left whitespace-pre-line">
            {biography.bio}
          </p>
        </div>

        {/* ================= FOOTER (STICKY) ================= */}
        <div className="p-4 border-t flex justify-center">
          <button
            onClick={onClose}
            className="
              bg-[#57564F]
              text-white
              py-1 px-6
              rounded
              cursor-pointer
              hover:bg-black
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
