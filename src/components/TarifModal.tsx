import React, { useState } from "react";
import { X, Coins, Plus, Trash2, Edit2, Search, ChevronLeft, ChevronRight, Save, ReceiptIndianRupee } from "lucide-react";
import { SearchableSelect } from "./SearchableSelect";
import { Provinsi, KabKota, JenisPerjalanan, TarifUangHarian } from "../types";

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

interface TarifModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  provinsiList: Provinsi[];
  kabKotaList: KabKota[];
  jenisPerjalananList: JenisPerjalanan[];
  tarifList: TarifUangHarian[];
  setTarifList: React.Dispatch<React.SetStateAction<TarifUangHarian[]>>;
  tahunList: string[];
}

export function TarifModal({
  id,
  isOpen,
  onClose,
  provinsiList,
  kabKotaList,
  jenisPerjalananList,
  tarifList,
  setTarifList,
  tahunList,
}: TarifModalProps) {
  const [tahun, setTahun] = useState(() => (tahunList && tahunList.length > 0 ? tahunList[0] : "2025"));
  const [provinsiId, setProvinsiId] = useState("");
  const [kabKotaId, setKabKotaId] = useState("");
  const [jenisPerjalananId, setJenisPerjalananId] = useState("");
  const [tarifNominal, setTarifNominal] = useState(0);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Search and Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  if (!isOpen) return null;

  // Filter cities to only display those in the selected province
  const filteredKabKotaListForSelect = kabKotaList.filter(
    (item) => item.provinsiId === provinsiId
  );

  const handleSaveTarif = (e: React.FormEvent) => {
    e.preventDefault();
    if (!provinsiId || !kabKotaId || !jenisPerjalananId || tarifNominal <= 0) return;

    if (editingId) {
      // Update existing
      setTarifList((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? {
                ...t,
                tahun,
                provinsiId,
                kabKotaId,
                jenisPerjalananId,
                tarif: tarifNominal,
              }
            : t
        )
      );
      setEditingId(null);
    } else {
      // Add new
      const newTarif: TarifUangHarian = {
        id: "tarif-" + Date.now(),
        tahun,
        provinsiId,
        kabKotaId,
        jenisPerjalananId,
        tarif: tarifNominal,
      };
      setTarifList((prev) => [...prev, newTarif]);
    }

    // Reset fields partial
    setTarifNominal(0);
  };

  const handleEdit = (item: TarifUangHarian) => {
    setEditingId(item.id);
    setTahun(item.tahun);
    setProvinsiId(item.provinsiId);
    setKabKotaId(item.kabKotaId);
    setJenisPerjalananId(item.jenisPerjalananId);
    setTarifNominal(item.tarif);
  };

  const handleDelete = (idToDelete: string) => {
    setTarifList((prev) => prev.filter((t) => t.id !== idToDelete));
    if (editingId === idToDelete) {
      setEditingId(null);
      setTarifNominal(0);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTarifNominal(0);
  };

  // Search filtering
  const filteredTarifList = tarifList.filter((item) => {
    const prov = provinsiList.find((p) => p.id === item.provinsiId)?.nama || "";
    const city = kabKotaList.find((c) => c.id === item.kabKotaId)?.nama || "";
    const jp = jenisPerjalananList.find((j) => j.id === item.jenisPerjalananId)?.nama || "";

    const fullStr = `${prov} ${city} ${jp} ${item.tahun}`.toLowerCase();
    return fullStr.includes(searchQuery.toLowerCase());
  });

  const totalItems = filteredTarifList.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTarif = filteredTarifList.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div
      id={`${id}-overlay`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs px-2 overflow-y-auto"
    >
      <div
        id={`${id}-container`}
        className="relative w-full max-w-5xl bg-white rounded border border-slate-300 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-2"
      >
        {/* Header - Dark slate styled as executive theme */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-950 text-white select-none">
          <div className="flex items-center gap-1.5 animate-subtle-slide">
            <Coins className="w-4 h-4 text-slate-300" />
            <div>
              <h2 className="text-[11px] font-bold tracking-tight uppercase">Referensi Tarif Uang Harian</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Form Side - Left cols 2 */}
          <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded p-2.5">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              {editingId ? "📝 Edit Tarif Uang Harian" : "➕ Input Tarif Baru"}
            </h3>

            <form onSubmit={handleSaveTarif} className="space-y-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Tahun Berlaku</label>
                <div className="relative">
                  <select
                    value={tahun}
                    onChange={(e) => setTahun(e.target.value)}
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-[11px] font-semibold focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                  >
                    {tahunList.map((t) => (
                      <option key={t} value={t}>Tahun {t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Provinsi</label>
                <SearchableSelect
                  id="tarif-provinsi-select"
                  options={provinsiList.map((p) => ({ id: p.id, label: p.nama }))}
                  value={provinsiId}
                  onChange={(val) => {
                    setProvinsiId(val);
                    setKabKotaId(""); // Reset city as province changed
                  }}
                  placeholder="-- Pilih Provinsi --"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Kabupaten / Kota</label>
                <SearchableSelect
                  id="tarif-kabkota-select"
                  disabled={!provinsiId}
                  options={filteredKabKotaListForSelect.map((c) => ({ id: c.id, label: c.nama }))}
                  value={kabKotaId}
                  onChange={(val) => setKabKotaId(val)}
                  placeholder={
                    provinsiId ? "-- Pilih Kab/Kota --" : "Harap pilih Provinsi dahulu"
                  }
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Jenis Perjalanan</label>
                <SearchableSelect
                  id="tarif-jp-select"
                  options={jenisPerjalananList.map((j) => ({ id: j.id, label: j.nama }))}
                  value={jenisPerjalananId}
                  onChange={(val) => setJenisPerjalananId(val)}
                  placeholder="-- Pilih Jenis Perjalanan --"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Nominal Tarif (Rp)</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 430.000"
                  value={formatRupiah(tarifNominal)}
                  onChange={(e) => setTarifNominal(Number(parseRupiah(e.target.value)))}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500 font-mono"
                />
              </div>

              <div className="flex gap-1.5 pt-1">
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex-1 h-8 bg-slate-100 hover:bg-slate-200 text-slate-750 border border-slate-300 text-[11px] font-bold rounded transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 h-8 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-[11px] font-extrabold rounded shadow-xs shadow-amber-600/10 hover:shadow-orange-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Save className="w-3.5 h-3.5 text-amber-100 font-bold" /> {editingId ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>

          {/* Table Side - Right cols 3 */}
          <div className="md:col-span-3 flex flex-col justify-between border border-slate-200 rounded p-2.5 bg-white">
            <div>
              {/* Search tool of rates */}
              <div className="flex items-center gap-2 mb-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <Search className="h-3.5 w-3.5 text-slate-450" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari Provinsi, Kota, atau Tahun..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="block w-full h-8 pl-8 pr-7 text-[11px] font-medium bg-slate-50 border border-slate-200 rounded focus:border-amber-500 focus:bg-white outline-hidden transition-all"
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

              {/* Rates Table Grid */}
              <div className="overflow-x-auto min-h-[220px]">
                <table className="min-w-full text-slate-750 text-left">
                  <thead>
                    <tr className="bg-slate-55 border-b border-slate-200 text-[9.5px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-2 py-1.5 text-center w-8">No</th>
                      <th className="px-2 py-1.5 text-center w-12">Tahun</th>
                      <th className="px-2 py-1.5">Provinsi / Kota</th>
                      <th className="px-2 py-1.5">Jenis Perjalanan</th>
                      <th className="px-2 py-1.5 text-right">Tarif</th>
                      <th className="px-2 py-1.5 text-center w-16">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-[10.5px]">
                    {paginatedTarif.length > 0 ? (
                      paginatedTarif.map((item, index) => {
                        const globalNo = startIndex + index + 1;
                        const provName = provinsiList.find((p) => p.id === item.provinsiId)?.nama || "-";
                        const cityName = kabKotaList.find((c) => c.id === item.kabKotaId)?.nama || "-";
                        const jpName = jenisPerjalananList.find((j) => j.id === item.jenisPerjalananId)?.nama || "-";

                        return (
                          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-2 py-1 text-center text-slate-450 font-mono">
                              {globalNo}
                            </td>
                            <td className="px-2 py-1 text-center">
                              <span className="px-1 py-0.2 bg-slate-100 text-slate-600 rounded font-bold font-mono text-[9px]">
                                {item.tahun}
                              </span>
                            </td>
                            <td className="px-2 py-1 leading-tight">
                              <div className="text-[9.5px] text-slate-450">{provName}</div>
                              <div className="font-bold text-slate-900">{cityName}</div>
                            </td>
                            <td className="px-2 py-1 leading-tight text-slate-600 font-medium">
                              {jpName}
                            </td>
                            <td className="px-2 py-1 text-right font-bold text-slate-900 font-mono text-[11px]">
                              {item.tarif.toLocaleString("id-ID")}
                            </td>
                            <td className="px-2 py-1 text-center font-bold">
                              <div className="flex justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleEdit(item)}
                                  className="px-2 py-0.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded border border-sky-200 text-[10px] font-bold cursor-pointer transition-all hover:scale-105 active:scale-95"
                                  title="Edit Tarif"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(item.id)}
                                  className="px-2 py-0.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded border border-rose-200 text-[10px] font-extrabold cursor-pointer transition-all hover:scale-105 active:scale-95"
                                  title="Hapus Tarif"
                                >
                                  Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-2 py-8 text-center text-slate-400 font-medium">
                          Belum ada data tarif dikonfigurasikan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between pt-1.5 border-t border-slate-200 text-[11px]">
              <span className="text-slate-550 font-medium">
                Halaman <b>{currentPage}</b> dari <b>{totalPages}</b> (Total <b>{totalItems}</b> data)
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2 py-1 bg-white hover:bg-slate-55 border border-slate-200 rounded text-[11px] font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed pointer flex items-center select-none"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-650" />
                </button>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2 py-1 bg-white hover:bg-slate-55 border border-slate-200 rounded text-[11px] font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed pointer flex items-center select-none"
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
