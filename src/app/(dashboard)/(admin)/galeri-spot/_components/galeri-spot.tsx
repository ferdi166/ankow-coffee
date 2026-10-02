import PageTitle from "@/components/common/page-title";

export default function GaleriSpot() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6">
      <header className="flex flex-col gap-4 pb-5 md:flex-row md:items-end md:justify-between">
        <PageTitle
          title="Manajemen Galeri Spot"
          description="Kelola foto, deskripsi, dan fasilitas area kafe yang tampil di landing page utama."
        />
        <div className="flex items-center gap-3 shrink-0">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C88A58] hover:bg-[#b97d4b] text-white text-xs font-semibold transition-all shadow-sm active:scale-[0.99]">
            <span>+ Tambah Spot Baru</span>
          </button>
        </div>
      </header>
    </div>
  );
}
