import React, { useState, useEffect } from "react";
import { X, Calendar, DollarSign, Plus, Trash2, Tag, Landmark, FileText, ChevronRight, Check } from "lucide-react";
import { SearchableSelect, SearchableMultiSelect } from "./SearchableSelect";
import {
  Provinsi,
  KabKota,
  JenisPerjalanan,
  SubKegiatan,
  Kodering,
  JenisBBM,
  JenisTransportasi,
  Pegawai,
  TarifUangHarian,
  PerjalananDinas,
  RincianBBM,
  RincianTransport,
  RincianHotel,
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

interface PerjalananFormModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  provinsiList: Provinsi[];
  kabKotaList: KabKota[];
  jenisPerjalananList: JenisPerjalanan[];
  subKegiatanList: SubKegiatan[];
  koderingList: Kodering[];
  jenisBBMList: JenisBBM[];
  jenisTransportasiList: JenisTransportasi[];
  pegawaiList: Pegawai[];
  tarifList: TarifUangHarian[];
  onSave: (records: PerjalananDinas[]) => void;
  editingRecord?: PerjalananDinas | null;
}

export function PerjalananFormModal({
  id,
  isOpen,
  onClose,
  provinsiList,
  kabKotaList,
  jenisPerjalananList,
  subKegiatanList,
  koderingList,
  jenisBBMList,
  jenisTransportasiList,
  pegawaiList,
  tarifList,
  onSave,
  editingRecord,
}: PerjalananFormModalProps) {
  // 1. Data Utama States
  const [nomorBku, setNomorBku] = useState("");
  const [tanggalBku, setTanggalBku] = useState("");
  const [nomorSp, setNomorSp] = useState("");
  const [tanggalSp, setTanggalSp] = useState("");

  const [selectedPegawaiIds, setSelectedPegawaiIds] = useState<string[]>([]);
  const [koordinatorId, setKoordinatorId] = useState("");

  const [provinsiId, setProvinsiId] = useState("");
  const [kabKotaId1, setKabKotaId1] = useState("");
  const [kabKotaId2, setKabKotaId2] = useState("");
  const [kabKotaId3, setKabKotaId3] = useState("");

  const [tujuan1, setTujuan1] = useState("");
  const [tujuan2, setTujuan2] = useState("");
  const [tujuan3, setTujuan3] = useState("");

  const [jenisPerjalananId, setJenisPerjalananId] = useState("");

  const [tanggalBerangkat, setTanggalBerangkat] = useState("");
  const [tanggalKembali, setTanggalKembali] = useState("");
  const [hari, setHari] = useState(0);

  // Option 3: Split harian states
  const [isSplitHarian, setIsSplitHarian] = useState(false);
  const [hariDest1, setHariDest1] = useState(0);
  const [tarifDest1, setTarifDest1] = useState(0);
  const [hariDest2, setHariDest2] = useState(0);
  const [tarifDest2, setTarifDest2] = useState(0);
  const [hariDest3, setHariDest3] = useState(0);
  const [tarifDest3, setTarifDest3] = useState(0);

  const [tarifAcuan, setTarifAcuan] = useState(0);
  const [uangSaku, setUangSaku] = useState(0);
  const [uangRepresentatif, setUangRepresentatif] = useState(0);

  const [subKegiatanId, setSubKegiatanId] = useState("");
  const [koderingId, setKoderingId] = useState("");
  const [uraianPrj, setUraianPrj] = useState("");

  // 2. Section Details (BBM, Transport, Hotel)
  const [rincianBBM, setRincianBBM] = useState<RincianBBM[]>([]);
  const [rincianTransport, setRincianTransport] = useState<RincianTransport[]>([]);
  const [rincianHotel, setRincianHotel] = useState<RincianHotel[]>([]);

  // Reset or set data when modal opens/edits
  useEffect(() => {
    if (isOpen) {
      if (editingRecord) {
        // We are editing an existing record
        setNomorBku(editingRecord.nomorBku || "");
        setTanggalBku(editingRecord.tanggalBku || "");
        setNomorSp(editingRecord.nomorSp || "");
        setTanggalSp(editingRecord.tanggalSp || "");
        setSelectedPegawaiIds([editingRecord.pegawaiId]);
        setKoordinatorId(editingRecord.koordinatorId || "");
        setProvinsiId(editingRecord.provinsiId || "");
        setKabKotaId1(editingRecord.kabKotaId1 || "");
        setKabKotaId2(editingRecord.kabKotaId2 || "");
        setKabKotaId3(editingRecord.kabKotaId3 || "");
        setTujuan1(editingRecord.tujuan1 || "");
        setTujuan2(editingRecord.tujuan2 || "");
        setTujuan3(editingRecord.tujuan3 || "");
        setJenisPerjalananId(editingRecord.jenisPerjalananId || "");
        setTanggalBerangkat(editingRecord.tanggalBerangkat || "");
        setTanggalKembali(editingRecord.tanggalKembali || "");
        setHari(editingRecord.hari || 0);
        setTarifAcuan(editingRecord.tarif || 0);
        setIsSplitHarian(editingRecord.isSplitHarian || false);
        setHariDest1(editingRecord.hariDest1 || 0);
        setTarifDest1(editingRecord.tarifDest1 || 0);
        setHariDest2(editingRecord.hariDest2 || 0);
        setTarifDest2(editingRecord.tarifDest2 || 0);
        setHariDest3(editingRecord.hariDest3 || 0);
        setTarifDest3(editingRecord.tarifDest3 || 0);
        setUangSaku(editingRecord.uangSaku || 0);
        setUangRepresentatif(editingRecord.uangRepresentatif || 0);
        setSubKegiatanId(editingRecord.subKegiatanId || "");
        setKoderingId(editingRecord.koderingId || "");
        setUraianPrj(editingRecord.uraianPrj || "");
        setRincianBBM(editingRecord.rincianBBM || []);
        setRincianTransport(editingRecord.rincianTransport || []);
        setRincianHotel(editingRecord.rincianHotel || []);
      } else {
        // Clean state for fresh creation
        setNomorBku("");
        setTanggalBku("");
        setNomorSp("");
        setTanggalSp("");
        setSelectedPegawaiIds([]);
        setKoordinatorId("");
        setProvinsiId("");
        setKabKotaId1("");
        setKabKotaId2("");
        setKabKotaId3("");
        setTujuan1("");
        setTujuan2("");
        setTujuan3("");
        setJenisPerjalananId("");
        setTanggalBerangkat("");
        setTanggalKembali("");
        setHari(0);
        setTarifAcuan(0);
        setIsSplitHarian(false);
        setHariDest1(0);
        setTarifDest1(0);
        setHariDest2(0);
        setTarifDest2(0);
        setHariDest3(0);
        setTarifDest3(0);
        setUangSaku(0);
        setUangRepresentatif(0);
        setSubKegiatanId("");
        setKoderingId("");
        setUraianPrj("");
        setRincianBBM([]);
        setRincianTransport([]);
        setRincianHotel([]);
      }
    }
  }, [isOpen, editingRecord]);

  // Real-time calculation: Days (Hari) based on Date depart and return
  useEffect(() => {
    if (tanggalBerangkat && tanggalKembali) {
      const start = new Date(tanggalBerangkat);
      const end = new Date(tanggalKembali);
      if (end >= start) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setHari(diffDays);
      } else {
        setHari(0);
      }
    } else {
      setHari(0);
    }
  }, [tanggalBerangkat, tanggalKembali]);

  // Real-time calculation: Highest tariff lookup and individual lookups for destinations
  useEffect(() => {
    if (provinsiId && jenisPerjalananId) {
      const activeCities = [kabKotaId1, kabKotaId2, kabKotaId3].filter((c) => c !== "");
      
      let maxTarifFound = 0;
      activeCities.forEach((cityId) => {
        // Find tariff match
        const match = tarifList.find(
          (t) =>
            t.provinsiId === provinsiId &&
            t.kabKotaId === cityId &&
            t.jenisPerjalananId === jenisPerjalananId
        );
        if (match && match.tarif > maxTarifFound) {
          maxTarifFound = match.tarif;
        }
      });

      // Update if any rate is found, otherwise keep as manual/editable
      if (maxTarifFound > 0) {
        setTarifAcuan(maxTarifFound);
      }

      // Look up individual rates for each city destination
      if (kabKotaId1) {
        const match1 = tarifList.find(
          (t) =>
            t.provinsiId === provinsiId &&
            t.kabKotaId === kabKotaId1 &&
            t.jenisPerjalananId === jenisPerjalananId
        );
        if (match1) setTarifDest1(match1.tarif);
      } else {
        setTarifDest1(0);
      }

      if (kabKotaId2) {
        const match2 = tarifList.find(
          (t) =>
            t.provinsiId === provinsiId &&
            t.kabKotaId === kabKotaId2 &&
            t.jenisPerjalananId === jenisPerjalananId
        );
        if (match2) setTarifDest2(match2.tarif);
      } else {
        setTarifDest2(0);
      }

      if (kabKotaId3) {
        const match3 = tarifList.find(
          (t) =>
            t.provinsiId === provinsiId &&
            t.kabKotaId === kabKotaId3 &&
            t.jenisPerjalananId === jenisPerjalananId
        );
        if (match3) setTarifDest3(match3.tarif);
      } else {
        setTarifDest3(0);
      }
    }
  }, [provinsiId, jenisPerjalananId, kabKotaId1, kabKotaId2, kabKotaId3, tarifList]);

  // Sync individual days spent if split harian is disabled
  useEffect(() => {
    if (!isSplitHarian) {
      setHariDest1(hari);
      setHariDest2(0);
      setHariDest3(0);
    }
  }, [hari, isSplitHarian]);

  if (!isOpen) return null;

  // Filter lists based on relations
  const filteredKabKotaList = kabKotaList.filter((item) => item.provinsiId === provinsiId);

  // BBM Handlers
  const handleAddBBM = () => {
    const newBbm: RincianBBM = {
      jenisBBMId: "",
      hargaPerLiter: 0,
      totalBeli: 0,
      liter: 0,
    };
    setRincianBBM((prev) => [...prev, newBbm]);
  };

  const handleUpdateBbmRow = (index: number, fields: Partial<RincianBBM>) => {
    setRincianBBM((prev) => {
      const updated = [...prev];
      const target = { ...updated[index], ...fields };
      
      // If fuel type is selected, prefill price
      if (fields.jenisBBMId) {
        const fuel = jenisBBMList.find((f) => f.id === fields.jenisBBMId);
        if (fuel) {
          target.hargaPerLiter = fuel.hargaPerLiter;
        }
      }

      // Calculate liters
      if (target.hargaPerLiter > 0 && target.totalBeli > 0) {
        target.liter = parseFloat((target.totalBeli / target.hargaPerLiter).toFixed(2));
      } else {
        target.liter = 0;
      }

      updated[index] = target;
      return updated;
    });
  };

  const handleRemoveBBM = (index: number) => {
    setRincianBBM((prev) => prev.filter((_, i) => i !== index));
  };

  // Transportation Handlers
  const handleAddTransport = () => {
    const newTrans: RincianTransport = {
      jenisTransportasiId: "",
      biayaTol: 0,
      biayaTravel: 0,
      biayaKereta: 0,
      biayaPesawat: 0,
      biayaFerry: 0,
    };
    setRincianTransport((prev) => [...prev, newTrans]);
  };

  const handleUpdateTransportRow = (index: number, fields: Partial<RincianTransport>) => {
    setRincianTransport((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...fields };
      return updated;
    });
  };

  const handleRemoveTransport = (index: number) => {
    setRincianTransport((prev) => prev.filter((_, i) => i !== index));
  };

  // Hotel Handlers
  const handleAddHotel = () => {
    const newHotel: RincianHotel = {
      namaHotel: "",
      hargaPerMalam: 0,
      malam: 0,
      total: 0,
      namaMenginap: "",
      nomorKamar: "",
    };
    setRincianHotel((prev) => [...prev, newHotel]);
  };

  const handleUpdateHotelRow = (index: number, fields: Partial<RincianHotel>) => {
    setRincianHotel((prev) => {
      const updated = [...prev];
      const target = { ...updated[index], ...fields };
      
      if (target.hargaPerMalam >= 0 && target.malam >= 0) {
        target.total = target.hargaPerMalam * target.malam;
      } else {
        target.total = 0;
      }

      updated[index] = target;
      return updated;
    });
  };

  const handleRemoveHotel = (index: number) => {
    setRincianHotel((prev) => prev.filter((_, i) => i !== index));
  };

  // Calculate Subsums
  const hitungTotalHarian = () => {
    if (isSplitHarian) {
      return (hariDest1 * tarifDest1) + (hariDest2 * tarifDest2) + (hariDest3 * tarifDest3);
    }
    return hari * tarifAcuan;
  };
  const hitungSubsumBBM = () => rincianBBM.reduce((acc, cr) => acc + cr.totalBeli, 0);
  const hitungSubsumTransport = () =>
    rincianTransport.reduce(
      (acc, cr) =>
        acc +
        cr.biayaTol +
        cr.biayaTravel +
        cr.biayaKereta +
        cr.biayaPesawat +
        cr.biayaFerry,
      0
    );
  const hitungSubsumHotel = () => rincianHotel.reduce((acc, cr) => acc + cr.total, 0);

  // Overall allowance calculation
  const hitungTotalBiayaPertamaSeluruhnya = () => {
    return (
      hitungTotalHarian() +
      uangSaku +
      uangRepresentatif +
      hitungSubsumBBM() +
      hitungSubsumTransport() +
      hitungSubsumHotel()
    );
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nomorBku.trim()) {
      alert("Harap isi Nomor BKU!");
      return;
    }
    if (!tanggalBku) {
      alert("Harap pilih Tanggal BKU!");
      return;
    }
    if (!nomorSp.trim()) {
      alert("Harap isi Nomor Surat Perintah (SP)!");
      return;
    }
    if (!tanggalSp) {
      alert("Harap pilih Tanggal SP!");
      return;
    }
    if (selectedPegawaiIds.length === 0) {
      alert("Harap pilih minimal 1 nama pegawai!");
      return;
    }
    if (!koordinatorId) {
      alert("Harap pilih Nama Koordinator!");
      return;
    }
    if (!provinsiId) {
      alert("Harap pilih Provinsi Tujuan!");
      return;
    }
    if (!kabKotaId1) {
      alert("Harap pilih Kabupaten/Kota Tujuan ke-1!");
      return;
    }
    if (!tujuan1.trim()) {
      alert("Harap isi Tempat Tujuan ke-1!");
      return;
    }
    if (!jenisPerjalananId) {
      alert("Harap pilih Jenis Perjalanan!");
      return;
    }
    if (!tanggalBerangkat) {
      alert("Harap pilih Tanggal Berangkat!");
      return;
    }
    if (!tanggalKembali) {
      alert("Harap pilih Tanggal Kembali!");
      return;
    }
    if (!subKegiatanId) {
      alert("Harap pilih Sub Kegiatan!");
      return;
    }
    if (!koderingId) {
      alert("Harap pilih Kodering Rekening!");
      return;
    }
    if (!uraianPrj.trim()) {
      alert("Harap isi Uraian / Maksud Perjalanan Dinas!");
      return;
    }

    // Verify split harian logic if activated
    if (isSplitHarian) {
      const totalSplitHari = hariDest1 + hariDest2 + hariDest3;
      if (totalSplitHari !== hari) {
        if (!confirm(`Peringatan: Jumlah hari rincian lokasi (${totalSplitHari} hari) tidak sama dengan total hari periode perjalanan (${hari} hari). Tetap simpan?`)) {
          return;
        }
      }
    }

    const shareGroupId = editingRecord ? editingRecord.groupId : "group-" + Date.now();
    const generatedRecords: PerjalananDinas[] = [];

    // Loop through each selected employee to generate their trip log
    selectedPegawaiIds.forEach((pId, idx) => {
      const isFirst = idx === 0;

      // Expense logs:
      // Typically, companion employees get no hotel or transport expenses.
      // But if multiple employees are selected and different BBM types are recorded,
      // distribute them: the first BBM item goes to the first employee, and subsequent ones go to the second employee.
      let fuelData: RincianBBM[] = [];
      if (selectedPegawaiIds.length === 1) {
        fuelData = isFirst ? rincianBBM : [];
      } else {
        if (idx === 0) {
          fuelData = rincianBBM.length > 0 ? [rincianBBM[0]] : [];
        } else if (idx === 1) {
          fuelData = rincianBBM.length > 1 ? rincianBBM.slice(1) : [];
        } else {
          fuelData = [];
        }
      }

      const transData = isFirst ? rincianTransport : [];
      const hotelData = isFirst ? rincianHotel : [];

      // Calculate individual totals based on what was assigned to each employee
      const bbmSumForThisEmployee = fuelData.reduce((acc, cr) => acc + cr.totalBeli, 0);
      const transportSumForThisEmployee = transData.reduce(
        (acc, cr) =>
          acc +
          cr.biayaTol +
          cr.biayaTravel +
          cr.biayaKereta +
          cr.biayaPesawat +
          cr.biayaFerry,
        0
      );
      const hotelSumForThisEmployee = hotelData.reduce((acc, cr) => acc + cr.total, 0);

      const totalCosts =
        hitungTotalHarian() +
        uangSaku +
        uangRepresentatif +
        bbmSumForThisEmployee +
        transportSumForThisEmployee +
        hotelSumForThisEmployee;

      const record: PerjalananDinas = {
        id: isFirst && editingRecord ? editingRecord.id : "din-" + pId + "-" + Date.now() + "-" + idx,
        groupId: shareGroupId,
        nomorBku,
        tanggalBku,
        nomorSp,
        tanggalSp,
        koordinatorId,
        pegawaiId: pId,
        isFirstPegawai: isFirst,
        subKegiatanId,
        koderingId,
        uraianPrj,
        provinsiId,
        kabKotaId1,
        kabKotaId2: kabKotaId2 || undefined,
        kabKotaId3: kabKotaId3 || undefined,
        tujuan1,
        tujuan2: tujuan2 || undefined,
        tujuan3: tujuan3 || undefined,
        jenisPerjalananId,
        tanggalBerangkat,
        tanggalKembali,
        hari,
        tarif: tarifAcuan,
        isSplitHarian,
        hariDest1: isSplitHarian ? hariDest1 : undefined,
        tarifDest1: isSplitHarian ? tarifDest1 : undefined,
        hariDest2: isSplitHarian ? hariDest2 : undefined,
        tarifDest2: isSplitHarian ? tarifDest2 : undefined,
        hariDest3: isSplitHarian ? hariDest3 : undefined,
        tarifDest3: isSplitHarian ? tarifDest3 : undefined,
        uangSaku,
        uangRepresentatif,
        totalUang: totalCosts,
        rincianBBM: fuelData,
        rincianTransport: transData,
        rincianHotel: hotelData,
      };

      generatedRecords.push(record);
    });

    onSave(generatedRecords);
    onClose();
  };

  return (
    <div
      id={`${id}-overlay`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-2 overflow-y-auto"
    >
      <div
        id={`${id}-widget`}
        className="relative w-full max-w-5xl bg-slate-50 rounded border border-slate-300 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-2 flex flex-col max-h-[96vh]"
      >
        {/* Header toolbar */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 text-white shrink-0 border-b border-slate-950 select-none">
          <div className="flex items-center gap-1.5">
            <Landmark className="w-4 h-4 text-slate-300" />
            <div>
              <h2 className="text-[11px] font-bold tracking-tight text-white uppercase">
                {editingRecord ? "Edit Perjalanan Dinas" : "Registrasi Perjalanan Dinas"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onClose}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-bold transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold transition-all flex items-center gap-0.5 cursor-pointer"
            >
              <Check className="w-3 h-3" /> Simpan Data
            </button>
          </div>
        </div>

        {/* Info Banner on High tariff lookup rules */}
        {provinsiId && (kabKotaId1 || kabKotaId2 || kabKotaId3) && (
          <div className="bg-amber-50 text-amber-900 px-3 py-1 text-[10px] border-b border-amber-200 leading-none flex items-center gap-1 shrink-0 select-none">
            <Tag className="w-3 h-3 shrink-0 text-amber-600" />
            <span>
              ℹ️ <b>Sistem Integrasi Tarif:</b> Tarif harian ter-otomasi dari nilai tertinggi di antara Kabupaten/Kota yang dipilih.
            </span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-3 overflow-y-auto space-y-3 flex-1 text-slate-700 text-[11px]">
          
          {/* SECTION 1: DATA UTAMA BKU / SP */}
          <div className="bg-white border border-slate-200 rounded p-3 shadow-xs space-y-3">
            <div className="flex items-center gap-1 border-b border-slate-200 pb-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-600" />
              <h3 className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">Data Utama BKU & SP</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Nomor BKU <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Isi nomor BKU..."
                  value={nomorBku}
                  onChange={(e) => setNomorBku(e.target.value)}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-[11px] focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Tanggal BKU <span className="text-rose-500">*</span></label>
                <input
                  type="date"
                  required
                  value={tanggalBku}
                  onChange={(e) => setTanggalBku(e.target.value)}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-[11px] focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Nomor Surat Perintah (SP) <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Isi nomor SP..."
                  value={nomorSp}
                  onChange={(e) => setNomorSp(e.target.value)}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-[11px] focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Tanggal SP <span className="text-rose-500">*</span></label>
                <input
                  type="date"
                  required
                  value={tanggalSp}
                  onChange={(e) => setTanggalSp(e.target.value)}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-[11px] focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-medium"
                />
              </div>
            </div>

            {/* Employee Register Dropdown & Coordinator */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5 flex items-center justify-between">
                  <span>Nama Pegawai (Bisa pilih lebih dari 1) <span className="text-rose-500">*</span></span>
                  {selectedPegawaiIds.length > 1 && (
                    <span className="text-[8.5px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 font-bold active-pulse">
                      Mode Multi-Log Aktif!
                    </span>
                  )}
                </label>
                <SearchableMultiSelect
                  id="form-pegawai-multiselect"
                  options={pegawaiList.map((p) => ({ id: p.id, label: p.nama, sublabel: `NIP: ${p.nip} | ${p.jabatan}` }))}
                  value={selectedPegawaiIds}
                  onChange={(val) => setSelectedPegawaiIds(val)}
                  placeholder="-- Pilih Pegawai --"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Nama Koordinator <span className="text-rose-500">*</span></label>
                <SearchableSelect
                  id="form-koordinator-select"
                  options={pegawaiList.map((p) => ({ id: p.id, label: p.nama, sublabel: p.jabatan }))}
                  value={koordinatorId}
                  onChange={(val) => setKoordinatorId(val)}
                  placeholder="-- Pilih Koordinator --"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: DESTINASI KAB/KOTA & TUJUAN */}
          <div className="bg-white border border-slate-200 rounded p-3 shadow-xs space-y-3">
            <div className="flex items-center gap-1 border-b border-slate-200 pb-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-600" />
              <h3 className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">Wilayah Provinsi & Kabupaten / Kota Tujuan</h3>
            </div>

            {/* Province selection */}
            <div className="w-full md:w-1/3">
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Provinsi Tujuan <span className="text-rose-500">*</span></label>
              <SearchableSelect
                id="form-provinsi-select"
                options={provinsiList.map((p) => ({ id: p.id, label: p.nama }))}
                value={provinsiId}
                onChange={(val) => {
                  setProvinsiId(val);
                  setKabKotaId1("");
                  setKabKotaId2("");
                  setKabKotaId3("");
                }}
                placeholder="-- Pilih Provinsi --"
              />
            </div>

            {/* 3 City selectors + specific spot selectors */}
            <div className="border border-slate-200 bg-slate-50/50 rounded p-2.5 grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* City 1 */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider pb-0.5 border-b border-slate-200">
                  📍 Destinasi ke-1
                </div>
                <div>
                  <label className="block text-[9.5px] font-semibold text-slate-500 mb-0.5">Kab/Kota ke-1 <span className="text-rose-500">*</span></label>
                  <SearchableSelect
                    id="form-kabkota-1-select"
                    disabled={!provinsiId}
                    options={filteredKabKotaList.map((c) => ({ id: c.id, label: c.nama }))}
                    value={kabKotaId1}
                    onChange={(val) => setKabKotaId1(val)}
                    placeholder="-- Pilih Kab/Kota 1 --"
                  />
                </div>
                <div>
                  <label className="block text-[9.5px] font-semibold text-slate-500 mb-0.5">Tempat Tujuan ke-1 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Contoh: Kantor Dinas A..."
                    value={tujuan1}
                    onChange={(e) => setTujuan1(e.target.value)}
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-[11px] focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-medium"
                  />
                </div>
              </div>

              {/* City 2 */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-slate-705 uppercase tracking-wider pb-0.5 border-b border-slate-200">
                  📍 Destinasi ke-2 (Opsional)
                </div>
                <div>
                  <label className="block text-[9.5px] font-semibold text-slate-500 mb-0.5">Kab/Kota ke-2</label>
                  <SearchableSelect
                    id="form-kabkota-2-select"
                    disabled={!provinsiId}
                    options={filteredKabKotaList.map((c) => ({ id: c.id, label: c.nama }))}
                    value={kabKotaId2}
                    onChange={(val) => setKabKotaId2(val)}
                    placeholder="-- Pilih Kab/Kota 2 --"
                  />
                </div>
                <div>
                  <label className="block text-[9.5px] font-semibold text-slate-500 mb-0.5">Tempat Tujuan ke-2</label>
                  <input
                    type="text"
                    placeholder="Contoh: Kantor Dinas B..."
                    value={tujuan2}
                    onChange={(e) => setTujuan2(e.target.value)}
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-[11px] focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-medium"
                  />
                </div>
              </div>

              {/* City 3 */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-slate-705 uppercase tracking-wider pb-0.5 border-b border-slate-200">
                  📍 Destinasi ke-3 (Opsional)
                </div>
                <div>
                  <label className="block text-[9.5px] font-semibold text-slate-500 mb-0.5">Kab/Kota ke-3</label>
                  <SearchableSelect
                    id="form-kabkota-3-select"
                    disabled={!provinsiId}
                    options={filteredKabKotaList.map((c) => ({ id: c.id, label: c.nama }))}
                    value={kabKotaId3}
                    onChange={(val) => setKabKotaId3(val)}
                    placeholder="-- Pilih Kab/Kota 3 --"
                  />
                </div>
                <div>
                  <label className="block text-[9.5px] font-semibold text-slate-500 mb-0.5">Tempat Tujuan ke-3</label>
                  <input
                    type="text"
                    placeholder="Contoh: Kantor Dinas C..."
                    value={tujuan3}
                    onChange={(e) => setTujuan3(e.target.value)}
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-[11px] focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: PERIODE, TARIF & KEUANGAN */}
          <div className="bg-white border border-slate-200 rounded p-3 shadow-xs space-y-3">
            <div className="flex items-center gap-1 border-b border-slate-200 pb-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-600" />
              <h3 className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">Periode, Jenis Perjalanan, & Keuangan</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Jenis Perjalanan <span className="text-rose-500">*</span></label>
                <SearchableSelect
                  id="form-jenisperjalanan-select"
                  options={jenisPerjalananList.map((j) => ({ id: j.id, label: j.nama }))}
                  value={jenisPerjalananId}
                  onChange={(val) => setJenisPerjalananId(val)}
                  placeholder="-- Pilih Jenis Perjalanan --"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Tanggal Berangkat <span className="text-rose-500">*</span></label>
                <input
                  type="date"
                  required
                  value={tanggalBerangkat}
                  onChange={(e) => setTanggalBerangkat(e.target.value)}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-[11px] focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Tanggal Kembali <span className="text-rose-500">*</span></label>
                <input
                  type="date"
                  required
                  value={tanggalKembali}
                  onChange={(e) => setTanggalKembali(e.target.value)}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-[11px] focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 pt-1">
              <div className="bg-slate-50 border border-slate-200 rounded p-1.5 text-center flex flex-col justify-center">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Lama Hari</div>
                <div className="text-sm font-black text-slate-800 font-mono leading-none mt-0.5">{hari} <span className="text-[9px] text-slate-400 font-sans font-medium">Hari</span></div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Tarif Harian (Rp)</label>
                <input
                  type="text"
                  placeholder="0"
                  value={formatRupiah(tarifAcuan)}
                  onChange={(e) => setTarifAcuan(Number(parseRupiah(e.target.value)))}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-[11px] focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-bold text-emerald-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Uang Saku (Rp)</label>
                <input
                  type="text"
                  placeholder="0"
                  value={formatRupiah(uangSaku)}
                  onChange={(e) => setUangSaku(Number(parseRupiah(e.target.value)))}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-[11px] focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-bold text-slate-700 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Uang Representatif (Rp)</label>
                <input
                  type="text"
                  placeholder="0"
                  value={formatRupiah(uangRepresentatif)}
                  onChange={(e) => setUangRepresentatif(Number(parseRupiah(e.target.value)))}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-[11px] focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-bold text-slate-700 font-mono"
                />
              </div>
            </div>

            {/* Option 3: Split Harian Toggle and Panel if multiple destinations are active */}
            {(kabKotaId1 || kabKotaId2 || kabKotaId3) && (
              <div className="border border-slate-200 rounded p-2.5 bg-slate-50 space-y-2 text-[10.5px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      id="toggle-split-harian"
                      checked={isSplitHarian}
                      onChange={(e) => setIsSplitHarian(e.target.checked)}
                      className="w-3.5 h-3.5 text-sky-600 rounded border-slate-300 focus:ring-sky-505 cursor-pointer"
                    />
                    <label htmlFor="toggle-split-harian" className="font-bold text-slate-700 cursor-pointer select-none">
                      Uraikan Hari & Tarif Berbeda Per Lokasi (Opsi 3)
                    </label>
                  </div>
                  {isSplitHarian && (
                    <div className="text-[9.5px]/none font-bold text-sky-700 bg-sky-100/60 border border-sky-100 px-2 py-0.5 rounded">
                      Distribusi Hari: {hariDest1 + hariDest2 + hariDest3} / {hari} Hari
                    </div>
                  )}
                </div>

                {isSplitHarian && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 border-t border-slate-200">
                    {/* Destination 1 */}
                    {kabKotaId1 && (
                      <div className="bg-white p-2 rounded border border-slate-200 space-y-1.5 shadow-xs">
                        <div className="font-bold text-slate-800 text-[10px] truncate max-w-full">
                          🏢 {kabKotaList.find((c) => c.id === kabKotaId1)?.nama || "Lokasi 1"}
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          <div>
                            <label className="block text-[8.5px] font-semibold text-slate-400">Lama Hari</label>
                            <input
                              type="number"
                              min="0"
                              value={hariDest1 || 0}
                              onChange={(e) => setHariDest1(Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-full h-7 px-1.5 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-mono text-center"
                            />
                          </div>
                          <div>
                            <label className="block text-[8.5px] font-semibold text-slate-400">Tarif (Rp)</label>
                            <input
                              type="text"
                              value={formatRupiah(tarifDest1)}
                              onChange={(e) => setTarifDest1(Number(parseRupiah(e.target.value)))}
                              className="w-full h-7 px-1.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-mono text-right"
                            />
                          </div>
                        </div>
                        <div className="text-right font-bold text-emerald-600 text-[9.5px] font-mono">
                          Rp {(hariDest1 * tarifDest1).toLocaleString("id-ID")}
                        </div>
                      </div>
                    )}

                    {/* Destination 2 */}
                    {kabKotaId2 && (
                      <div className="bg-white p-2 rounded border border-slate-200 space-y-1.5 shadow-xs">
                        <div className="font-bold text-slate-800 text-[10px] truncate max-w-full">
                          🏢 {kabKotaList.find((c) => c.id === kabKotaId2)?.nama || "Lokasi 2"}
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          <div>
                            <label className="block text-[8.5px] font-semibold text-slate-400">Lama Hari</label>
                            <input
                              type="number"
                              min="0"
                              value={hariDest2 || 0}
                              onChange={(e) => setHariDest2(Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-full h-7 px-1.5 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-mono text-center"
                            />
                          </div>
                          <div>
                            <label className="block text-[8.5px] font-semibold text-slate-400">Tarif (Rp)</label>
                            <input
                              type="text"
                              value={formatRupiah(tarifDest2)}
                              onChange={(e) => setTarifDest2(Number(parseRupiah(e.target.value)))}
                              className="w-full h-7 px-1.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-mono text-right"
                            />
                          </div>
                        </div>
                        <div className="text-right font-bold text-emerald-600 text-[9.5px] font-mono">
                          Rp {(hariDest2 * tarifDest2).toLocaleString("id-ID")}
                        </div>
                      </div>
                    )}

                    {/* Destination 3 */}
                    {kabKotaId3 && (
                      <div className="bg-white p-2 rounded border border-slate-200 space-y-1.5 shadow-xs">
                        <div className="font-bold text-slate-800 text-[10px] truncate max-w-full">
                          🏢 {kabKotaList.find((c) => c.id === kabKotaId3)?.nama || "Lokasi 3"}
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          <div>
                            <label className="block text-[8.5px] font-semibold text-slate-400">Lama Hari</label>
                            <input
                              type="number"
                              min="0"
                              value={hariDest3 || 0}
                              onChange={(e) => setHariDest3(Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-full h-7 px-1.5 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-mono text-center"
                            />
                          </div>
                          <div>
                            <label className="block text-[8.5px] font-semibold text-slate-400">Tarif (Rp)</label>
                            <input
                              type="text"
                              value={formatRupiah(tarifDest3)}
                              onChange={(e) => setTarifDest3(Number(parseRupiah(e.target.value)))}
                              className="w-full h-7 px-1.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-mono text-right"
                            />
                          </div>
                        </div>
                        <div className="text-right font-bold text-emerald-600 text-[9.5px] font-mono">
                          Rp {(hariDest3 * tarifDest3).toLocaleString("id-ID")}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Total basic calculations info */}
            <div className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-right text-[10px]">
              <span className="text-slate-500 font-semibold select-none">
                {isSplitHarian ? (
                  <>
                    Total Pendapatan Harian Pokok (Rincian Opsi 3):
                    <span className="text-slate-400 font-normal ml-1 mr-1">
                      {[
                        hariDest1 > 0 ? `(${hariDest1} Hari x Rp ${tarifDest1.toLocaleString("id-ID")})` : null,
                        hariDest2 > 0 ? `(${hariDest2} Hari x Rp ${tarifDest2.toLocaleString("id-ID")})` : null,
                        hariDest3 > 0 ? `(${hariDest3} Hari x Rp ${tarifDest3.toLocaleString("id-ID")})` : null,
                      ].filter(Boolean).join(" + ") || "0"}
                    </span>
                  </>
                ) : (
                  `Total Pendapatan Harian Pokok (${hari} Hari * Rp ${tarifAcuan.toLocaleString("id-ID")}):`
                )}
              </span>
              <span className="font-bold text-slate-800 font-mono text-[11.5px] ml-1">
                Rp {hitungTotalHarian().toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          {/* SECTION 4: BUDGET & CODES */}
          <div className="bg-white border border-slate-200 rounded p-3 shadow-xs space-y-3">
            <div className="flex items-center gap-1 border-b border-slate-200 pb-1.5">
              <Landmark className="w-3.5 h-3.5 text-slate-600" />
              <h3 className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">Klasifikasi Kegiatan & Kodering Belanja</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Sub Kegiatan <span className="text-rose-500">*</span></label>
                <SearchableSelect
                  id="form-subkegiatan-select"
                  options={subKegiatanList.map((s) => ({
                    id: s.id,
                    label: s.nama,
                    sublabel: s.kode,
                  }))}
                  value={subKegiatanId}
                  onChange={(val) => setSubKegiatanId(val)}
                  placeholder="-- Pilih Sub Kegiatan --"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Kodering Rekening <span className="text-rose-500">*</span></label>
                <SearchableSelect
                  id="form-kodering-select"
                  options={koderingList.map((k) => ({
                    id: k.id,
                    label: k.nama,
                    sublabel: k.kode,
                  }))}
                  value={koderingId}
                  onChange={(val) => setKoderingId(val)}
                  placeholder="-- Pilih Kodering --"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Uraian / Maksud Perjalanan Dinas <span className="text-rose-500">*</span></label>
              <textarea
                rows={2}
                placeholder="Contoh: Mengadakan koordinasi konsolidasi BAPOR KORPRI terkait rencana pelaksanaan PORPEMDA..."
                value={uraianPrj}
                onChange={(e) => setUraianPrj(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded text-[11px] focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-medium resize-none shadow-xs"
              />
            </div>
          </div>

          {/* WARNING LABEL FOR COMPANION CLAIM SPLIT */}
          {selectedPegawaiIds.length > 1 && (
            <div className="bg-emerald-50 border border-emerald-100 rounded p-2 text-[10px] text-emerald-850 leading-normal font-medium select-none">
              💡 <b>Informasi Alokasi Klaim Biaya:</b> Anda memilih {selectedPegawaiIds.length} pegawai. Sesuai dengan spesifikasi, detail <b>Biaya BBM</b>, <b>Biaya Transportasi</b>, dan <b>Biaya Hotel</b> di bawah ini <b>HANYA</b> akan diterpelihara di baris milik pegawai pertama: <span className="underline font-bold">{(pegawaiList.find(p => p.id === selectedPegawaiIds[0])?.nama || "Pegawai 1")}</span>. Pegawai pendamping lainnya akan terbagi otomatis tanpa membawa claim tagihan akomodasi/transmisi.
            </div>
          )}

          {/* SECTION 5: EXTRA CLAIMS (BBM, TRANSPORTATION, ACCOMMODATION / HOTEL) */}
          <div className="grid grid-cols-1 gap-6">
            
            {/* BBM EXTRA CLAIMS CONTAINER */}
            <div className="bg-white border border-slate-200/60 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="p-1 px-2.5 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-lg uppercase tracking-wide">BBM</span>
                  <h3 className="font-bold text-slate-800 text-[12px]">Rincian Biaya BBM</h3>
                </div>
                <button
                  type="button"
                  onClick={handleAddBBM}
                  className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-600 hover:bg-emerald-100 transition-all rounded-lg text-[10.5px] font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah BBM
                </button>
              </div>

              {rincianBBM.length > 0 ? (
                <div className="space-y-3.5">
                  {rincianBBM.map((row, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-100 bg-slate-50/50 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-end relative"
                    >
                      <div className="flex-1 min-w-[150px]">
                        <label className="block font-bold text-slate-500 text-[10px] uppercase mb-1.5">Jenis Bahan Bakar</label>
                        <SearchableSelect
                          id={`bbm-row-${idx}-select`}
                          options={jenisBBMList.map((f) => ({ 
                             id: f.id, 
                             label: `${f.nama} (Rp ${f.hargaPerLiter ? f.hargaPerLiter.toLocaleString("id-ID") : "0"}/L)` 
                          }))}
                          value={row.jenisBBMId}
                          onChange={(val) => handleUpdateBbmRow(idx, { jenisBBMId: val })}
                          placeholder="Pilih Bahan Bakar"
                        />
                      </div>

                      <div className="w-40">
                        <label className="block font-bold text-slate-500 text-[10px] uppercase mb-1.5">Harga / Liter (Rp)</label>
                        <input
                          type="text"
                          value={formatRupiah(row.hargaPerLiter)}
                          onChange={(e) => handleUpdateBbmRow(idx, { hargaPerLiter: Number(parseRupiah(e.target.value)) })}
                          className="w-full h-8 px-2 bg-white border border-slate-300 rounded outline-none font-bold text-slate-800 font-mono text-[11px]"
                        />
                      </div>

                      <div className="w-44">
                        <label className="block font-bold text-slate-500 text-[10px] uppercase mb-1.5">Total Belanja BBM (Rp)</label>
                        <input
                          type="text"
                          value={formatRupiah(row.totalBeli)}
                          placeholder="0"
                          onChange={(e) => handleUpdateBbmRow(idx, { totalBeli: Number(parseRupiah(e.target.value)) })}
                          className="w-full h-8 px-2 bg-white border border-slate-300 rounded outline-none font-bold text-emerald-600 font-mono text-[11px]"
                        />
                      </div>

                      <div className="bg-white border border-slate-300 px-3 h-8 rounded flex flex-col justify-center text-center shrink-0 min-w-[90px]">
                        <div className="text-[8px] font-bold text-slate-400 uppercase leading-none">Liter Terhitung</div>
                        <div className="font-bold text-[10.5px] text-slate-700 font-mono leading-tight mt-0.5">{row.liter} L</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveBBM(idx)}
                        className="h-8 w-8 flex items-center justify-center bg-rose-50 text-rose-500 hover:bg-rose-100 rounded border border-rose-200 cursor-pointer shrink-0 transition-all hover:scale-105 active:scale-95"
                        title="Delete BBM Row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-slate-400 font-medium select-none text-[11px]">
                  Tidak ada bensin/BBM untuk perjalanan dinas ini
                </div>
              )}
            </div>

            {/* TRANSPORTATION EXTRA CLAIMS CONTAINER */}
            <div className="bg-white border border-slate-200/60 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="p-1 px-2.5 bg-rose-50 text-rose-600 text-[11px] font-bold rounded-lg uppercase tracking-wide">Transport</span>
                  <h3 className="font-bold text-slate-800 text-[12px]">Rincian Biaya Tiket & Tol</h3>
                </div>
                <button
                  type="button"
                  onClick={handleAddTransport}
                  className="px-3.5 py-1.5 bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition-all rounded-lg text-[10.5px] font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Transport
                </button>
              </div>

              {rincianTransport.length > 0 ? (
                <div className="space-y-3.5">
                  {rincianTransport.map((row, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-100 bg-slate-50/50 rounded-xl p-4 grid grid-cols-2 md:grid-cols-7 gap-3 items-end relative"
                    >
                      <div className="col-span-2">
                        <label className="block font-bold text-slate-500 text-[10px] uppercase mb-1.5">Jenis Transportasi</label>
                        <SearchableSelect
                          id={`trans-row-${idx}-select`}
                          options={jenisTransportasiList.map((t) => ({ id: t.id, label: t.nama }))}
                          value={row.jenisTransportasiId}
                          onChange={(val) => handleUpdateTransportRow(idx, { jenisTransportasiId: val })}
                          placeholder="Pilih Transportasi"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-500 text-[9.5px] uppercase mb-1.5">Biaya Tol (Rp)</label>
                        <input
                          type="text"
                          value={formatRupiah(row.biayaTol)}
                          placeholder="0"
                          onChange={(e) => handleUpdateTransportRow(idx, { biayaTol: Number(parseRupiah(e.target.value)) })}
                          className="w-full h-8 px-2 bg-white border border-slate-300 rounded outline-none font-bold text-slate-800 font-mono text-[11px]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-500 text-[9.5px] uppercase mb-1.5">Travel (Rp)</label>
                        <input
                          type="text"
                          value={formatRupiah(row.biayaTravel)}
                          placeholder="0"
                          onChange={(e) => handleUpdateTransportRow(idx, { biayaTravel: Number(parseRupiah(e.target.value)) })}
                          className="w-full h-8 px-2 bg-white border border-slate-300 rounded outline-none font-bold text-slate-800 font-mono text-[11px]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-500 text-[9.5px] uppercase mb-1.5">Kereta Api (Rp)</label>
                        <input
                          type="text"
                          value={formatRupiah(row.biayaKereta)}
                          placeholder="0"
                          onChange={(e) => handleUpdateTransportRow(idx, { biayaKereta: Number(parseRupiah(e.target.value)) })}
                          className="w-full h-8 px-2 bg-white border border-slate-300 rounded outline-none font-bold text-slate-800 font-mono text-[11px]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-500 text-[9.5px] uppercase mb-1.5">Pesawat/Ferry (Rp)</label>
                        <input
                          type="text"
                          value={formatRupiah(row.biayaPesawat)}
                          placeholder="0"
                          onChange={(e) => handleUpdateTransportRow(idx, { biayaPesawat: Number(parseRupiah(e.target.value)) })}
                          className="w-full h-8 px-2 bg-white border border-slate-300 rounded outline-none font-bold text-slate-800 font-mono text-[11px]"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-full">
                          <label className="block font-bold text-slate-500 text-[9.5px] uppercase mb-1.5">[Total Tiket]</label>
                          <div className="h-8 bg-white border border-slate-300 rounded flex items-center justify-center font-bold text-amber-600 font-mono text-[11px]">
                            {(row.biayaTol + row.biayaTravel + row.biayaKereta + row.biayaPesawat).toLocaleString("id-ID")}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveTransport(idx)}
                          className="h-8 w-8 flex items-center justify-center bg-rose-50 text-rose-500 hover:bg-rose-100 rounded border border-rose-200 cursor-pointer shrink-0 transition-all hover:scale-105 active:scale-95"
                          title="Delete Transportations"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-slate-400 font-medium select-none text-[11px]">
                  Tidak ada biaya transportasi khusus terlampir
                </div>
              )}
            </div>

            {/* HOTEL EXTRA CLAIMS CONTAINER */}
            <div className="bg-white border border-slate-200/60 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="p-1 px-2.5 bg-amber-50 text-amber-600 text-[11px] font-bold rounded-lg uppercase tracking-wide">Akomodasi</span>
                  <h3 className="font-bold text-slate-800 text-[12px]">Rincian Penginapan Hotel</h3>
                </div>
                <button
                  type="button"
                  onClick={handleAddHotel}
                  className="px-3.5 py-1.5 bg-amber-50 border border-amber-200 text-amber-600 hover:bg-amber-100 transition-all rounded-lg text-[10.5px] font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Hotel
                </button>
              </div>

              {rincianHotel.length > 0 ? (
                <div className="space-y-3.5">
                  {rincianHotel.map((row, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-100 bg-slate-50/50 rounded-xl p-4 grid grid-cols-2 md:grid-cols-7 gap-3 items-end relative"
                    >
                      <div className="col-span-2">
                        <label className="block font-bold text-slate-500 text-[10px] uppercase mb-1.5">Nama Penginapan Hotel</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Hotel Mercure Bandung"
                          value={row.namaHotel}
                          onChange={(e) => handleUpdateHotelRow(idx, { namaHotel: e.target.value })}
                          className="w-full h-8 px-2 bg-white border border-slate-300 rounded outline-none font-bold text-slate-700 text-[11px]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-500 text-[9.5px] uppercase mb-1.5">Harga / Malam (Rp)</label>
                        <input
                          type="text"
                          placeholder="0"
                          value={formatRupiah(row.hargaPerMalam)}
                          onChange={(e) => handleUpdateHotelRow(idx, { hargaPerMalam: Number(parseRupiah(e.target.value)) })}
                          className="w-full h-8 px-2 bg-white border border-slate-300 rounded outline-none font-bold text-slate-800 font-mono text-[11px]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-500 text-[9.5px] uppercase mb-1.5">Jumlah (Mlm)</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={row.malam || ""}
                          onChange={(e) => handleUpdateHotelRow(idx, { malam: Number(e.target.value) })}
                          className="w-full h-8 px-2 bg-white border border-slate-300 rounded outline-none font-bold text-slate-800 font-mono text-[11px]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-500 text-[9.5px] uppercase mb-1.5">Nama Tamu & No Kamar</label>
                        <input
                          type="text"
                          placeholder="Jefri - Kamar 402"
                          value={row.namaMenginap}
                          onChange={(e) => handleUpdateHotelRow(idx, { namaMenginap: e.target.value })}
                          className="w-full h-8 px-2 bg-white border border-slate-300 rounded outline-none font-medium text-[11px]"
                        />
                      </div>

                      <div className="col-span-2 flex items-center gap-2">
                        <div className="w-full">
                          <label className="block font-bold text-slate-500 text-[9.5px] uppercase mb-1.5">[Total Hotel]</label>
                          <div className="h-8 bg-white border border-slate-300 rounded flex items-center justify-center font-bold text-emerald-600 font-mono text-[11px]">
                            Rp {row.total.toLocaleString("id-ID")}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveHotel(idx)}
                          className="h-8 w-8 flex items-center justify-center bg-rose-50 text-rose-500 hover:bg-rose-100 rounded border border-rose-200 cursor-pointer shrink-0 transition-all hover:scale-105 active:scale-95"
                          title="Hapus Hotel Row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-slate-400 font-medium select-none text-[11px]">
                  Tidak ada hotel terlampir
                </div>
              )}
            </div>
          </div>

          {/* DYNAMIC FOOTER GRAND TOTAL DISPLAY */}
          <div className="bg-slate-900 border border-slate-950 text-white rounded p-3 shadow-xs flex flex-col md:flex-row items-center justify-between gap-2 select-none">
            <div className="text-center md:text-left">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alokasi Klaim Anggaran (Pegawai Pertama)</div>
              <div className="text-[10px] text-slate-300 mt-0.5 leading-normal">
                Uang Harian Pokok + Saku + BBM ({hitungSubsumBBM().toLocaleString("id-ID")}) + Transport ({hitungSubsumTransport().toLocaleString("id-ID")}) + Hotel ({hitungSubsumHotel().toLocaleString("id-ID")})
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="text-center md:text-right">
                <div className="text-[9.5px] text-slate-400 uppercase font-bold">Grand Total Estimasi</div>
                <div className="text-base font-black text-amber-400 font-mono tracking-wide">
                  Rp {hitungTotalBiayaPertamaSeluruhnya().toLocaleString("id-ID")}
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 h-9 bg-slate-800 hover:bg-slate-705 text-slate-300 text-[11.5px] font-bold rounded-lg transition-all border border-slate-700 hover:border-slate-600 cursor-pointer shadow-2xs active:scale-[97%]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4.5 h-9 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-[11.5px] font-black rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950/20 active:scale-[97%]"
                >
                  <Check className="w-4 h-4 text-emerald-100 stroke-[3]" /> Simpan Form Data
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
