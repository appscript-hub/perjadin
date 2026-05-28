/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Settings,
  Coins,
  Users,
  Plus,
  Trash2,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  Database,
  MapPin,
  Flame,
  Plane,
  Home,
  Menu,
  FileCheck,
  CheckCircle2,
  ExternalLink
} from "lucide-react";

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
} from "./types";

import { ReferenceModal } from "./components/ReferenceModal";
import { TarifModal } from "./components/TarifModal";
import { PegawaiModal } from "./components/PegawaiModal";
import { PerjalananFormModal } from "./components/PerjalananFormModal";
import * as XLSX from "xlsx";
import { showToast, confirmAlert } from "./lib/swal";

// --- PRE-LOADED DEMO DATA FOR REALISTIC PORTAL LOOK UP ON MOUNT ---
const INITIAL_PROVINSI: Provinsi[] = [
  { id: "prov-1", nama: "Jawa Barat" },
  { id: "prov-2", nama: "Bali" },
  { id: "prov-3", nama: "DKI Jakarta" },
  { id: "prov-4", nama: "Banten" },
  { id: "prov-5", nama: "Bangka Belitung" },
];

const INITIAL_KABKOTA: KabKota[] = [
  { id: "kab-1", provinsiId: "prov-1", nama: "Kabupaten Bandung" },
  { id: "kab-2", provinsiId: "prov-1", nama: "Kabupaten Bandung Barat" },
  { id: "kab-3", provinsiId: "prov-1", nama: "Kabupaten Majalengka" },
  { id: "kab-4", provinsiId: "prov-1", nama: "Kota Bandung" },
  { id: "kab-5", provinsiId: "prov-1", nama: "Kabupaten Bekasi" },
  { id: "kab-6", provinsiId: "prov-2", nama: "Badung" },
  { id: "kab-7", provinsiId: "prov-2", nama: "Gianyar" },
  { id: "kab-8", provinsiId: "prov-3", nama: "Jakarta Pusat" },
];

const INITIAL_JENIS_PRJ: JenisPerjalanan[] = [
  { id: "jp-1", nama: "Perjalanan Dinas Biasa" },
  { id: "jp-2", nama: "Perjalanan Dinas Dalam Kota" },
  { id: "jp-3", nama: "Fullboard/Residence" },
  { id: "jp-4", nama: "Fullday/Halfday" },
  { id: "jp-5", nama: "Diklat" },
];

const INITIAL_SUB_KEGIATAN: SubKegiatan[] = [
  { id: "sub-1", kode: "5.03.02.1.01.0003", nama: "Koordinasi dan Fasilitasi Pengadaan PNS dan PPPK" },
  { id: "sub-2", kode: "5.03.02.1.01.0006", nama: "Koordinasi Pelaksanaan Administrasi Pemberhentian PNS" },
  { id: "sub-3", kode: "5.03.02.1.01.0008", nama: "Fasilitasi Lembaga Profesi ASN" },
  { id: "sub-4", kode: "5.03.02.1.01.0010", nama: "Penggelolaan Sistem Informasi Kepegawaian" },
];

const INITIAL_KODERING: Kodering[] = [
  { id: "kod-1", kode: "5.1.02.04.001.00001", nama: "Belanja Perjalanan Dinas Biasa" },
  { id: "kod-2", kode: "5.1.02.04.001.00002", nama: "Belanja Perjalanan Dinas Dalam Kota" },
];

const INITIAL_BBM: JenisBBM[] = [
  { id: "bbm-1", nama: "Pertalite", hargaPerLiter: 10000 },
  { id: "bbm-2", nama: "Pertamax", hargaPerLiter: 12500 },
  { id: "bbm-3", nama: "Solar", hargaPerLiter: 6800 },
  { id: "bbm-4", nama: "Solar Dex", hargaPerLiter: 13005 },
  { id: "bbm-5", nama: "Shell Super", hargaPerLiter: 14000 },
];

const INITIAL_TRANSPORT: JenisTransportasi[] = [
  { id: "tr-1", nama: "Transportasi Darat" },
  { id: "tr-2", nama: "Transportasi Laut" },
  { id: "tr-3", nama: "Transportasi Udara" },
];

const INITIAL_PEGAWAI: Pegawai[] = [
  {
    id: "peg-1",
    nama: "TUBAGUS MUCHAMAD JEFRI KARTAJUMENA, S.H., M.M.",
    nip: "198710262009022002",
    pangkat: "Penata Muda Tingkat I / III.b",
    jabatan: "Perencana Ahli Pertama",
  },
  {
    id: "peg-2",
    nama: "Drs. HERRI NOVEDIA, M.M.",
    nip: "198010262012021002",
    pangkat: "Penata / III.c",
    jabatan: "Analis Sumber Daya Manusia",
  },
  {
    id: "peg-3",
    nama: "EGI HARYADI AMMOER, SE, M.M",
    nip: "198903082011011004",
    pangkat: "Penata Muda / III.a",
    jabatan: "Analis Kebijakan Ahli",
  },
  {
    id: "peg-4",
    nama: "TITTA MAULINA, S.ST",
    nip: "197501122009011001",
    pangkat: "Pembina / IV.a",
    jabatan: "Kepala Bidang Pengadaan",
  },
  {
    id: "peg-5",
    nama: "DEINAR ROBIAHIRUDIN, S.H., M.H",
    nip: "199406232016091001",
    pangkat: "Penata / III.c",
    jabatan: "Analis Jabatan Ahli",
  },
  {
    id: "peg-6",
    nama: "AHMAD SONI JULPIKAR, S.Kom, M.Kom",
    nip: "199105152019031002",
    pangkat: "Penata Muda / III.a",
    jabatan: "Pranata Komputer Madya",
  },
];

const INITIAL_TARIF: TarifUangHarian[] = [
  {
    id: "tar-1",
    tahun: "2025",
    provinsiId: "prov-1",
    kabKotaId: "kab-1",
    jenisPerjalananId: "jp-1",
    tarif: 430000,
  },
  {
    id: "tar-2",
    tahun: "2025",
    provinsiId: "prov-1",
    kabKotaId: "kab-2",
    jenisPerjalananId: "jp-1",
    tarif: 430000,
  },
  {
    id: "tar-3",
    tahun: "2025",
    provinsiId: "prov-1",
    kabKotaId: "kab-3",
    jenisPerjalananId: "jp-1",
    tarif: 430000,
  },
  {
    id: "tar-4",
    tahun: "2025",
    provinsiId: "prov-1",
    kabKotaId: "kab-4",
    jenisPerjalananId: "jp-2",
    tarif: 170000,
  },
  {
    id: "tar-5",
    tahun: "2025",
    provinsiId: "prov-1",
    kabKotaId: "kab-5",
    jenisPerjalananId: "jp-1",
    tarif: 430000,
  },
];

const INITIAL_LOGS: PerjalananDinas[] = [
  {
    id: "din-1",
    groupId: "group-demo-1",
    nomorBku: "002/01.08/I",
    tanggalBku: "2025-01-22",
    nomorSp: "87/KO.05.03/PPIK",
    tanggalSp: "2025-01-09",
    koordinatorId: "peg-1",
    pegawaiId: "peg-1",
    isFirstPegawai: true,
    subKegiatanId: "sub-3",
    koderingId: "kod-1",
    uraianPrj: "Koordinasi dan konsolidasi BAPOR KORPRI terkait rencana pelaksanaan PORPEMDA ke Dispora Kab. Bandung",
    provinsiId: "prov-1",
    kabKotaId1: "kab-1",
    tujuan1: "Dispora Kab. Bandung",
    jenisPerjalananId: "jp-1",
    tanggalBerangkat: "2025-01-09",
    tanggalKembali: "2025-01-09",
    hari: 1,
    tarif: 430000,
    uangSaku: 0,
    uangRepresentatif: 0,
    totalUang: 554000, // 430000 (hari * tarif) + 124000 (gas & tol)
    rincianBBM: [
      {
        jenisBBMId: "bbm-2",
        hargaPerLiter: 12500,
        totalBeli: 100000,
        liter: 8,
      },
    ],
    rincianTransport: [
      {
        jenisTransportasiId: "tr-1",
        biayaTol: 24000,
        biayaTravel: 0,
        biayaKereta: 0,
        biayaPesawat: 0,
        biayaFerry: 0,
      },
    ],
    rincianHotel: [],
  },
  {
    id: "din-2",
    groupId: "group-demo-1",
    nomorBku: "002/01.08/I",
    tanggalBku: "2025-01-22",
    nomorSp: "87/KO.05.03/PPIK",
    tanggalSp: "2025-01-09",
    koordinatorId: "peg-1",
    pegawaiId: "peg-2",
    isFirstPegawai: false,
    subKegiatanId: "sub-3",
    koderingId: "kod-1",
    uraianPrj: "Koordinasi dan konsolidasi BAPOR KORPRI terkait rencana pelaksanaan PORPEMDA ke Dispora Kab. Bandung",
    provinsiId: "prov-1",
    kabKotaId1: "kab-1",
    tujuan1: "Dispora Kab. Bandung",
    jenisPerjalananId: "jp-1",
    tanggalBerangkat: "2025-01-09",
    tanggalKembali: "2025-01-09",
    hari: 1,
    tarif: 430000,
    uangSaku: 0,
    uangRepresentatif: 0,
    totalUang: 430000, // companion gets No fuel/transport expenses!
    rincianBBM: [],
    rincianTransport: [],
    rincianHotel: [],
  },
  {
    id: "din-3",
    groupId: "group-demo-1",
    nomorBku: "002/01.08/I",
    tanggalBku: "2025-01-22",
    nomorSp: "87/KO.05.03/PPIK",
    tanggalSp: "2025-01-09",
    koordinatorId: "peg-1",
    pegawaiId: "peg-3",
    isFirstPegawai: false,
    subKegiatanId: "sub-3",
    koderingId: "kod-1",
    uraianPrj: "Koordinasi dan konsolidasi BAPOR KORPRI terkait rencana pelaksanaan PORPEMDA ke Dispora Kab. Bandung",
    provinsiId: "prov-1",
    kabKotaId1: "kab-1",
    tujuan1: "Dispora Kab. Bandung",
    jenisPerjalananId: "jp-1",
    tanggalBerangkat: "2025-01-09",
    tanggalKembali: "2025-01-09",
    hari: 1,
    tarif: 430000,
    uangSaku: 0,
    uangRepresentatif: 0,
    totalUang: 430000,
    rincianBBM: [],
    rincianTransport: [],
    rincianHotel: [],
  },
  {
    id: "din-4",
    groupId: "group-demo-1",
    nomorBku: "002/01.08/I",
    tanggalBku: "2025-01-22",
    nomorSp: "87/KO.05.03/PPIK",
    tanggalSp: "2025-01-09",
    koordinatorId: "peg-1",
    pegawaiId: "peg-4",
    isFirstPegawai: false,
    subKegiatanId: "sub-3",
    koderingId: "kod-1",
    uraianPrj: "Koordinasi dan konsolidasi BAPOR KORPRI terkait rencana pelaksanaan PORPEMDA ke Dispora Kab. Bandung",
    provinsiId: "prov-1",
    kabKotaId1: "kab-1",
    tujuan1: "Dispora Kab. Bandung",
    jenisPerjalananId: "jp-1",
    tanggalBerangkat: "2025-01-09",
    tanggalKembali: "2025-01-09",
    hari: 1,
    tarif: 430000,
    uangSaku: 0,
    uangRepresentatif: 0,
    totalUang: 430000,
    rincianBBM: [],
    rincianTransport: [],
    rincianHotel: [],
  },
  {
    id: "din-5",
    groupId: "group-demo-1",
    nomorBku: "002/01.08/I",
    tanggalBku: "2025-01-22",
    nomorSp: "87/KO.05.03/PPIK",
    tanggalSp: "2025-01-09",
    koordinatorId: "peg-1",
    pegawaiId: "peg-5",
    isFirstPegawai: false,
    subKegiatanId: "sub-3",
    koderingId: "kod-1",
    uraianPrj: "Koordinasi dan konsolidasi BAPOR KORPRI terkait rencana pelaksanaan PORPEMDA ke Dispora Kab. Bandung",
    provinsiId: "prov-1",
    kabKotaId1: "kab-1",
    tujuan1: "Dispora Kab. Bandung",
    jenisPerjalananId: "jp-1",
    tanggalBerangkat: "2025-01-09",
    tanggalKembali: "2025-01-09",
    hari: 1,
    tarif: 430000,
    uangSaku: 0,
    uangRepresentatif: 0,
    totalUang: 430000,
    rincianBBM: [],
    rincianTransport: [],
    rincianHotel: [],
  },
];

export default function App() {
  // --- DELETE CONFIRM STATES ---
  const [deleteConfirmRowId, setDeleteConfirmRowId] = useState<string | null>(null);
  const [deleteConfirmBulk, setDeleteConfirmBulk] = useState<boolean>(false);

  // --- DATABASE STATES LOADED VIA LOCALSTORAGE OR INITIALS ---
  const [provinsiList, setProvinsiList] = useState<Provinsi[]>(() => {
    const local = localStorage.getItem("db_provinsi");
    return local ? JSON.parse(local) : INITIAL_PROVINSI;
  });

  const [kabKotaList, setKabKotaList] = useState<KabKota[]>(() => {
    const local = localStorage.getItem("db_kabkota");
    return local ? JSON.parse(local) : INITIAL_KABKOTA;
  });

  const [jenisPerjalananList, setJenisPerjalananList] = useState<JenisPerjalanan[]>(() => {
    const local = localStorage.getItem("db_jenisperjalanan");
    return local ? JSON.parse(local) : INITIAL_JENIS_PRJ;
  });

  const [subKegiatanList, setSubKegiatanList] = useState<SubKegiatan[]>(() => {
    const local = localStorage.getItem("db_subkegiatan");
    return local ? JSON.parse(local) : INITIAL_SUB_KEGIATAN;
  });

  const [koderingList, setKoderingList] = useState<Kodering[]>(() => {
    const local = localStorage.getItem("db_kodering");
    return local ? JSON.parse(local) : INITIAL_KODERING;
  });

  const [jenisBBMList, setJenisBBMList] = useState<JenisBBM[]>(() => {
    const local = localStorage.getItem("db_jenisbbm");
    return local ? JSON.parse(local) : INITIAL_BBM;
  });

  const [jenisTransportasiList, setJenisTransportasiList] = useState<JenisTransportasi[]>(() => {
    const local = localStorage.getItem("db_jenistransportasi");
    return local ? JSON.parse(local) : INITIAL_TRANSPORT;
  });

  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>(() => {
    const local = localStorage.getItem("db_pegawai");
    return local ? JSON.parse(local) : INITIAL_PEGAWAI;
  });

  const [tarifList, setTarifList] = useState<TarifUangHarian[]>(() => {
    const local = localStorage.getItem("db_tarif");
    return local ? JSON.parse(local) : INITIAL_TARIF;
  });

  const [perjalananList, setPerjalananList] = useState<PerjalananDinas[]>(() => {
    const local = localStorage.getItem("db_perjalanan");
    return local ? JSON.parse(local) : INITIAL_LOGS;
  });

  const [tahunList, setTahunList] = useState<string[]>(() => {
    const local = localStorage.getItem("db_tahun");
    return local ? JSON.parse(local) : ["2024", "2025", "2026", "2027", "2028"];
  });

  // Keep localStorage updated as states mutate
  useEffect(() => {
    localStorage.setItem("db_tahun", JSON.stringify(tahunList));
  }, [tahunList]);
  useEffect(() => {
    localStorage.setItem("db_provinsi", JSON.stringify(provinsiList));
  }, [provinsiList]);

  useEffect(() => {
    localStorage.setItem("db_kabkota", JSON.stringify(kabKotaList));
  }, [kabKotaList]);

  useEffect(() => {
    localStorage.setItem("db_jenisperjalanan", JSON.stringify(jenisPerjalananList));
  }, [jenisPerjalananList]);

  useEffect(() => {
    localStorage.setItem("db_subkegiatan", JSON.stringify(subKegiatanList));
  }, [subKegiatanList]);

  useEffect(() => {
    localStorage.setItem("db_kodering", JSON.stringify(koderingList));
  }, [koderingList]);

  useEffect(() => {
    localStorage.setItem("db_jenisbbm", JSON.stringify(jenisBBMList));
  }, [jenisBBMList]);

  useEffect(() => {
    localStorage.setItem("db_jenistransportasi", JSON.stringify(jenisTransportasiList));
  }, [jenisTransportasiList]);

  useEffect(() => {
    localStorage.setItem("db_pegawai", JSON.stringify(pegawaiList));
  }, [pegawaiList]);

  useEffect(() => {
    localStorage.setItem("db_tarif", JSON.stringify(tarifList));
  }, [tarifList]);

  useEffect(() => {
    localStorage.setItem("db_perjalanan", JSON.stringify(perjalananList));
  }, [perjalananList]);

  // --- INTERACTION & VISUAL STATES ---
  const [isRefModalOpen, setIsRefModalOpen] = useState(false);
  const [isTarifModalOpen, setIsTarifModalOpen] = useState(false);
  const [isPegawaiModalOpen, setIsPegawaiModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const [editingRecord, setEditingRecord] = useState<PerjalananDinas | null>(null);

  // Pagination & Filtering
  const [searchFilter, setSearchFilter] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Selection states
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // --- ACTION HANDLERS ---
  const handleOpenFormNew = () => {
    setEditingRecord(null);
    setIsFormModalOpen(true);
  };

  const handleOpenFormEdit = (record: PerjalananDinas) => {
    setEditingRecord(record);
    setIsFormModalOpen(true);
  };

  const handleSaveTravelForm = (records: PerjalananDinas[]) => {
    if (editingRecord) {
      // Editing individual record
      const singleItem = records[0];
      setPerjalananList((prev) =>
        prev.map((item) => (item.id === singleItem.id ? { ...singleItem } : item))
      );
      showToast("Data Perjalanan Dinas berhasil diperbarui!", "success");
    } else {
      // Multi employees are inserted
      setPerjalananList((prev) => [...prev, ...records]);
      showToast(`Berhasil menyimpan ${records.length} data Perjalanan Dinas!`, "success");
    }
  };

  const handleDeletePerjalanan = async (item: PerjalananDinas) => {
    const pegawaiName = pegawaiList.find((p) => p.id === item.pegawaiId)?.nama || "Pegawai";
    const isConfirmed = await confirmAlert(
      "Hapus Perjalanan Dinas?",
      `Apakah Anda yakin ingin menghapus data perjalanan dinas untuk "${pegawaiName}" (BKU: ${item.nomorBku || "-"})?`
    );
    if (isConfirmed) {
      setPerjalananList((prev) => prev.filter((it) => it.id !== item.id));
      setSelectedRowIds((prev) => prev.filter((rowId) => rowId !== item.id));
      showToast("Data Perjalanan Dinas berhasil dihapus", "info");
    }
  };

  const handleDeleteBulk = async () => {
    if (selectedRowIds.length === 0) return;
    const isConfirmed = await confirmAlert(
      "Hapus Data Terpilih?",
      `Apakah Anda yakin ingin menghapus ${selectedRowIds.length} data perjalanan dinas yang dicentang secara permanen?`
    );
    if (isConfirmed) {
      setPerjalananList((prev) => prev.filter((item) => !selectedRowIds.includes(item.id)));
      setSelectedRowIds([]);
      setCurrentPage(1);
      showToast(`Berhasil menghapus ${selectedRowIds.length} data perjalanan dinas`, "info");
    }
  };

  // Checkbox row toggler
  const handleToggleSelectRow = (id: string) => {
    if (selectedRowIds.includes(id)) {
      setSelectedRowIds((prev) => prev.filter((rowId) => rowId !== id));
    } else {
      setSelectedRowIds((prev) => [...prev, id]);
    }
  };

  const handleToggleSelectAllOnPage = (pageItems: PerjalananDinas[]) => {
    const pageItemIds = pageItems.map((item) => item.id);
    const allSelectedOnPage = pageItemIds.every((id) => selectedRowIds.includes(id));

    if (allSelectedOnPage) {
      // Unselect all on page
      setSelectedRowIds((prev) => prev.filter((id) => !pageItemIds.includes(id)));
    } else {
      // Select all on page (avoiding duplicate IDs)
      setSelectedRowIds((prev) => {
        const unique = new Set([...prev, ...pageItemIds]);
        return Array.from(unique);
      });
    }
  };

  // --- DYNAMIC XLS/xlsx EXPORT GENERATOR ---
  const handleExportExcel = () => {
    // Columns headers matching the data columns precisely
    const headers = [
      "No",
      "Nomor BKU",
      "Tanggal BKU",
      "Nomor SP",
      "Tanggal SP",
      "Koordinator",
      "Nama Pegawai",
      "NIP Pegawai",
      "Jabatan",
      "Pangkat/Golongan",
      "Sub Kegiatan",
      "Kodering/Belanja",
      "Uraian/Tugas Perjalanan",
      "Provinsi Tujuan",
      
      // Separated Destinasi 1 to 3 & Tempat Tujuan
      "Kabupaten/Kota Tujuan 1",
      "Tempat Tujuan Rinci 1",
      "Kabupaten/Kota Tujuan 2",
      "Tempat Tujuan Rinci 2",
      "Kabupaten/Kota Tujuan 3",
      "Tempat Tujuan Rinci 3",
      
      "Jenis Perjalanan",
      "Tanggal Berangkat",
      "Tanggal Kembali",
      "Lama Hari",
      "Tarif UH Lokasi 1",
      "Tarif UH Lokasi 2",
      "Tarif UH Lokasi 3",
      "Uang Saku (Rp)",
      "Uang Representatif (Rp)",
      
      // BBM Form column breakdown
      "BBM Jenis",
      "BBM Harga / Liter (Rp)",
      "BBM Liter",
      "BBM Total Belanja (Rp)",
      
      // Transports Form column breakdown
      "Transport Jenis",
      "Transport Biaya Tol (Rp)",
      "Transport Travel (Rp)",
      "Transport Kereta Api (Rp)",
      "Transport Pesawat/Ferry (Rp)",
      "Transport Total Tiket (Rp)",
      
      // Akomodasi/Hotel Form column breakdown
      "Hotel Nama",
      "Hotel Harga / Malam (Rp)",
      "Hotel Jumlah Malam",
      "Hotel Nama Tamu & No Kamar",
      "Hotel Total (Rp)",

      "Total Uang Perjalanan (Rp)"
    ];

    // Build values arrays
    const rows = filteredLogs.map((item, index) => {
      const koordinatorName = pegawaiList.find((p) => p.id === item.koordinatorId)?.nama || "-";
      const pegawai = pegawaiList.find((p) => p.id === item.pegawaiId);
      const pegawaiName = pegawai?.nama || "-";
      const pegawaiNip = pegawai?.nip || "-";
      const pangkat = pegawai?.pangkat || "-";
      const jabatan = pegawai?.jabatan || "-";

      const subKeg = subKegiatanList.find((s) => s.id === item.subKegiatanId);
      const subKegLabel = subKeg ? `[${subKeg.kode}] ${subKeg.nama}` : "-";

      const kodering = koderingList.find((k) => k.id === item.koderingId);
      const koderingLabel = kodering ? `[${kodering.kode}] ${kodering.nama}` : "-";

      const provName = provinsiList.find((p) => p.id === item.provinsiId)?.nama || "-";
      const jpName = jenisPerjalananList.find((j) => j.id === item.jenisPerjalananId)?.nama || "-";

      // Destinasi 1 s/d 3
      const dest1City = kabKotaList.find((c) => c.id === item.kabKotaId1)?.nama || "-";
      const dest1Place = item.tujuan1 || "-";

      const dest2City = item.kabKotaId2 ? (kabKotaList.find((c) => c.id === item.kabKotaId2)?.nama || "-") : "-";
      const dest2Place = item.tujuan2 || "-";

      const dest3City = item.kabKotaId3 ? (kabKotaList.find((c) => c.id === item.kabKotaId3)?.nama || "-") : "-";
      const dest3Place = item.tujuan3 || "-";

      // BBM columns breakdown
      const bbmJenisArr = item.rincianBBM?.map((b) => jenisBBMList.find((x) => x.id === b.jenisBBMId)?.nama || "BBM") || [];
      const bbmHargaArr = item.rincianBBM?.map((b) => b.hargaPerLiter) || [];
      const bbmLiterArr = item.rincianBBM?.map((b) => b.liter) || [];
      const bbmTotalArr = item.rincianBBM?.map((b) => b.totalBeli) || [];

      const excelBbmJenis = bbmJenisArr.length > 0 ? bbmJenisArr.join("\n") : "-";
      const excelBbmHarga = bbmHargaArr.length > 0 ? bbmHargaArr.map(val => `Rp ${val.toLocaleString("id-ID")}`).join("\n") : "-";
      const excelBbmLiter = bbmLiterArr.length > 0 ? bbmLiterArr.map(val => `${val} L`).join("\n") : "-";
      const excelBbmTotal = bbmTotalArr.length > 0 ? bbmTotalArr.map(val => `Rp ${val.toLocaleString("id-ID")}`).join("\n") : "-";

      // Transport columns breakdown
      const transJenisArr = item.rincianTransport?.map((t) => jenisTransportasiList.find((x) => x.id === t.jenisTransportasiId)?.nama || "Transportasi") || [];
      const transTolArr = item.rincianTransport?.map((t) => t.biayaTol) || [];
      const transTravelArr = item.rincianTransport?.map((t) => t.biayaTravel) || [];
      const transKeretaArr = item.rincianTransport?.map((t) => t.biayaKereta) || [];
      const transPesawatArr = item.rincianTransport?.map((t) => t.biayaPesawat) || [];
      const transTotalArr = item.rincianTransport?.map((t) => t.biayaTol + t.biayaTravel + t.biayaKereta + t.biayaPesawat) || [];

      const excelTransJenis = transJenisArr.length > 0 ? transJenisArr.join("\n") : "-";
      const excelTransTol = transTolArr.length > 0 ? transTolArr.map(val => `Rp ${val.toLocaleString("id-ID")}`).join("\n") : "-";
      const excelTransTravel = transTravelArr.length > 0 ? transTravelArr.map(val => `Rp ${val.toLocaleString("id-ID")}`).join("\n") : "-";
      const excelTransKereta = transKeretaArr.length > 0 ? transKeretaArr.map(val => `Rp ${val.toLocaleString("id-ID")}`).join("\n") : "-";
      const excelTransPesawat = transPesawatArr.length > 0 ? transPesawatArr.map(val => `Rp ${val.toLocaleString("id-ID")}`).join("\n") : "-";
      const excelTransTotalText = transTotalArr.length > 0 ? transTotalArr.map(val => `Rp ${val.toLocaleString("id-ID")}`).join("\n") : "-";

      // Hotel/Akomodasi columns breakdown
      const hotelNamaArr = item.rincianHotel?.map((h) => h.namaHotel) || [];
      const hotelHargaArr = item.rincianHotel?.map((h) => h.hargaPerMalam) || [];
      const hotelMalamArr = item.rincianHotel?.map((h) => h.malam) || [];
      const hotelTamuArr = item.rincianHotel?.map((h) => `${h.namaMenginap || "-"} (Kamar: ${h.nomorKamar || "-"})`) || [];
      const hotelTotalArr = item.rincianHotel?.map((h) => h.total) || [];

      const excelHotelNama = hotelNamaArr.length > 0 ? hotelNamaArr.join("\n") : "-";
      const excelHotelHarga = hotelHargaArr.length > 0 ? hotelHargaArr.map(val => `Rp ${val.toLocaleString("id-ID")}`).join("\n") : "-";
      const excelHotelMalam = hotelMalamArr.length > 0 ? hotelMalamArr.map(val => `${val} Malam`).join("\n") : "-";
      const excelHotelTamu = hotelTamuArr.length > 0 ? hotelTamuArr.join("\n") : "-";
      const excelHotelTotalEx = hotelTotalArr.length > 0 ? hotelTotalArr.map(val => `Rp ${val.toLocaleString("id-ID")}`).join("\n") : "-";

      const excelLamaHari = `${item.hari} Hari`;

      const excelTarif1 = item.isSplitHarian ? (item.tarifDest1 || 0) : item.tarif;
      const excelTarif2 = item.isSplitHarian ? (item.tarifDest2 || 0) : 0;
      const excelTarif3 = item.isSplitHarian ? (item.tarifDest3 || 0) : 0;

      return [
        index + 1,
        item.nomorBku,
        item.tanggalBku,
        item.nomorSp,
        item.tanggalSp,
        koordinatorName,
        pegawaiName,
        pegawaiNip,
        jabatan,
        pangkat,
        subKegLabel,
        koderingLabel,
        item.uraianPrj,
        provName,
        dest1City,
        dest1Place,
        dest2City,
        dest2Place,
        dest3City,
        dest3Place,
        jpName,
        item.tanggalBerangkat,
        item.tanggalKembali,
        excelLamaHari,
        excelTarif1,
        excelTarif2,
        excelTarif3,
        item.uangSaku,
        item.uangRepresentatif,
        
        // BBM Form column breakdown
        excelBbmJenis,
        excelBbmHarga,
        excelBbmLiter,
        excelBbmTotal,
        
        // Transports Form column breakdown
        excelTransJenis,
        excelTransTol,
        excelTransTravel,
        excelTransKereta,
        excelTransPesawat,
        excelTransTotalText,
        
        // Akomodasi/Hotel Form column breakdown
        excelHotelNama,
        excelHotelHarga,
        excelHotelMalam,
        excelHotelTamu,
        excelHotelTotalEx,

        item.totalUang
      ];
    });

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    
    // Auto-fit columns implementation
    const colWidths = headers.map((header, colIndex) => {
      let maxLength = header.length;
      rows.forEach((row) => {
        const cellValue = row[colIndex];
        if (cellValue !== undefined && cellValue !== null) {
          const strValue = String(cellValue);
          // Split on newline to correctly gauge length of longest line
          const lines = strValue.split("\n");
          lines.forEach(line => {
            if (line.length > maxLength) {
              maxLength = line.length;
            }
          });
        }
      });
      return { wch: Math.min(Math.max(maxLength + 3, 10), 45) };
    });
    
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Perjalanan Dinas");
    XLSX.writeFile(workbook, `Data_Perjalanan_Dinas_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast("Data Perjalanan Dinas Berhasil Diekspor!", "success");
  };

  // --- DATA GRAPH CALCULATIONS & STATISTICS ---
  const hitungTotalRealisasiAnggaran = () => {
    return perjalananList.reduce((acc, cr) => acc + (cr.totalUang || 0), 0);
  };

  const hitungTotalUangHarian = () => {
    return perjalananList.reduce((acc, item) => {
      const harian = item.isSplitHarian
        ? (item.hariDest1 || 0) * (item.tarifDest1 || 0) +
          (item.hariDest2 || 0) * (item.tarifDest2 || 0) +
          (item.hariDest3 || 0) * (item.tarifDest3 || 0)
        : (item.hari || 0) * (item.tarif || 0);
      return acc + harian;
    }, 0);
  };

  const hitungTotalBBM = () => {
    return perjalananList.reduce((acc, item) => {
      const bbmSum = item.rincianBBM ? item.rincianBBM.reduce((sum, b) => sum + (b.totalBeli || 0), 0) : 0;
      return acc + bbmSum;
    }, 0);
  };

  const hitungTotalTransport = () => {
    return perjalananList.reduce((acc, item) => {
      const trSum = item.rincianTransport ? item.rincianTransport.reduce((sum, t) => {
        return sum + (t.biayaTol || 0) + (t.biayaTravel || 0) + (t.biayaKereta || 0) + (t.biayaPesawat || 0) + (t.biayaFerry || 0);
      }, 0) : 0;
      return acc + trSum;
    }, 0);
  };

  const hitungTotalAkomodasi = () => {
    return perjalananList.reduce((acc, item) => {
      const hotelSum = item.rincianHotel ? item.rincianHotel.reduce((sum, h) => sum + (h.total || 0), 0) : 0;
      return acc + hotelSum;
    }, 0);
  };

  const hitungRataRataHariAlkis = () => {
    if (perjalananList.length === 0) return 0;
    const totals = perjalananList.reduce((acc, cr) => acc + (cr.hari || 0), 0);
    return parseFloat((totals / perjalananList.length).toFixed(1));
  };

  // --- MAIN FILTER LOGIC MATCHING KEYWORDS ---
  const filteredLogs = perjalananList.filter((item) => {
    const pegawaiName = pegawaiList.find((p) => p.id === item.pegawaiId)?.nama || "";
    const koordinatorName = pegawaiList.find((p) => p.id === item.koordinatorId)?.nama || "";
    const bku = item.nomorBku || "";
    const sp = item.nomorSp || "";
    const uraian = item.uraianPrj || "";
    const tujuan = item.tujuan1 || "";

    const combinedStr = `${pegawaiName} ${koordinatorName} ${bku} ${sp} ${uraian} ${tujuan}`.toLowerCase();
    return combinedStr.includes(searchFilter.toLowerCase());
  });

  // Pagination bounds
  const totalRowsCount = filteredLogs.length;
  const maxPages = Math.max(1, Math.ceil(totalRowsCount / rowsPerPage));
  const pageStartIndex = (currentPage - 1) * rowsPerPage;
  const paginatedLogs = filteredLogs.slice(pageStartIndex, pageStartIndex + rowsPerPage);

  return (
    <div id="app-root-container" className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-10">
      
      {/* Brand Navigation Header banner - Highly styled and Luxurious */}
      <header id="app-header-nav" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-slate-900 to-slate-800 border border-slate-950 rounded-xl text-white flex items-center justify-center shadow-sm shadow-slate-900/10">
              <Briefcase className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight text-slate-900 flex items-center gap-2">
                SI Perjalanan Dinas
                <span className="hidden sm:inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold rounded-md border border-emerald-200/60 shadow-2xs">
                  v3.0 - Premium
                </span>
              </h1>
              <p className="text-[10.5px] font-semibold text-slate-500">
                Sistem Terpadu Pelaporan SPPD & Klaim Biaya Mandiri Pegawai
              </p>
            </div>
          </div>

          {/* Action Menus right - Colorful, Luxurious, and Highly Modern */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-open-ref-modal"
              onClick={() => setIsRefModalOpen(true)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-violet-50 to-indigo-50 hover:from-violet-100 hover:to-indigo-100 text-indigo-700 rounded-lg border border-indigo-200/80 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none shadow-2xs hover:shadow-xs active:scale-[97%] hover:-translate-y-0.5 duration-200"
            >
              <Settings className="w-4 h-4 text-indigo-500" /> Referensi
            </button>

            <button
              id="btn-open-tarif-modal"
              onClick={() => setIsTarifModalOpen(true)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-800 rounded-lg border border-amber-200/80 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none shadow-2xs hover:shadow-xs active:scale-[97%] hover:-translate-y-0.5 duration-200"
            >
              <Coins className="w-4 h-4 text-amber-600" /> Tarif
            </button>

            <button
              id="btn-open-pegawai-modal"
              onClick={() => setIsPegawaiModalOpen(true)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-sky-50 to-blue-50 hover:from-sky-100 hover:to-blue-100 text-sky-800 rounded-lg border border-sky-200/80 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none shadow-2xs hover:shadow-xs active:scale-[97%] hover:-translate-y-0.5 duration-200"
            >
              <Users className="w-4 h-4 text-sky-600" /> Data Pegawai
            </button>

            <button
              id="btn-tambah-perjalanan"
              onClick={handleOpenFormNew}
              className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-705 hover:to-teal-750 text-white rounded-lg border border-emerald-700 shadow-md shadow-emerald-600/10 hover:shadow-emerald-600/25 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none active:scale-[97%] hover:-translate-y-0.5 duration-200"
            >
              <Plus className="w-4 h-4 text-emerald-100 stroke-[3.5]" /> Tambah Perjalanan
            </button>
          </div>

        </div>
      </header>

      {/* Main Core View Area */}
      <main className="max-w-7xl mx-auto px-4 mt-4 space-y-4">

        {/* TOP METRICS SUMMARY BENTO BLOCKS */}
        <div id="top-metrics-container" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          
          {/* Card 1: Total Realisasi Anggaran */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-xl p-3 shadow-md relative overflow-hidden group hover:shadow-lg transition-all duration-300 border border-emerald-800/20">
            <div className="absolute top-2 right-2 p-1.5 bg-white/20 rounded-lg text-white">
              <Coins className="w-3.5 h-3.5" />
            </div>
            <div className="text-[9px] font-extrabold text-emerald-100 uppercase tracking-wider">Total Realisasi Anggaran</div>
            <div className="text-xs sm:text-sm font-black text-white font-mono mt-2 truncate">
              Rp {hitungTotalRealisasiAnggaran().toLocaleString("id-ID")}
            </div>
            <p className="text-[9.5px] text-emerald-50/80 font-medium mt-1 truncate">Selesai ter-audit buku SPPD</p>
          </div>

          {/* Card 2: Jumlah Perjalanan */}
          <div className="bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-xl p-3 shadow-md relative overflow-hidden group hover:shadow-lg transition-all duration-300 border border-sky-700/20">
            <div className="absolute top-2 right-2 p-1.5 bg-white/20 rounded-lg text-white">
              <FileCheck className="w-3.5 h-3.5" />
            </div>
            <div className="text-[9px] font-extrabold text-sky-100 uppercase tracking-wider">Jumlah Perjalanan</div>
            <div className="text-xs sm:text-sm font-black text-white font-mono mt-2 truncate">
              {perjalananList.length} <span className="text-[10px] text-sky-100 font-sans font-semibold">Perjalanan</span>
            </div>
            <p className="text-[9.5px] text-sky-50/80 font-medium mt-1 truncate font-sans">Aktif di kelola sistem</p>
          </div>

          {/* Card 3: Pegawai Teregistrasi */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl p-3 shadow-md relative overflow-hidden group hover:shadow-lg transition-all duration-300 border border-amber-700/20">
            <div className="absolute top-2 right-2 p-1.5 bg-white/20 rounded-lg text-white">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div className="text-[9px] font-extrabold text-amber-100 uppercase tracking-wider font-sans">Pegawai Teregistrasi</div>
            <div className="text-xs sm:text-sm font-black text-white font-mono mt-2 truncate">
              {pegawaiList.length} <span className="text-[10px] text-amber-100 font-sans font-semibold">Pegawai</span>
            </div>
            <p className="text-[9.5px] text-amber-50/80 font-medium mt-1 truncate font-sans">tersedia dalam tabel pegawai</p>
          </div>

          {/* Card 4: akumulasi data uang harian */}
          <div className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-xl p-3 shadow-md relative overflow-hidden group hover:shadow-lg transition-all duration-300 border border-indigo-700/20">
            <div className="absolute top-2 right-2 p-1.5 bg-white/20 rounded-lg text-white">
              <Database className="w-3.5 h-3.5" />
            </div>
            <div className="text-[9px] font-extrabold text-indigo-100 uppercase tracking-wider">Akumulasi Uang Harian</div>
            <div className="text-xs sm:text-sm font-black text-white font-mono mt-2 truncate">
              Rp {hitungTotalUangHarian().toLocaleString("id-ID")}
            </div>
            <p className="text-[9.5px] text-indigo-50/80 font-medium mt-1 truncate">akumulasi data uang harian</p>
          </div>

          {/* Card 5: Akumulasi Biaya BBM */}
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-xl p-3 shadow-md relative overflow-hidden group hover:shadow-lg transition-all duration-300 border border-emerald-700/20">
            <div className="absolute top-2 right-2 p-1.5 bg-white/20 rounded-lg text-white">
              <Flame className="w-3.5 h-3.5" />
            </div>
            <div className="text-[9px] font-extrabold text-emerald-100 uppercase tracking-wider">Akumulasi Biaya BBM</div>
            <div className="text-xs sm:text-sm font-black text-white font-mono mt-2 truncate">
              Rp {hitungTotalBBM().toLocaleString("id-ID")}
            </div>
            <p className="text-[9.5px] text-emerald-50/80 font-medium mt-1 truncate">Total pembelian bbm</p>
          </div>

          {/* Card 6: Akumulasi Transportasi */}
          <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-xl p-3 shadow-md relative overflow-hidden group hover:shadow-lg transition-all duration-300 border border-rose-700/20">
            <div className="absolute top-2 right-2 p-1.5 bg-white/20 rounded-lg text-white">
              <Plane className="w-3.5 h-3.5" />
            </div>
            <div className="text-[9px] font-extrabold text-rose-100 uppercase tracking-wider">Akumulasi Transportasi</div>
            <div className="text-xs sm:text-sm font-black text-white font-mono mt-2 truncate">
              Rp {hitungTotalTransport().toLocaleString("id-ID")}
            </div>
            <p className="text-[9.5px] text-rose-50/80 font-medium mt-1 truncate">Bensin, tol, travel, tiket</p>
          </div>

          {/* Card 7: Akumulasi Akomodasi */}
          <div className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-xl p-3 shadow-md relative overflow-hidden group hover:shadow-lg transition-all duration-300 border border-cyan-700/20">
            <div className="absolute top-2 right-2 p-1.5 bg-white/20 rounded-lg text-white">
              <Home className="w-3.5 h-3.5" />
            </div>
            <div className="text-[9px] font-extrabold text-cyan-100 uppercase tracking-wider">Akumulasi Akomodasi</div>
            <div className="text-xs sm:text-sm font-black text-white font-mono mt-2 truncate">
              Rp {hitungTotalAkomodasi().toLocaleString("id-ID")}
            </div>
            <p className="text-[9.5px] text-cyan-50/80 font-medium mt-1 truncate">Sewa hotel & penginapan</p>
          </div>

        </div>

        {/* WORKSPACE OPERATIONS FILTER TOOLBAR */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Bulkactions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="btn-delete-selected"
              disabled={selectedRowIds.length === 0}
              onClick={handleDeleteBulk}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 select-none border ${
                selectedRowIds.length > 0
                  ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-300 shadow-2xs hover:shadow-xs hover:scale-[101%] active:scale-[98%] cursor-pointer"
                  : "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" /> Hapus Terpilih ({selectedRowIds.length})
            </button>
            
            <button
              id="btn-export-excel"
              onClick={handleExportExcel}
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 text-emerald-800 rounded-lg border border-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none shadow-2xs hover:shadow-xs hover:scale-[101%] active:scale-[98%]"
              title="Download Excel Native Spreadsheet"
            >
              <Download className="w-4 h-4 text-emerald-600 stroke-[2.5]" /> Export Excel
            </button>
          </div>

          {/* Search bar & Rows display limiters */}
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
            {/* Limit Rows Per Page */}
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 shrink-0">
              <span>Tampil:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-7.5 px-2 bg-slate-50 border border-slate-200 rounded text-[11px] font-semibold focus:outline-none focus:bg-white text-slate-700"
              >
                <option value={5}>5 Baris</option>
                <option value={10}>10 Baris</option>
                <option value={20}>20 Baris</option>
                <option value={50}>50 Baris</option>
              </select>
            </div>

            {/* Keyword search filter */}
            <div className="relative w-full sm:w-56">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <Search className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <input
                id="search-filter-input"
                type="text"
                placeholder="Cari Data Perjalanan..."
                value={searchFilter}
                onChange={(e) => {
                  setSearchFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="block w-full h-7.5 pl-7.5 pr-7 bg-slate-50 border border-slate-200 rounded text-[11px] font-semibold focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-500 outline-none transition-all placeholder:text-slate-400 text-slate-700"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter("")}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <span className="text-xs font-bold">×</span>
                </button>
              )}
            </div>
          </div>

        </div>
        {/* PRIMARY SPREADSHEET TABLE GRID CONTAINER */}
        <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
          
          <div className="overflow-x-auto">
            <table id="main-travel-datatable" className="min-w-full divide-y divide-slate-200 text-slate-700 text-left table-fixed">
              
              <thead className="bg-[#f8fafc] text-[9.5px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-2 py-2 text-center w-8 select-none">
                    <input
                      type="checkbox"
                      checked={
                        paginatedLogs.length > 0 &&
                        paginatedLogs.every((item) => selectedRowIds.includes(item.id))
                      }
                      onChange={() => handleToggleSelectAllOnPage(paginatedLogs)}
                      className="w-3.5 h-3.5 text-sky-600 border-slate-300 rounded focus:ring-sky-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-2 py-2 text-center w-8">No</th>
                  <th className="px-2 py-2 w-32">No & Tanggal BKU</th>
                  <th className="px-2 py-2 w-32">No & Tanggal SP</th>
                  <th className="px-2 py-2 w-44">Nama Pegawai / NIP</th>
                  <th className="px-2 py-2 w-48">Sub Kegiatan</th>
                  <th className="px-2 py-2 w-48">Kodering</th>
                  <th className="px-2 py-2 w-36">Tujuan</th>
                  <th className="px-2 py-2 w-28">Provinsi</th>
                  <th className="px-2 py-2 w-36">Kab/Kota</th>
                  <th className="px-2 py-2 w-36">Jenis Perjalanan</th>
                  <th className="px-2 py-2 w-48">Uraian / Maksud</th>
                  <th className="px-2 py-2 w-20 text-center">Tgl Pergi</th>
                  <th className="px-2 py-2 w-20 text-center">Tgl Pulang</th>
                  <th className="px-2 py-2 text-center w-10">Hari</th>
                  <th className="px-2 py-2 text-right w-20">Tarif (Rp)</th>
                  <th className="px-2 py-2 text-right w-20">Uang Saku</th>
                  <th className="px-2 py-2 text-right w-20">Representasi</th>
                  <th className="px-2 py-2 w-44">Rincian BBM</th>
                  <th className="px-2 py-2 w-44">Rincian Transport</th>
                  <th className="px-2 py-2 w-44">Rincian Hotel</th>
                  <th className="px-2 py-2 text-right w-24">Total Uang (Rp)</th>
                  <th className="px-2 py-2 w-44">Koordinator</th>
                  <th className="px-2 py-2 text-center w-20 sticky right-0 bg-slate-50/95 shadow-[-3px_0_5px_rgba(0,0,0,0.02)]">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 text-[10.5px]">
                {paginatedLogs.length > 0 ? (
                  paginatedLogs.map((item, index) => {
                    const globalNo = pageStartIndex + index + 1;
                    const isChecked = selectedRowIds.includes(item.id);

                    // Lookup joins
                    const koordinatorName = pegawaiList.find((p) => p.id === item.koordinatorId)?.nama || "-";
                    const pegawai = pegawaiList.find((p) => p.id === item.pegawaiId);
                    const pegawaiName = pegawai ? pegawai.nama : "-";
                    const pegawaiNip = pegawai ? pegawai.nip : "-";

                    const subKeg = subKegiatanList.find((s) => s.id === item.subKegiatanId);
                    const subKegLabel = subKeg ? `${subKeg.kode} ${subKeg.nama}` : "-";

                    const kodering = koderingList.find((k) => k.id === item.koderingId);
                    const koderingLabel = kodering ? `${kodering.kode} ${kodering.nama}` : "-";

                    const provName = provinsiList.find((p) => p.id === item.provinsiId)?.nama || "-";
                    
                    // Display KabKota joins
                    const c1 = kabKotaList.find((c) => c.id === item.kabKotaId1)?.nama || "-";
                    const c2 = item.kabKotaId2 ? kabKotaList.find((c) => c.id === item.kabKotaId2)?.nama : "";
                    const c3 = item.kabKotaId3 ? kabKotaList.find((c) => c.id === item.kabKotaId3)?.nama : "";
                    const kabKotaJoined = [c1, c2, c3].filter(c => c !== "" && c !== "-").join(", ");

                    const jpName = jenisPerjalananList.find((j) => j.id === item.jenisPerjalananId)?.nama || "-";

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-slate-50/50 transition-colors ${
                          isChecked ? "bg-sky-50/20" : ""
                        }`}
                      >
                        {/* Selector checkbox */}
                        <td className="px-2 py-1.5 text-center select-none">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleSelectRow(item.id)}
                            className="w-3.5 h-3.5 text-sky-600 border-slate-300 rounded focus:ring-sky-500 cursor-pointer"
                          />
                        </td>

                        {/* No */}
                        <td className="px-2 py-1.5 text-center font-mono text-slate-400 font-semibold select-none">
                          {globalNo}
                        </td>

                        {/* No & Tanggal BKU */}
                        <td className="px-2 py-1.5 leading-tight">
                          <div className="font-mono font-bold text-slate-700 truncate" title={item.nomorBku}>
                            {item.nomorBku}
                          </div>
                          <div className="text-[9.5px] text-slate-400 mt-0.5 font-medium whitespace-nowrap">
                            {item.tanggalBku}
                          </div>
                        </td>

                        {/* No & Tanggal SP */}
                        <td className="px-2 py-1.5 leading-tight">
                          <div className="font-mono font-medium text-slate-600 truncate" title={item.nomorSp}>
                            {item.nomorSp}
                          </div>
                          <div className="text-[9.5px] text-slate-400 mt-0.5 font-medium whitespace-nowrap">
                            {item.tanggalSp}
                          </div>
                        </td>

                        {/* Nama Pegawai */}
                        <td className="px-2 py-1.5 leading-tight">
                          <div className="font-bold text-slate-900">
                            {pegawaiName}
                          </div>
                          {pegawaiNip !== "-" && (
                            <div className="text-[9px] font-mono font-semibold text-slate-400 mt-0.5">
                              {pegawaiNip}
                            </div>
                          )}
                        </td>

                        {/* Sub Kegiatan */}
                        <td className="px-2 py-1.5 text-[10px] text-slate-600 font-semibold leading-tight whitespace-pre-wrap">
                          {subKegLabel}
                        </td>

                        {/* Kodering */}
                        <td className="px-2 py-1.5 text-[10px] text-slate-600 font-semibold leading-tight whitespace-pre-wrap">
                          {koderingLabel}
                        </td>

                        {/* Tujuan */}
                        <td className="px-2 py-1.5 text-slate-800 leading-tight font-semibold">
                          {[item.tujuan1, item.tujuan2, item.tujuan3].filter(t => t && t !== "").join(", ")}
                        </td>

                        {/* Provinsi */}
                        <td className="px-2 py-1.5 font-medium text-slate-600 text-[10px]">
                          {provName}
                        </td>

                        {/* Kab/Kota */}
                        <td className="px-2 py-1.5 font-bold text-slate-900 leading-tight text-[10px]">
                          {kabKotaJoined}
                        </td>

                        {/* Jenis Perjalanan */}
                        <td className="px-2 py-1.5 text-slate-600 leading-tight font-medium text-[10px]">
                          {jpName}
                        </td>

                        {/* Uraian */}
                        <td className="px-2 py-1.5 text-slate-500 leading-tight font-medium max-w-[120px] truncate" title={item.uraianPrj}>
                          {item.uraianPrj}
                        </td>

                        {/* Berangkat */}
                        <td className="px-2 py-1.5 font-medium text-slate-600 font-mono text-center text-[10px] whitespace-nowrap">
                          {item.tanggalBerangkat}
                        </td>

                        {/* Kembali */}
                        <td className="px-2 py-1.5 font-medium text-slate-600 font-mono text-center text-[10px] whitespace-nowrap">
                          {item.tanggalKembali}
                        </td>

                        {/* Hari */}
                        <td className="px-2 py-1.5 text-center font-black text-slate-950 font-mono">
                          {item.hari}
                        </td>

                        {/* Tarif */}
                        <td className="px-2 py-1.5 text-right text-slate-600 font-mono font-medium">
                          {item.isSplitHarian ? (
                            <div className="flex flex-col items-end gap-0.5 text-[9px] leading-none py-0.5 text-slate-700 font-sans font-bold">
                              {(item.hariDest1 || 0) > 0 && (
                                <span className="whitespace-nowrap">UH 1: Rp {(item.tarifDest1 || 0).toLocaleString("id-ID")}</span>
                              )}
                              {(item.hariDest2 || 0) > 0 && (
                                <span className="whitespace-nowrap">UH 2: Rp {(item.tarifDest2 || 0).toLocaleString("id-ID")}</span>
                              )}
                              {(item.hariDest3 || 0) > 0 && (
                                <span className="whitespace-nowrap">UH 3: Rp {(item.tarifDest3 || 0).toLocaleString("id-ID")}</span>
                              )}
                            </div>
                          ) : (
                            item.tarif.toLocaleString("id-ID")
                          )}
                        </td>

                        {/* Uang Saku */}
                        <td className="px-2 py-1.5 text-right text-slate-500 font-mono">
                          {item.uangSaku ? item.uangSaku.toLocaleString("id-ID") : "-"}
                        </td>

                        {/* Uang Representatif */}
                        <td className="px-2 py-1.5 text-right text-slate-500 font-mono">
                          {item.uangRepresentatif ? item.uangRepresentatif.toLocaleString("id-ID") : "-"}
                        </td>

                        {/* Rincian BBM - bullet format shown in prompt */}
                        <td className="px-2 py-1.5 text-[10px] leading-tight">
                          {item.rincianBBM && item.rincianBBM.length > 0 ? (
                            item.rincianBBM.map((b, bIdx) => {
                              const bbmName = jenisBBMList.find((f) => f.id === b.jenisBBMId)?.nama || "BBM";
                              return (
                                <div key={bIdx} className="space-y-0.5 border border-dashed border-emerald-100 bg-emerald-50/25 p-1 rounded">
                                  <div className="font-bold text-emerald-800 flex items-center gap-0.5">
                                    <span className="text-[8px]">💧</span> {bbmName.split(" ")[0]}
                                  </div>
                                  <div className="text-[9px] text-slate-500 font-mono leading-none">
                                    {b.liter}L @ {b.hargaPerLiter.toLocaleString("id-ID")}
                                  </div>
                                  <div className="font-bold text-[9.5px] text-emerald-600 font-mono">
                                    = Rp{b.totalBeli.toLocaleString("id-ID")}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <span className="text-slate-400 font-medium">-</span>
                          )}
                        </td>

                        {/* Rincian Transport */}
                        <td className="px-2 py-1.5 text-[10px] leading-tight">
                          {item.rincianTransport && item.rincianTransport.length > 0 ? (
                            item.rincianTransport.map((tr, trIdx) => {
                              const tName = jenisTransportasiList.find((f) => f.id === tr.jenisTransportasiId)?.nama || "Transport";
                              return (
                                <div key={trIdx} className="space-y-0.5 border border-dashed border-sky-100 bg-sky-50/25 p-1 rounded text-slate-600">
                                  <div className="font-bold text-sky-800 flex items-center gap-0.5">
                                    <span>🚗</span> {tName.split(" ")[0]}
                                  </div>
                                  {tr.biayaTol > 0 && <div className="text-[9px] font-mono">Tol: {tr.biayaTol.toLocaleString("id-ID")}</div>}
                                  {tr.biayaTravel > 0 && <div className="text-[9px] font-mono">Trv: {tr.biayaTravel.toLocaleString("id-ID")}</div>}
                                  {tr.biayaKereta > 0 && <div className="text-[9px] font-mono">Krt: {tr.biayaKereta.toLocaleString("id-ID")}</div>}
                                  {tr.biayaPesawat > 0 && <div className="text-[9px] font-mono">Psw: {tr.biayaPesawat.toLocaleString("id-ID")}</div>}
                                </div>
                              );
                            })
                          ) : (
                            <span className="text-slate-400 font-medium">-</span>
                          )}
                        </td>

                        {/* Rincian Hotel */}
                        <td className="px-2 py-1.5 text-[10px] leading-tight">
                          {item.rincianHotel && item.rincianHotel.length > 0 ? (
                            item.rincianHotel.map((ho, hoIdx) => (
                              <div key={hoIdx} className="space-y-0.5 border border-dashed border-amber-100 bg-amber-50/25 p-1 rounded text-slate-600">
                                <div className="font-bold text-amber-800 flex items-center gap-0.5 truncate" title={ho.namaHotel}>
                                  <span>🏨</span> {ho.namaHotel}
                                </div>
                                <div className="text-[9px] font-mono leading-none">
                                  {ho.malam}M x {ho.hargaPerMalam.toLocaleString("id-ID")}
                                </div>
                                <div className="font-bold text-[9.5px] text-amber-600 font-mono">
                                  = Rp{ho.total.toLocaleString("id-ID")}
                                </div>
                              </div>
                            ))
                          ) : (
                            <span className="text-slate-400 font-medium">-</span>
                          )}
                        </td>

                        {/* Total Uang - Bold red specified in prompt */}
                        <td className="px-2 py-1.5 text-right font-bold text-rose-600 font-mono bg-rose-50/15">
                          {item.totalUang.toLocaleString("id-ID")}
                        </td>

                        {/* Koordinator */}
                        <td className="px-2 py-1.5 font-semibold text-emerald-800 leading-tight">
                          {koordinatorName}
                        </td>

                        {/* Actions sticky right shadow */}
                        <td className="px-2 py-1.5 text-center sticky right-0 bg-white shadow-[-3px_0_5px_rgba(0,0,0,0.035)]">
                          <div className="flex justify-center gap-1.5 items-center min-h-[24px]">
                            <button
                              type="button"
                              onClick={() => handleOpenFormEdit(item)}
                              className="px-2.5 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-md border border-sky-200 text-[10.5px] font-bold cursor-pointer transition-all hover:scale-[104%] hover:shadow-2xs active:scale-[96%]"
                              title="Edit Data"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePerjalanan(item)}
                              className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-md border border-rose-200 text-[10.5px] font-extrabold cursor-pointer transition-all hover:scale-[104%] hover:shadow-2xs active:scale-[96%]"
                              title="Hapus Data"
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
                    <td colSpan={24} className="px-4 py-8 text-center text-slate-450 font-medium">
                      Tidak ada data perjalanan dinas terdaftar sesuai kriteria penelusuran.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>

          {/* TABLE FOOTER WORKSPACE PAGINATOR */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-3 py-1.5 bg-slate-50 border-t border-slate-200 text-[11px] gap-2 shrink-0 shadow-inner">
            <span className="text-slate-500 font-medium select-none">
              Halaman <b>{currentPage}</b> dari <b>{maxPages}</b> (Menampilkan <b>{paginatedLogs.length}</b> dari total <b>{totalRowsCount}</b> logs)
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2 py-1 bg-white hover:bg-slate-55 border border-slate-200 rounded text-[11px] font-semibold text-slate-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-0.5 select-none"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-slate-650" /> Prev
              </button>
              <button
                type="button"
                disabled={currentPage === maxPages}
                onClick={() => setCurrentPage((p) => Math.min(maxPages, p + 1))}
                className="px-2 py-1 bg-white hover:bg-slate-55 border border-slate-200 rounded text-[11px] font-semibold text-slate-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-0.5 select-none"
              >
                Next <ChevronRight className="w-3.5 h-3.5 text-slate-650" />
              </button>
            </div>
          </div>

        </div>



      </main>

      {/* --- INTEGRATED MODALS DIALOG SECTION --- */}
      
      <ReferenceModal
        id="ref-data-modal"
        isOpen={isRefModalOpen}
        onClose={() => setIsRefModalOpen(false)}
        provinsiList={provinsiList}
        setProvinsiList={setProvinsiList}
        kabKotaList={kabKotaList}
        setKabKotaList={setKabKotaList}
        jenisPerjalananList={jenisPerjalananList}
        setJenisPerjalananList={setJenisPerjalananList}
        subKegiatanList={subKegiatanList}
        setSubKegiatanList={setSubKegiatanList}
        koderingList={koderingList}
        setKoderingList={setKoderingList}
        jenisBBMList={jenisBBMList}
        setJenisBBMList={setJenisBBMList}
        jenisTransportasiList={jenisTransportasiList}
        setJenisTransportasiList={setJenisTransportasiList}
        tahunList={tahunList}
        setTahunList={setTahunList}
      />

      <TarifModal
        id="rif-rates-modal"
        isOpen={isTarifModalOpen}
        onClose={() => setIsTarifModalOpen(false)}
        provinsiList={provinsiList}
        kabKotaList={kabKotaList}
        jenisPerjalananList={jenisPerjalananList}
        tarifList={tarifList}
        setTarifList={setTarifList}
        tahunList={tahunList}
      />

      <PegawaiModal
        id="peg-list-modal"
        isOpen={isPegawaiModalOpen}
        onClose={() => setIsPegawaiModalOpen(false)}
        pegawaiList={pegawaiList}
        setPegawaiList={setPegawaiList}
      />

      <PerjalananFormModal
        id="prj-form-modal"
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        provinsiList={provinsiList}
        kabKotaList={kabKotaList}
        jenisPerjalananList={jenisPerjalananList}
        subKegiatanList={subKegiatanList}
        koderingList={koderingList}
        jenisBBMList={jenisBBMList}
        jenisTransportasiList={jenisTransportasiList}
        pegawaiList={pegawaiList}
        tarifList={tarifList}
        onSave={handleSaveTravelForm}
        editingRecord={editingRecord}
      />

    </div>
  );
}
