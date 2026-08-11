import axios from 'axios';
import {
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Crosshair,
    Droplets,
    Layers,
    Loader2,
    MapPin,
    Radio,
    ShieldAlert,
    UploadCloud,
    Waves,
    X,
} from 'lucide-react';
import React, { useState } from 'react';

import FloodMap from '@/components/map/flood-map';
import type { FloodReport } from '@/types/flood';

interface HomeProps {
    reports: FloodReport[];
}

interface FloodReportForm {
    latitude: string;
    longitude: string;
    address: string;
    water_level: string;
    description: string;
}

export default function Home({ reports = [] }: HomeProps) {
    const [showReportForm, setShowReportForm] = useState(false);

    const [form, setForm] = useState<FloodReportForm>({
        latitude: '',
        longitude: '',
        address: '',
        water_level: '',
        description: '',
    });

    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    /**
     * Hitung Badge Keparahan (Severity Badge)
     */
    const getSeverityDetails = (waterLevel: number) => {
        if (waterLevel < 10) {
            return {
                label: 'Aman',
                badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                dotClass: 'bg-emerald-500',
            };
        }

        if (waterLevel <= 30) {
            return {
                label: 'Waspada',
                badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
                dotClass: 'bg-amber-500',
            };
        }

        if (waterLevel <= 50) {
            return {
                label: 'Siaga',
                badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
                dotClass: 'bg-orange-500',
            };
        }

        if (waterLevel <= 100) {
            return {
                label: 'Siaga Tinggi',
                badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
                dotClass: 'bg-rose-500',
            };
        }

        return {
            label: 'Bahaya / Darurat',
            badgeClass: 'bg-red-600 text-white border-red-700 animate-pulse',
            dotClass: 'bg-white',
        };
    };

    /**
     * Mendapatkan lokasi GPS pengguna
     */
    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setErrorMessage('Browser Anda tidak mendukung layanan lokasi GPS.');

            return;
        }

        setLoadingLocation(true);
        setErrorMessage('');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                setForm((current) => ({
                    ...current,
                    latitude: lat.toFixed(8),
                    longitude: lng.toFixed(8),
                    address:
                        current.address ||
                        `Koordinat: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
                }));

                setLoadingLocation(false);
            },
            (error) => {
                setLoadingLocation(false);

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setErrorMessage('Izin akses GPS ditolak oleh pengguna.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setErrorMessage('Informasi koordinat GPS tidak tersedia.');
                        break;
                    case error.TIMEOUT:
                        setErrorMessage('Permintaan lokasi GPS mengalami timeout.');
                        break;
                    default:
                        setErrorMessage('Gagal mendeteksi lokasi saat ini.');
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            },
        );
    };

    /**
     * Handle input perubahan form
     */
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    /**
     * Handle seleksi & preview gambar
     */
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
return;
}

        const selectedFiles = Array.from(e.target.files);

        if (selectedFiles.length + images.length > 5) {
            setErrorMessage('Maksimal 5 foto dokumentasi yang dapat dilampirkan.');

            return;
        }

        const invalidFile = selectedFiles.find(
            (file) => file.size > 2 * 1024 * 1024,
        );

        if (invalidFile) {
            setErrorMessage('Ukuran setiap file maksimal 2 MB.');

            return;
        }

        const newImages = [...images, ...selectedFiles];
        setImages(newImages);

        const newPreviews = selectedFiles.map((file) =>
            URL.createObjectURL(file),
        );
        setImagePreviews((prev) => [...prev, ...newPreviews]);
        setErrorMessage('');
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => {
            URL.revokeObjectURL(prev[index]);

            return prev.filter((_, i) => i !== index);
        });
    };

    /**
     * Handle pengiriman data
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const formData = new FormData();
            formData.append('latitude', form.latitude);
            formData.append('longitude', form.longitude);
            formData.append('address', form.address);
            formData.append('water_level', form.water_level);

            if (form.description) {
                formData.append('description', form.description);
            }

            images.forEach((image) => {
                formData.append('images[]', image);
            });

            await axios.post('/api/v1/flood-reports', formData, {
                headers: {
                    Accept: 'application/json',
                },
            });

            setSuccessMessage(
                'Laporan banjir terkirim. Petugas akan memverifikasi dalam waktu singkat.',
            );

            setForm({
                latitude: '',
                longitude: '',
                address: '',
                water_level: '',
                description: '',
            });

            setImages([]);
            setImagePreviews([]);

            setTimeout(() => {
                setShowReportForm(false);
                setSuccessMessage('');
            }, 2500);
        } catch (error: any) {
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                const firstError = Object.values(errors ?? {})[0];
                setErrorMessage(
                    Array.isArray(firstError)
                        ? String(firstError[0])
                        : 'Data formulir tidak valid.',
                );
            } else {
                setErrorMessage(
                    error.response?.data?.message ??
                        'Gagal mengirim laporan banjir ke server.',
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    const maxWaterLevel =
        reports.length > 0
            ? Math.max(...reports.map((r) => Number(r.water_level) || 0))
            : 0;

    return (
        <div className="min-h-screen bg-slate-50/70 font-sans text-slate-800 antialiased selection:bg-teal-700 selection:text-white">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 border-b border-teal-900/10 bg-teal-800 text-white shadow-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-md">
                            <Waves className="h-6 w-6 text-teal-200" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h1 className="text-lg font-black tracking-wider">
                                    SIGAP BANJIR
                                </h1>
                                <span className="inline-flex items-center rounded-full bg-teal-700/80 px-2 py-0.5 text-[10px] font-semibold text-teal-100 ring-1 ring-inset ring-teal-600">
                                    PWA Siaga
                                </span>
                            </div>
                            <p className="hidden text-xs text-teal-200/90 sm:block">
                                Sistem Informasi & Gotong Royong Antisipasi Banjir
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setShowReportForm(true);
                            setErrorMessage('');
                            setSuccessMessage('');
                        }}
                        className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-rose-950/20 transition hover:bg-rose-700 active:scale-95 sm:text-sm"
                    >
                        <ShieldAlert className="h-4 w-4" />
                        <span>🚨 Lapor Genangan</span>
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
                {/* Summary / Quick Metric Strip */}
                <section className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between text-slate-500">
                            <span className="text-xs font-semibold uppercase tracking-wider">
                                Titik Laporan
                            </span>
                            <Layers className="h-4 w-4 text-teal-700" />
                        </div>
                        <p className="mt-2 text-2xl font-black text-slate-900">
                            {reports.length}
                        </p>
                        <span className="text-[11px] text-slate-400">
                            Data aktif terverifikasi
                        </span>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between text-slate-500">
                            <span className="text-xs font-semibold uppercase tracking-wider">
                                Genangan Tertinggi
                            </span>
                            <Droplets className="h-4 w-4 text-rose-600" />
                        </div>
                        <p className="mt-2 text-2xl font-black text-rose-600">
                            {maxWaterLevel} <span className="text-sm font-bold">cm</span>
                        </p>
                        <span className="text-[11px] text-slate-400">
                            Status genangan saat ini
                        </span>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between text-slate-500">
                            <span className="text-xs font-semibold uppercase tracking-wider">
                                Mode Sinkronisasi
                            </span>
                            <Radio className="h-4 w-4 text-teal-700" />
                        </div>
                        <p className="mt-2 text-base font-bold text-teal-800">
                            Background Sync
                        </p>
                        <span className="text-[11px] text-slate-400">
                            Dukungan lapor offline
                        </span>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between text-slate-500">
                            <span className="text-xs font-semibold uppercase tracking-wider">
                                Kontak Darurat
                            </span>
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                        </div>
                        <p className="mt-2 text-base font-bold text-slate-900">
                            112 / Tim Siaga
                        </p>
                        <span className="text-[11px] text-slate-400">
                            Evakuasi & Bantuan Cepat
                        </span>
                    </div>
                </section>

                {/* Section Peta GIS */}
                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="mb-4 flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                                Pemantauan Spasial Genangan (GIS)
                            </h2>
                            <p className="text-xs text-slate-500">
                                Peta sebaran spasial lokasi genangan dan titik evakuasi secara langsung.
                            </p>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs sm:mt-0">
                            <span className="inline-flex items-center gap-1 text-slate-500">
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Aman
                            </span>
                            <span className="inline-flex items-center gap-1 text-slate-500">
                                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Waspada
                            </span>
                            <span className="inline-flex items-center gap-1 text-slate-500">
                                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Bahaya
                            </span>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200">
                        <FloodMap reports={reports} />
                    </div>
                </section>

                {/* Section Laporan Terkini */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                                Laporan Genangan Terkini
                            </h2>
                            <p className="text-xs text-slate-500">
                                Informasi lapangan hasil verifikasi partisipatif warga.
                            </p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            {reports.length} Lokasi
                        </span>
                    </div>

                    {reports.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
                            <div className="rounded-full bg-teal-50 p-4 text-teal-800">
                                <Waves className="h-8 w-8" />
                            </div>
                            <p className="mt-3 font-bold text-slate-700">
                                Belum Ada Genangan Terdeteksi
                            </p>
                            <p className="mt-1 max-w-sm text-xs text-slate-400">
                                Kondisi terpantau kondusif. Laporkan segera jika Anda menemukan genangan air baru di lingkungan sekitar.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {reports.map((report) => {
                                const level = Number(report.water_level) || 0;
                                const severity = getSeverityDetails(level);

                                return (
                                    <div
                                        key={report.id}
                                        className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-teal-700/40 hover:shadow-md"
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between gap-2">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${severity.badgeClass}`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${severity.dotClass}`}
                                                    />
                                                    {severity.label}
                                                </span>

                                                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    <span>Terverifikasi</span>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="line-clamp-1 font-bold text-slate-800">
                                                    {report.address}
                                                </h3>
                                                <div className="mt-2 flex items-baseline gap-1">
                                                    <span className="text-3xl font-black text-teal-800">
                                                        {report.water_level}
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-500">
                                                        cm genangan
                                                    </span>
                                                </div>
                                            </div>

                                            {report.description && (
                                                <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">
                                                    {report.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
                                            <span className="flex items-center gap-1 font-mono text-[10px]">
                                                <MapPin className="h-3 w-3 text-teal-700" />
                                                {Number(report.latitude).toFixed(4)}, {Number(report.longitude).toFixed(4)}
                                            </span>
                                            <span className="font-semibold text-slate-500 capitalize">
                                                {report.status || 'Verified'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>

            {/* Modal Formulir Lapor Banjir */}
            {showReportForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
                    <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-100 bg-white shadow-2xl">
                        {/* Header Modal */}
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
                            <div className="flex items-center space-x-2.5">
                                <div className="rounded-xl bg-rose-50 p-2 text-rose-600 ring-1 ring-rose-200">
                                    <ShieldAlert className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">
                                        Formulir Pelaporan Banjir
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Data akurat membantu kecepatan evakuasi
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowReportForm(false)}
                                className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Form Pelaporan */}
                        <form onSubmit={handleSubmit} className="space-y-4 p-6">
                            {/* Lokasi / GPS */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                        Koordinat Lokasi (GPS)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={getCurrentLocation}
                                        disabled={loadingLocation}
                                        className="flex items-center gap-1.5 rounded-lg border border-teal-700/20 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800 transition hover:bg-teal-100 disabled:opacity-50"
                                    >
                                        {loadingLocation ? (
                                            <>
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                <span>Mencari Koordinat...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Crosshair className="h-3.5 w-3.5" />
                                                <span>Gunakan Lokasi Saya</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="number"
                                        step="any"
                                        name="latitude"
                                        value={form.latitude}
                                        onChange={handleChange}
                                        placeholder="Latitude (cth: -6.2088)"
                                        required
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-mono text-slate-800 focus:border-teal-700 focus:bg-white focus:outline-none"
                                    />
                                    <input
                                        type="number"
                                        step="any"
                                        name="longitude"
                                        value={form.longitude}
                                        onChange={handleChange}
                                        placeholder="Longitude (cth: 106.8456)"
                                        required
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-mono text-slate-800 focus:border-teal-700 focus:bg-white focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Alamat */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                    Alamat Lengkap / Patokan
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    placeholder="Contoh: Jl. Merdeka No. 45, Dekat Jembatan"
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-xs text-slate-800 focus:border-teal-700 focus:bg-white focus:outline-none sm:text-sm"
                                />
                            </div>

                            {/* Ketinggian Genangan */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                    Estimasi Ketinggian Genangan (CM)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="water_level"
                                        value={form.water_level}
                                        onChange={handleChange}
                                        min="0"
                                        step="1"
                                        placeholder="Contoh: 50"
                                        required
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm font-bold text-slate-800 focus:border-teal-700 focus:bg-white focus:outline-none pr-12"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                                        CM
                                    </span>
                                </div>
                                {form.water_level && (
                                    <div className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold">
                                        <span className="text-slate-500">Estimasi Status:</span>
                                        <span
                                            className={`rounded px-1.5 py-0.5 text-[11px] ${
                                                getSeverityDetails(Number(form.water_level)).badgeClass
                                            }`}
                                        >
                                            {getSeverityDetails(Number(form.water_level)).label}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Deskripsi */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                    Keterangan / Kondisi Khusus
                                </label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Informasikan arus air, cuaca terkini, atau warga yang membutuhkan pertolongan khusus..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-xs text-slate-800 focus:border-teal-700 focus:bg-white focus:outline-none sm:text-sm"
                                />
                            </div>

                            {/* Unggah Foto Dokumentasi */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                    Dokumentasi Foto (Maksimal 5)
                                </label>

                                <div className="relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-4 transition hover:border-teal-700 hover:bg-teal-50/20">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        className="absolute inset-0 cursor-pointer opacity-0"
                                    />
                                    <UploadCloud className="mb-1 h-6 w-6 text-slate-400" />
                                    <span className="text-xs font-semibold text-slate-700">
                                        Sentuh untuk Ambil atau Unggah Foto
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                        Format JPG / PNG, Maksimal 2MB per foto
                                    </span>
                                </div>

                                {/* Thumbnail Preview */}
                                {imagePreviews.length > 0 && (
                                    <div className="mt-2 grid grid-cols-4 gap-2">
                                        {imagePreviews.map((preview, index) => (
                                            <div
                                                key={index}
                                                className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                                            >
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="h-full w-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute right-1 top-1 rounded-full bg-rose-600 p-1 text-white shadow-md transition hover:bg-rose-700"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Pesan Error / Sukses */}
                            {errorMessage && (
                                <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700">
                                    <AlertTriangle className="h-4 w-4 shrink-0" />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            {successMessage && (
                                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800">
                                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                                    <span>{successMessage}</span>
                                </div>
                            )}

                            {/* Tombol Aksi */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowReportForm(false)}
                                    className="w-1/3 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-600 transition hover:bg-slate-100"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex w-2/3 items-center justify-center gap-2 rounded-xl bg-teal-800 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-teal-900/20 transition hover:bg-teal-900 disabled:opacity-50"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Mengirim...</span>
                                        </>
                                    ) : (
                                        <span>Kirim Laporan Siaga</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
