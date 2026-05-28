import React, { useState, useRef } from "react";
import { X, Users, UserPlus, Trash2, Search, ChevronLeft, ChevronRight, Save, Key, Download, UploadCloud, FileSpreadsheet } from "lucide-react";
import { Pegawai } from "../types";
import * as XLSX from "xlsx";

interface PegawaiModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  pegawaiList: Pegawai[];
  setPegawaiList: React.Dispatch<React.SetStateAction<Pegawai[]>>;
}

export function PegawaiModal({
  id,
  isOpen,
  onClose,
  pegawaiList,
  setPegawaiList,
}: PegawaiModalProps) {
  const [nama, setNama] = useState("");
  const [nip, setNip] = useState("");
  const [pangkat, setPangkat] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Bulk Upload state references
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  if (!isOpen) return null;

  const handleSavePegawai = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !nip.trim()) return;

    if (editingId) {
      setPegawaiList((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                nama: nama.trim(),
                nip: nip.trim(),
                pangkat: pangkat.trim() || "-",
                jabatan: jabatan.trim() || "-",
              }
            : p
        )
      );
      setEditingId(null);
    } else {
      const newPegawai: Pegawai = {
        id: "pegawai-" + Date.now(),
        nama: nama.trim(),
        nip: nip.trim(),
        pangkat: pangkat.trim() || "-",
        jabatan: jabatan.trim() || "-",
      };

      setPegawaiList((prev) => [...prev, newPegawai]);
    }

    // Reset fields
    setNama("");
    setNip("");
    setPangkat("");
    setJabatan("");
  };

  const handleDelete = (idToDelete: string) => {
    setPegawaiList((prev) => prev.filter((p) => p.id !== idToDelete));
    if (editingId === idToDelete) {
      handleCancelEdit();
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNama("");
    setNip("");
    setPangkat("");
    setJabatan("");
  };

  const handleEditClick = (p: Pegawai) => {
    setEditingId(p.id);
    setNama(p.nama);
    setNip(p.nip);
    setPangkat(p.pangkat === "-" ? "" : p.pangkat);
    setJabatan(p.jabatan === "-" ? "" : p.jabatan);
  };

  const handleDownloadTemplate = () => {
    const headers = [
      "Nama Lengkap",
      "NIP",
      "Pangkat / Golongan",
      "Jabatan"
    ];
    const data = [
      [
        "Drs. HERRI NOVEDIA, M.M.",
        "198010262012021002",
        "Penata Muda Tingkat I / III.b",
        "Perencana Ahli Pertama"
      ],
      [
        "TUBAGUS MUCHAMAD JEFRI KARTAJUMENA, S.H., M.M.",
        "198710262009022002",
        "Pembina / IV.a",
        "Kepala Bidang"
      ]
    ];
    
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template Pegawai");
    XLSX.writeFile(workbook, "Template_Data_Pegawai.xlsx");
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadError("");
    setUploadSuccess("");

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const dataResult = event.target?.result;
        if (!dataResult) throw new Error("File tidak dapat dibaca");
        
        const workbook = XLSX.read(dataResult, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Convert sheet to json array
        const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        
        if (rows.length === 0) {
          throw new Error("Spreadsheet kosong atau tidak memiliki baris data.");
        }

        const importedPegawai: Pegawai[] = [];
        let skippedRowsCount = 0;

        rows.forEach((row: any, i) => {
          // Normalize header keys
          const namaKey = Object.keys(row).find(
            (k) =>
              k.toLowerCase().replace(/\s+/g, "") === "namalengkap" ||
              k.toLowerCase().replace(/\s+/g, "") === "nama"
          );
          const nipKey = Object.keys(row).find(
            (k) => k.toLowerCase().replace(/\s+/g, "") === "nip"
          );
          const pangkatKey = Object.keys(row).find(
            (k) =>
              k.toLowerCase().replace(/\s+/g, "") === "pangkatgolongan" ||
              k.toLowerCase().replace(/\s+/g, "") === "pangkat"
          );
          const jabatanKey = Object.keys(row).find(
            (k) =>
              k.toLowerCase().replace(/\s+/g, "") === "jabatan" ||
              k.toLowerCase().replace(/\s+/g, "") === "jabatankerja"
          );

          const cellNama = namaKey ? String(row[namaKey]).trim() : "";
          const cellNip = nipKey ? String(row[nipKey]).trim() : "";
          const cellPangkat = pangkatKey ? String(row[pangkatKey]).trim() : "-";
          const cellJabatan = jabatanKey ? String(row[jabatanKey]).trim() : "-";

          if (cellNama && cellNip) {
            importedPegawai.push({
              id: "pegawai-bulk-" + Date.now() + "-" + i,
              nama: cellNama,
              nip: cellNip,
              pangkat: cellPangkat || "-",
              jabatan: cellJabatan || "-",
            });
          } else {
            skippedRowsCount++;
          }
        });

        if (importedPegawai.length === 0) {
          throw new Error("Tidak menemukan data pegawai valid (nama lengkap dan NIP wajib diisi).");
        }

        const existingNips = new Set(pegawaiList.map((p) => p.nip));
        const filteredImports = importedPegawai.filter((p) => !existingNips.has(p.nip));
        const duplicateCount = importedPegawai.length - filteredImports.length;
        
        let logMsg = `Berhasil mengimpor ${filteredImports.length} pegawai baru.`;
        if (duplicateCount > 0) {
          logMsg += ` (${duplicateCount} pegawai dengan NIP yang sama dilewati).`;
        }
        if (skippedRowsCount > 0) {
          logMsg += ` Rincian ${skippedRowsCount} baris tidak valid dilewati.`;
        }
        
        setUploadSuccess(logMsg);
        setPegawaiList((prev) => [...prev, ...filteredImports]);
      } catch (err: any) {
        console.error(err);
        setUploadError(err.message || "Gagal menguraikan file excel pegawai.");
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    reader.onerror = () => {
      setUploadError("Gagal membaca file.");
    };

    reader.readAsBinaryString(file);
  };

  // Search filter
  const filteredPegawaiList = pegawaiList.filter(
    (item) =>
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nip.includes(searchQuery) ||
      item.jabatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pangkat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = filteredPegawaiList.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPegawai = filteredPegawaiList.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div
      id={`${id}-overlay`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs px-2 overflow-y-auto"
    >
      <div
        id={`${id}-container`}
        className="relative w-full max-w-5xl bg-white rounded border border-slate-300 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-2"
      >
        {/* Header - Dark slate styled like executive theme */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-950 text-white select-none">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-slate-300" />
            <div>
              <h2 className="text-[11px] font-bold tracking-tight uppercase">Manajemen Data Pegawai</h2>
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
          {/* Add Form column left 2 */}
          <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded p-2.5">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              <UserPlus className="inline-block w-3.5 h-3.5 mr-0.5 pb-0.5 text-slate-400" /> {editingId ? "Edit Data Pegawai" : "Tambah Pegawai Baru"}
            </h3>

            <form onSubmit={handleSavePegawai} className="space-y-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Drs. HERRI NOVEDIA, M.M."
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-[11px] font-medium focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">NIP (Nomor Induk Pegawai)</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 198010262012021002"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-[11px] font-mono font-medium focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Pangkat / Golongan</label>
                <input
                  type="text"
                  placeholder="Contoh: Penata Muda Tingkat I / III.b"
                  value={pangkat}
                  onChange={(e) => setPangkat(e.target.value)}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-[11px] font-medium focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Jabatan Kerja</label>
                <input
                  type="text"
                  placeholder="Contoh: Perencana Ahli Pertama"
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-[11px] font-medium focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-1.5 mt-1">
                <button
                  type="submit"
                  className="flex-1 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-[11px] font-extrabold rounded shadow-xs shadow-emerald-600/10 hover:shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Save className="w-3.5 h-3.5 text-emerald-100" /> {editingId ? "Update Pegawai" : "Simpan Data Pegawai"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-2.5 h-8 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-[11px] font-bold rounded transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>

            {/* Bulk Upload Excel Section */}
            <div className="mt-4 pt-3 border-t border-slate-200">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1 select-none">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Bulk Import Pegawai (.xlsx)
              </h4>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="w-full h-8 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-250 text-[10.5px] font-bold rounded flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Unduh Template Excel
                </button>

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/20 rounded-md p-3 text-center cursor-pointer transition-all group"
                >
                  <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-emerald-600 mx-auto mb-1 animate-pulse" />
                  <span className="block text-[10px] font-bold text-slate-700">Unggah File Excel Pegawai</span>
                  <span className="block text-[8.5px] text-slate-400 mt-0.5 font-medium">Klik untuk memilih file (.xlsx)</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".xlsx, .xls"
                    onChange={handleExcelUpload}
                    className="hidden"
                  />
                </div>

                {uploadError && (
                  <div className="p-2 rounded bg-red-50 text-red-700 border-l-2 border-red-500 text-[9.5px] font-semibold leading-tight">
                    {uploadError}
                  </div>
                )}

                {uploadSuccess && (
                  <div className="p-2 rounded bg-emerald-50 text-emerald-800 border-l-2 border-emerald-500 text-[9.5px] font-medium leading-tight">
                    {uploadSuccess}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table list column right 3 */}
          <div className="md:col-span-3 flex flex-col justify-between border border-slate-200 rounded p-2.5 bg-white">
            <div>
              {/* Search Box */}
              <div className="flex items-center gap-2 mb-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <Search className="h-3.5 w-3.5 text-slate-450" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari pegawai berdasarkan Nama, NIP, Jabatan..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="block w-full h-8 pl-8 pr-7 text-[11px] font-medium bg-slate-50 border border-slate-200 rounded focus:border-emerald-500 focus:bg-white outline-hidden transition-all"
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

              {/* Data Table */}
              <div className="overflow-x-auto min-h-[220px]">
                <table className="min-w-full text-slate-755 text-left">
                  <thead>
                    <tr className="bg-slate-55 border-b border-slate-200 text-[9.5px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-2 py-1.5 text-center w-8">No</th>
                      <th className="px-2 py-1.5">Nama Pegawai / NIP</th>
                      <th className="px-2 py-1.5">Pangkat</th>
                      <th className="px-2 py-1.5">Jabatan</th>
                      <th className="px-2 py-1.5 text-center w-12">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[10.5px] text-slate-700">
                    {paginatedPegawai.length > 0 ? (
                      paginatedPegawai.map((item, index) => {
                        const globalNo = startIndex + index + 1;
                        return (
                          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-2 py-1 text-center text-slate-400 font-mono">
                              {globalNo}
                            </td>
                            <td className="px-2 py-1 leading-tight">
                              <div className="font-bold text-slate-900">
                                {item.nama}
                              </div>
                              <div className="text-[9px] font-mono text-slate-450 mt-0.5">
                                NIP: {item.nip}
                              </div>
                            </td>
                            <td className="px-2 py-1 text-slate-600">
                              {item.pangkat}
                            </td>
                            <td className="px-2 py-1 text-slate-600 font-medium">
                              {item.jabatan}
                            </td>
                            <td className="px-2 py-1 text-center">
                              <div className="flex justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleEditClick(item)}
                                  className="px-2 py-0.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded border border-sky-200 text-[10px] font-bold cursor-pointer transition-all hover:scale-105 active:scale-95"
                                  title="Edit Pegawai"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(item.id)}
                                  className="px-2 py-0.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded border border-rose-200 text-[10px] font-extrabold cursor-pointer transition-all hover:scale-105 active:scale-95"
                                  title="Hapus Pegawai"
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
                        <td colSpan={5} className="px-2 py-8 text-center text-slate-400 font-medium">
                          Belum ada pegawai terdaftar di database
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-1.5 border-t border-slate-200 text-[11px]">
              <span className="text-slate-550 font-medium">
                Halaman <b>{currentPage}</b> dari <b>{totalPages}</b> (Total <b>{totalItems}</b> data)
              </span>
              <div className="flex items-center gap-1">
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
