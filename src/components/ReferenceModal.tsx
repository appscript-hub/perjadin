import React, { useState } from "react";
import { X, Settings, Plus, Trash2, ChevronLeft, ChevronRight, Save, Search } from "lucide-react";
import { SearchableSelect } from "./SearchableSelect";
import { showToast, confirmAlert } from "../lib/swal";
import {
  Provinsi,
  KabKota,
  JenisPerjalanan,
  SubKegiatan,
  Kodering,
  JenisBBM,
  JenisTransportasi,
} from "../types";

const formatRupiah = (val: number | string | null | undefined): string => {
  if (val === undefined || val === null || val === "" || isNaN(Number(val))) return "";
  const numStr = String(val).replace(/\D/g, "");
  if (!numStr) return "";
  return Number(numStr).toLocaleString("id-ID");
};

const parseRupiah = (val: string): string | number => {
  const clean = val.replace(/\D/g, "");
  return clean ? parseInt(clean, 10) : 0;
};

interface ReferenceModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  provinsiList: Provinsi[];
  setProvinsiList: React.Dispatch<React.SetStateAction<Provinsi[]>>;
  kabKotaList: KabKota[];
  setKabKotaList: React.Dispatch<React.SetStateAction<KabKota[]>>;
  jenisPerjalananList: JenisPerjalanan[];
  setJenisPerjalananList: React.Dispatch<React.SetStateAction<JenisPerjalanan[]>>;
  subKegiatanList: SubKegiatan[];
  setSubKegiatanList: React.Dispatch<React.SetStateAction<SubKegiatan[]>>;
  koderingList: Kodering[];
  setKoderingList: React.Dispatch<React.SetStateAction<Kodering[]>>;
  jenisBBMList: JenisBBM[];
  setJenisBBMList: React.Dispatch<React.SetStateAction<JenisBBM[]>>;
  jenisTransportasiList: JenisTransportasi[];
  setJenisTransportasiList: React.Dispatch<React.SetStateAction<JenisTransportasi[]>>;
  tahunList: string[];
  setTahunList: React.Dispatch<React.SetStateAction<string[]>>;
}

type TabType =
  | "provinsi"
  | "kabkota"
  | "jenisperjalanan"
  | "subkegiatan"
  | "kodering"
  | "jenisbbm"
  | "transportasi"
  | "tahun";

export function ReferenceModal({
  id,
  isOpen,
  onClose,
  provinsiList,
  setProvinsiList,
  kabKotaList,
  setKabKotaList,
  jenisPerjalananList,
  setJenisPerjalananList,
  subKegiatanList,
  setSubKegiatanList,
  koderingList,
  setKoderingList,
  jenisBBMList,
  setJenisBBMList,
  jenisTransportasiList,
  setJenisTransportasiList,
  tahunList,
  setTahunList,
}: ReferenceModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("provinsi");

  // Form states
  const [provinsiInput, setProvinsiInput] = useState("");
  const [kabKotaProvinceId, setKabKotaProvinceId] = useState("");
  const [kabKotaInput, setKabKotaInput] = useState("");
  const [jenisPerjalananInput, setJenisPerjalananInput] = useState("");
  const [subKegiatanKode, setSubKegiatanKode] = useState("");
  const [subKegiatanNama, setSubKegiatanNama] = useState("");
  const [koderingKode, setKoderingKode] = useState("");
  const [koderingNama, setKoderingNama] = useState("");
  const [bbmNama, setBbmNama] = useState("");
  const [bbmHarga, setBbmHarga] = useState(0);
  const [transportasiInput, setTransportasiInput] = useState("");
  const [tahunInput, setTahunInput] = useState("");

  // Pagination & Filter Search
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  if (!isOpen) return null;

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Province Actions
  const handleSaveProvinsi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!provinsiInput.trim()) return;
    const namaProv = provinsiInput.trim();
    const newProv: Provinsi = {
      id: "prov-" + Date.now(),
      nama: namaProv,
    };
    setProvinsiList((prev) => [...prev, newProv]);
    setProvinsiInput("");
    showToast(`Provinsi "${namaProv}" berhasil disimpan!`, "success");
  };

  const handleDeleteProvinsi = async (idToDelete: string) => {
    const provName = provinsiList.find(p => p.id === idToDelete)?.nama || "";
    const isConfirmed = await confirmAlert(
      "Hapus Provinsi?",
      `Apakah Anda yakin ingin menghapus Provinsi "${provName}"? Kabupaten/Kota di dalamnya juga akan ikut terhapus.`
    );
    if (isConfirmed) {
      setProvinsiList((prev) => prev.filter((item) => item.id !== idToDelete));
      setKabKotaList((prev) => prev.filter((item) => item.provinsiId !== idToDelete));
      showToast("Provinsi berhasil dihapus", "info");
    }
  };

  // Regency/City Actions
  const handleSaveKabKota = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kabKotaProvinceId || !kabKotaInput.trim()) return;
    const namaKab = kabKotaInput.trim();
    const newKabKota: KabKota = {
      id: "kabkota-" + Date.now(),
      provinsiId: kabKotaProvinceId,
      nama: namaKab,
    };
    setKabKotaList((prev) => [...prev, newKabKota]);
    setKabKotaInput("");
    showToast(`Kab/Kota "${namaKab}" berhasil disimpan!`, "success");
  };

  const handleDeleteKabKota = async (idToDelete: string) => {
    const kabName = kabKotaList.find(k => k.id === idToDelete)?.nama || "";
    const isConfirmed = await confirmAlert(
      "Hapus Kabupaten/Kota?",
      `Apakah Anda yakin ingin menghapus "${kabName}"?`
    );
    if (isConfirmed) {
      setKabKotaList((prev) => prev.filter((item) => item.id !== idToDelete));
      showToast("Kabupaten/Kota berhasil dihapus", "info");
    }
  };

  // Travel Type Actions
  const handleSaveJenisPerjalanan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jenisPerjalananInput.trim()) return;
    const namaJP = jenisPerjalananInput.trim();
    const newJp: JenisPerjalanan = {
      id: "jp-" + Date.now(),
      nama: namaJP,
    };
    setJenisPerjalananList((prev) => [...prev, newJp]);
    setJenisPerjalananInput("");
    showToast(`Jenis Perjalanan "${namaJP}" berhasil disimpan!`, "success");
  };

  const handleDeleteJenisPerjalanan = async (idToDelete: string) => {
    const jpName = jenisPerjalananList.find(j => j.id === idToDelete)?.nama || "";
    const isConfirmed = await confirmAlert(
      "Hapus Jenis Perjalanan?",
      `Apakah Anda yakin ingin menghapus "${jpName}"?`
    );
    if (isConfirmed) {
      setJenisPerjalananList((prev) => prev.filter((item) => item.id !== idToDelete));
      showToast("Jenis Perjalanan berhasil dihapus", "info");
    }
  };

  // Sub Activity Actions
  const handleSaveSubKegiatan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subKegiatanKode.trim() || !subKegiatanNama.trim()) return;
    const newSub: SubKegiatan = {
      id: "sub-" + Date.now(),
      kode: subKegiatanKode.trim(),
      nama: subKegiatanNama.trim(),
    };
    setSubKegiatanList((prev) => [...prev, newSub]);
    setSubKegiatanKode("");
    setSubKegiatanNama("");
    showToast("Sub Kegiatan berhasil disimpan!", "success");
  };

  const handleDeleteSubKegiatan = async (idToDelete: string) => {
    const subName = subKegiatanList.find(s => s.id === idToDelete)?.nama || "";
    const isConfirmed = await confirmAlert(
      "Hapus Sub Kegiatan?",
      `Apakah Anda yakin ingin menghapus "${subName}"?`
    );
    if (isConfirmed) {
      setSubKegiatanList((prev) => prev.filter((item) => item.id !== idToDelete));
      showToast("Sub Kegiatan berhasil dihapus", "info");
    }
  };

  // Kodering Actions
  const handleSaveKodering = (e: React.FormEvent) => {
    e.preventDefault();
    if (!koderingKode.trim() || !koderingNama.trim()) return;
    const newKod: Kodering = {
      id: "kod-" + Date.now(),
      kode: koderingKode.trim(),
      nama: koderingNama.trim(),
    };
    setKoderingList((prev) => [...prev, newKod]);
    setKoderingKode("");
    setKoderingNama("");
    showToast("Kodering Belanja berhasil disimpan!", "success");
  };

  const handleDeleteKodering = async (idToDelete: string) => {
    const kodName = koderingList.find(k => k.id === idToDelete)?.nama || "";
    const isConfirmed = await confirmAlert(
      "Hapus Kodering?",
      `Apakah Anda yakin ingin menghapus "${kodName}"?`
    );
    if (isConfirmed) {
      setKoderingList((prev) => prev.filter((item) => item.id !== idToDelete));
      showToast("Kodering berhasil dihapus", "info");
    }
  };

  // Fuel Actions
  const handleSaveBBM = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bbmNama.trim()) return;
    const namaBBM = bbmNama.trim();
    const newBBM: JenisBBM = {
      id: "bbm-" + Date.now(),
      nama: namaBBM,
      hargaPerLiter: bbmHarga || 0,
    };
    setJenisBBMList((prev) => [...prev, newBBM]);
    setBbmNama("");
    setBbmHarga(0);
    showToast(`BBM "${namaBBM}" berhasil disimpan!`, "success");
  };

  const handleDeleteBBM = async (idToDelete: string) => {
    const bbmName = jenisBBMList.find(b => b.id === idToDelete)?.nama || "";
    const isConfirmed = await confirmAlert(
      "Hapus Bahan Bakar?",
      `Apakah Anda yakin ingin menghapus "${bbmName}"?`
    );
    if (isConfirmed) {
      setJenisBBMList((prev) => prev.filter((item) => item.id !== idToDelete));
      showToast("Jenis BBM berhasil dihapus", "info");
    }
  };

  // Transport Actions
  const handleSaveTransportasi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transportasiInput.trim()) return;
    const namaTr = transportasiInput.trim();
    const newTr: JenisTransportasi = {
      id: "tr-" + Date.now(),
      nama: namaTr,
    };
    setJenisTransportasiList((prev) => [...prev, newTr]);
    setTransportasiInput("");
    showToast(`Transportasi "${namaTr}" berhasil disimpan!`, "success");
  };

  const handleDeleteTransportasi = async (idToDelete: string) => {
    const trName = jenisTransportasiList.find(t => t.id === idToDelete)?.nama || "";
    const isConfirmed = await confirmAlert(
      "Hapus Alat Transportasi?",
      `Apakah Anda yakin ingin menghapus "${trName}"?`
    );
    if (isConfirmed) {
      setJenisTransportasiList((prev) => prev.filter((item) => item.id !== idToDelete));
      showToast("Jenis Transportasi berhasil dihapus", "info");
    }
  };

  // Tahun Actions
  const handleSaveTahun = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTahun = tahunInput.trim();
    if (!cleanTahun) return;
    if (tahunList.includes(cleanTahun)) {
      showToast(`Tahun ${cleanTahun} sudah terdaftar!`, "warning");
      return;
    }
    setTahunList((prev) => [...prev, cleanTahun].sort((a, b) => Number(a) - Number(b)));
    setTahunInput("");
    showToast(`Tahun Dinas ${cleanTahun} berhasil disimpan!`, "success");
  };

  const handleDeleteTahun = async (valToDelete: string) => {
    const isConfirmed = await confirmAlert(
      "Hapus Tahun Anggaran?",
      `Apakah Anda yakin ingin menghapus Tahun "${valToDelete}"?`
    );
    if (isConfirmed) {
      setTahunList((prev) => prev.filter((item) => item !== valToDelete));
      showToast("Tahun berhasil dihapus", "info");
    }
  };

  // Helper filters
  const getFilteredData = () => {
    switch (activeTab) {
      case "provinsi":
        return provinsiList.filter((item) =>
          item.nama.toLowerCase().includes(searchQuery.toLowerCase())
        );
      case "kabkota":
        return kabKotaList
          .map((item) => {
            const provName = provinsiList.find((p) => p.id === item.provinsiId)?.nama || "Unknown";
            return { ...item, provName };
          })
          .filter(
            (item) =>
              item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.provName.toLowerCase().includes(searchQuery.toLowerCase())
          );
      case "jenisperjalanan":
        return jenisPerjalananList.filter((item) =>
          item.nama.toLowerCase().includes(searchQuery.toLowerCase())
        );
      case "subkegiatan":
        return subKegiatanList.filter(
          (item) =>
            item.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.nama.toLowerCase().includes(searchQuery.toLowerCase())
        );
      case "kodering":
        return koderingList.filter(
          (item) =>
            item.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.nama.toLowerCase().includes(searchQuery.toLowerCase())
        );
      case "jenisbbm":
        return jenisBBMList.filter((item) =>
          item.nama.toLowerCase().includes(searchQuery.toLowerCase())
        );
      case "transportasi":
        return jenisTransportasiList.filter((item) =>
          item.nama.toLowerCase().includes(searchQuery.toLowerCase())
        );
      case "tahun":
        return tahunList
          .filter((t) => t.includes(searchQuery))
          .map((t) => ({ id: t, nama: t }));
      default:
        return [];
    }
  };

  const filteredData = getFilteredData();
  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const tabs = [
    { value: "provinsi", label: "Provinsi" },
    { value: "kabkota", label: "Kab/Kota" },
    { value: "jenisperjalanan", label: "Jenis Perjalanan" },
    { value: "subkegiatan", label: "Sub Kegiatan" },
    { value: "kodering", label: "Kodering" },
    { value: "jenisbbm", label: "Jenis BBM" },
    { value: "transportasi", label: "Jenis Transportasi" },
    { value: "tahun", label: "Tahun" },
  ];

  return (
    <div
      id={`${id}-overlay`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-955/75 backdrop-blur-xs px-2 overflow-y-auto"
    >
      <div
        id={`${id}-container`}
        className="relative w-full max-w-4xl bg-white rounded border border-slate-300 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-2"
      >
        {/* Header - Dark slate styled like executive theme */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-950 text-white select-none">
          <div className="flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-slate-300 animate-spin-slow" />
            <div>
              <h2 className="text-[11px] font-bold tracking-tight uppercase">Master Referensi Data</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab List */}
        <div className="border-b border-slate-200 bg-slate-50 p-1">
          <div className="flex flex-wrap gap-1 px-2.5 py-1">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value as TabType)}
                className={`px-3 py-1 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                  activeTab === tab.value
                    ? "bg-indigo-600 text-white shadow-xs shadow-indigo-600/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="p-3 grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Left Block: Form Input */}
          <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded p-2.5">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              + Tambah Referensi Baru
            </h3>

            {activeTab === "provinsi" && (
              <form onSubmit={handleSaveProvinsi} className="space-y-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Nama Provinsi</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Jawa Barat"
                    value={provinsiInput}
                    onChange={(e) => setProvinsiInput(e.target.value)}
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-[11px] font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-8 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-[11px] font-extrabold rounded shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Save className="w-3.5 h-3.5 text-indigo-100" /> Simpan Provinsi
                </button>
              </form>
            )}

            {activeTab === "kabkota" && (
              <form onSubmit={handleSaveKabKota} className="space-y-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Pilih Provinsi</label>
                  <SearchableSelect
                    id="ref-provinsi-select"
                    options={provinsiList.map((p) => ({ id: p.id, label: p.nama }))}
                    value={kabKotaProvinceId}
                    onChange={(val) => setKabKotaProvinceId(val)}
                    placeholder="-- Pilih Provinsi --"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Nama Kab/Kota</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kabupaten Bandung"
                    value={kabKotaInput}
                    onChange={(e) => setKabKotaInput(e.target.value)}
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-[11px] font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-8 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-[11px] font-extrabold rounded shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Save className="w-3.5 h-3.5 text-indigo-100" /> Simpan Kab/Kota
                </button>
              </form>
            )}

            {activeTab === "jenisperjalanan" && (
              <form onSubmit={handleSaveJenisPerjalanan} className="space-y-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Jenis Perjalanan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Perjalanan Dinas Biasa"
                    value={jenisPerjalananInput}
                    onChange={(e) => setJenisPerjalananInput(e.target.value)}
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-[11px] font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-8 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-[11px] font-extrabold rounded shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Save className="w-3.5 h-3.5 text-indigo-100" /> Simpan Jenis Perjalanan
                </button>
              </form>
            )}

            {activeTab === "subkegiatan" && (
              <form onSubmit={handleSaveSubKegiatan} className="space-y-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Kode Kegiatan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 5.03.02.1.01.0008"
                    value={subKegiatanKode}
                    onChange={(e) => setSubKegiatanKode(e.target.value)}
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-[11px] font-mono font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Nama Sub Kegiatan</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Contoh: Fasilitasi Lembaga Profesi ASN"
                    value={subKegiatanNama}
                    onChange={(e) => setSubKegiatanNama(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded text-[11px] font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500 resize-none shadow-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-8 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-[11px] font-extrabold rounded shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Save className="w-3.5 h-3.5 text-indigo-100" /> Simpan Sub Kegiatan
                </button>
              </form>
            )}

            {activeTab === "kodering" && (
              <form onSubmit={handleSaveKodering} className="space-y-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Kode Rekening</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 5.1.02.04.001.00001"
                    value={koderingKode}
                    onChange={(e) => setKoderingKode(e.target.value)}
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-[11px] font-mono font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Nama Kodering/Belanja</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Contoh: Belanja Perjalanan Dinas Biasa"
                    value={koderingNama}
                    onChange={(e) => setKoderingNama(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded text-[11px] font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500 resize-none shadow-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-8 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-[11px] font-extrabold rounded shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Save className="w-3.5 h-3.5 text-indigo-100" /> Simpan Kodering
                </button>
              </form>
            )}

            {activeTab === "jenisbbm" && (
              <form onSubmit={handleSaveBBM} className="space-y-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Nama Bahan Bakar (BBM)</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pertamax"
                    value={bbmNama}
                    onChange={(e) => setBbmNama(e.target.value)}
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-[11px] font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Harga per Liter (Rp)</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 12.500"
                    value={formatRupiah(bbmHarga)}
                    onChange={(e) => setBbmHarga(Number(parseRupiah(e.target.value)))}
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-[11px] font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-8 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-[11px] font-extrabold rounded shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Save className="w-3.5 h-3.5 text-indigo-100" /> Simpan Jenis BBM
                </button>
              </form>
            )}

            {activeTab === "transportasi" && (
              <form onSubmit={handleSaveTransportasi} className="space-y-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Jenis Transportasi</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Transportasi Darat"
                    value={transportasiInput}
                    onChange={(e) => setTransportasiInput(e.target.value)}
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-[11px] font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-8 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-[11px] font-extrabold rounded shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Save className="w-3.5 h-3.5 text-indigo-100" /> Simpan Transportasi
                </button>
              </form>
            )}

            {activeTab === "tahun" && (
              <form onSubmit={handleSaveTahun} className="space-y-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Tahun Berlaku</label>
                  <input
                    type="number"
                    min="2000"
                    max="2100"
                    required
                    placeholder="Contoh: 2026"
                    value={tahunInput}
                    onChange={(e) => setTahunInput(e.target.value)}
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-[11px] font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-8 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-[11px] font-extrabold rounded shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Save className="w-3.5 h-3.5 text-indigo-100" /> Simpan Tahun
                </button>
              </form>
            )}
          </div>

          {/* Right Block: Data Table Grid with dynamic filter */}
          <div className="md:col-span-3 flex flex-col justify-between border border-slate-200 rounded p-2.5 bg-white">
            <div>
              {/* Search filter row */}
              <div className="flex items-center gap-2 mb-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <Search className="h-3.5 w-3.5 text-slate-450" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari referensi..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="block w-full h-8 pl-8 pr-7 text-[11px] font-medium bg-slate-50 border border-slate-200 rounded focus:border-slate-900 focus:bg-white outline-hidden transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Data Lists */}
              <div className="overflow-x-auto min-h-[220px]">
                <table className="min-w-full text-slate-755 text-left">
                  <thead>
                    <tr className="bg-slate-55 border-b border-slate-200 text-[9.5px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-2 py-1.5 text-center w-8">No</th>
                      {activeTab === "kabkota" ? (
                        <>
                          <th className="px-2 py-1.5">Provinsi</th>
                          <th className="px-2 py-1.5">Kabupaten / Kota</th>
                        </>
                      ) : activeTab === "subkegiatan" || activeTab === "kodering" ? (
                        <>
                          <th className="px-2 py-1.5 w-1/3">Kode</th>
                          <th className="px-2 py-1.5">Uraian Nama</th>
                        </>
                      ) : activeTab === "jenisbbm" ? (
                        <>
                          <th className="px-2 py-1.5">BBM</th>
                          <th className="px-2 py-1.5 text-right">Harga</th>
                        </>
                      ) : activeTab === "tahun" ? (
                        <th className="px-2 py-1.5 font-bold">Tahun Berlaku</th>
                      ) : (
                        <th className="px-2 py-1.5">Nama Deskripsi</th>
                      )}
                      <th className="px-2 py-1.5 text-center w-12">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[10.5px]">
                    {paginatedData.length > 0 ? (
                      paginatedData.map((item, index) => {
                        const globalNo = startIndex + index + 1;
                        return (
                          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-2 py-1 text-center text-slate-400 font-mono">
                              {globalNo}
                            </td>

                            {activeTab === "kabkota" ? (
                              <>
                                <td className="px-2 py-1 text-slate-600 font-medium">
                                  {(item as any).provName}
                                </td>
                                <td className="px-2 py-1 font-bold text-slate-900">
                                  {item.nama}
                                </td>
                              </>
                            ) : activeTab === "subkegiatan" || activeTab === "kodering" ? (
                              <>
                                <td className="px-2 py-1 font-mono text-slate-500 text-[9.5px] break-all">
                                  {(item as any).kode}
                                </td>
                                <td className="px-2 py-1 text-slate-705 font-semibold leading-tight">
                                  {item.nama}
                                </td>
                              </>
                            ) : activeTab === "jenisbbm" ? (
                              <>
                                <td className="px-2 py-1 font-bold text-slate-800">
                                  {item.nama}
                                </td>
                                <td className="px-2 py-1 text-right font-mono font-bold text-emerald-600">
                                  Rp {(item as any).hargaPerLiter ? (item as any).hargaPerLiter.toLocaleString("id-ID") : "0"}
                                </td>
                              </>
                            ) : activeTab === "tahun" ? (
                              <td className="px-2 py-1 font-mono font-bold text-slate-800">
                                Tahun {item.nama}
                              </td>
                            ) : (
                              <td className="px-2 py-1 font-medium text-slate-800">
                                {item.nama}
                              </td>
                            )}

                            <td className="px-2 py-1 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  if (activeTab === "provinsi") handleDeleteProvinsi(item.id);
                                  else if (activeTab === "kabkota") handleDeleteKabKota(item.id);
                                  else if (activeTab === "jenisperjalanan")
                                    handleDeleteJenisPerjalanan(item.id);
                                  else if (activeTab === "subkegiatan") handleDeleteSubKegiatan(item.id);
                                  else if (activeTab === "kodering") handleDeleteKodering(item.id);
                                  else if (activeTab === "jenisbbm") handleDeleteBBM(item.id);
                                  else if (activeTab === "transportasi")
                                    handleDeleteTransportasi(item.id);
                                  else if (activeTab === "tahun")
                                    handleDeleteTahun(item.nama);
                                }}
                                className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded border border-rose-200 text-[10px] font-extrabold cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-2xs"
                                title="Hapus"
                              >
                                Hapus
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={activeTab === "kabkota" || activeTab === "subkegiatan" || activeTab === "kodering" || activeTab === "jenisbbm" || activeTab === "tahun" ? 4 : 3}
                          className="px-2 py-8 text-center text-slate-400 font-medium"
                        >
                          Belum ada data referensi terdaftar
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-1.5 border-t border-slate-200 text-[11px]">
              <span className="text-slate-555 font-medium">
                Halaman <b>{currentPage}</b> dari <b>{totalPages}</b> (Total <b>{totalItems}</b> data)
              </span>
              <div className="flex items-center gap-1 font-semibold">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2 py-1 bg-white hover:bg-slate-55 border border-slate-200 rounded text-[11px] font-semibold text-slate-705 disabled:opacity-40 disabled:cursor-not-allowed pointer flex items-center select-none"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-650" />
                </button>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2 py-1 bg-white hover:bg-slate-55 border border-slate-200 rounded text-[11px] font-semibold text-slate-705 disabled:opacity-40 disabled:cursor-not-allowed pointer flex items-center select-none"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-650" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
