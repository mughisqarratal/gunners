import PersonelCard from "./components/PersonelCard";
import { prisma } from "@/lib/prisma";

/* ================= FETCH BIOGRAPHIES (SERVER) ================= */
async function getPersonels() {
  return prisma.biography.findMany({
    orderBy: { createdAt: "asc" },
  });
}

export default async function BiographiesPage() {
  const personels = await getPersonels();

  return (
    <div className="container mx-auto px-3 sm:px-4 py-8">
      {/* BIOGRAPHIES */}
      <section className="text-center mb-10 sm:mb-15">
        <h1 className="text-3xl font-bold mb-6">BIOGRAPHIES</h1>

        <img
          src="/images/gnr.png"
          alt="Guns N Roses"
          className="mx-auto w-48 mb-6"
        />

        <p className=" w-auto mx-auto text-gray-700 sm:text-2xl text-center sm:w-260">
          Guns N’ Roses adalah band hard rock asal Los Angeles, Amerika Serikat,
          yang terbentuk pada tahun 1985. Band ini menjadi terkenal melalui
          album debut <a className="italic">Appetite for Destruction</a> pada
          tahun 1987, yang sukses besar dan melahirkan lagu-lagu ikonik seperti{" "}
          <a className="italic">Sweet Child O’ Mine</a> dan{" "}
          <a className="italic"> Welcome to the Jungle</a>. Gaya musik yang
          keras dan penuh energi membuat mereka cepat dikenal di seluruh dunia.
          Pada awal 1990-an, Guns N’ Roses semakin mengukuhkan popularitasnya
          lewat album <a className="italic">Use Your Illusion I</a> dan{" "}
          <a className="italic">Use Your Illusion II</a>. Meski sempat mengalami
          konflik internal dan perubahan anggota, band ini tetap bertahan dan
          kembali bersatu dalam reuni pada tahun 2016. Hingga kini, Guns N’
          Roses tetap dikenang sebagai salah satu band rock paling legendaris
          dan berpengaruh sepanjang masa.
        </p>
      </section>

      {/* PERSONELS */}
      <section>
        <h2 className="text-2xl font-bold text-center mb-10">PERSONELS</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {personels.map((p) => (
            <PersonelCard key={p.id} personel={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
