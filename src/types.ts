/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Provinsi {
  id: string;
  nama: string;
}

export interface KabKota {
  id: string;
  provinsiId: string;
  nama: string;
}

export interface JenisPerjalanan {
  id: string;
  nama: string;
}

export interface SubKegiatan {
  id: string;
  kode: string;
  nama: string;
}

export interface Kodering {
  id: string;
  kode: string;
  nama: string;
}

export interface JenisBBM {
  id: string;
  nama: string;
  hargaPerLiter: number;
}

export interface JenisTransportasi {
  id: string;
  nama: string;
}

export interface Pegawai {
  id: string;
  nama: string;
  nip: string;
  pangkat: string;
  jabatan: string;
}

export interface TarifUangHarian {
  id: string;
  tahun: string;
  provinsiId: string;
  kabKotaId: string;
  jenisPerjalananId: string;
  tarif: number;
}

export interface RincianBBM {
  jenisBBMId: string;
  hargaPerLiter: number;
  totalBeli: number;
  liter: number;
}

export interface RincianTransport {
  jenisTransportasiId: string;
  biayaTol: number;
  biayaTravel: number;
  biayaKereta: number;
  biayaPesawat: number;
  biayaFerry: number;
}

export interface RincianHotel {
  namaHotel: string;
  hargaPerMalam: number;
  malam: number;
  total: number;
  namaMenginap: string;
  nomorKamar: string;
}

export interface PerjalananDinas {
  id: string;
  groupId: string; // To keep track of multi-employees created in one form submission
  nomorBku: string;
  tanggalBku: string;
  nomorSp: string;
  tanggalSp: string;
  koordinatorId: string;
  pegawaiId: string;
  isFirstPegawai: boolean; // True only for the first selected employee (holds the expenses)
  subKegiatanId: string;
  koderingId: string;
  uraianPrj: string;
  provinsiId: string;
  kabKotaId1: string;
  kabKotaId2?: string;
  kabKotaId3?: string;
  tujuan1: string;
  tujuan2?: string;
  tujuan3?: string;
  jenisPerjalananId: string;
  tanggalBerangkat: string;
  tanggalKembali: string;
  hari: number;
  tarif: number;
  isSplitHarian?: boolean;
  hariDest1?: number;
  tarifDest1?: number;
  hariDest2?: number;
  tarifDest2?: number;
  hariDest3?: number;
  tarifDest3?: number;
  uangSaku: number;
  uangRepresentatif: number;
  totalUang: number; // calculated field
  rincianBBM: RincianBBM[];
  rincianTransport: RincianTransport[];
  rincianHotel: RincianHotel[];
}
