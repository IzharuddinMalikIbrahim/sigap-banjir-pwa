import { Head } from '@inertiajs/react';
import axios from 'axios';
import {
    AlertCircle,
    AlertTriangle,
    BellRing,
    BookOpen,
    CheckCircle2,
    Clock,
    Crosshair,
    Droplets,
    Layers,
    LifeBuoy,
    Loader2,
    MapPin,
    Phone,
    Radio,
    Shield,
    ShieldAlert,
    Stethoscope,
    Tent,
    UploadCloud,
    Video as VideoIcon,
    Waves,
    X,
} from 'lucide-react';
import React, { useState } from 'react';

import FloodMap from '@/components/map/flood-map';
import type { FloodReport } from '@/types/flood';

interface VideoEducation {
    id: number;
    title: string;
    slug: string;
    thumbnail: string | null;
    video_path: string;
    description: string | null;
    category: string | null;
    duration: number | null;
    status: 'draft' | 'published' | 'archived';
    published_at: string | null;
    created_at: string;
}

interface HomeProps {
    reports: FloodReport[];
    videos?: VideoEducation[];
}

interface FloodReportForm {
    latitude: string;
    longitude: string;
    address: string;
    water_level: string;
    description: string;
}

export default function Home({ reports = [], videos = [] }: HomeProps) {
    const [showReportForm, setShowReportForm] = useState(false);
    const [showPoskoModal, setShowPoskoModal] = useState(false); 
    const [dismissAlert, setDismissAlert] = useState(false); // State notifikasi peringatan dini

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
            (file) => file.size > 10 * 1024 * 1024,
        );

        if (invalidFile) {
            setErrorMessage('Ukuran setiap file maksimal 10 MB.');

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

            <Head title="SIGAP BANJIR" />

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">

                <section className="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">
                            Pantau Banjir di Sekitar Anda
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Laporkan kondisi genangan secara langsung untuk membantu
                            masyarakat dan petugas.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setShowReportForm(true);
                            setErrorMessage('');
                            setSuccessMessage('');
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-rose-950/20 transition hover:bg-rose-700 active:scale-95"
                    >
                        <ShieldAlert className="h-4 w-4" />
                        Lapor Genangan
                    </button>
                </section>
                
                {/* --- NOTIFIKASI PERINGATAN DINI (EARLY WARNING) --- */}
                {/* Hanya muncul jika ada data laporan dan ketinggian maksimal >= 10cm */}
                {reports.length > 0 && maxWaterLevel >= 10 && !dismissAlert && (
                    <section 
                        className={`relative flex flex-col gap-3 rounded-2xl border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between ${
                            maxWaterLevel >= 50 ? 'border-red-200 bg-red-50/80' :
                            maxWaterLevel >= 30 ? 'border-orange-200 bg-orange-50/80' :
                            'border-amber-200 bg-amber-50/80'
                        }`}
                    >
                        <div className="flex items-start gap-3 sm:items-center">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm ${
                                maxWaterLevel >= 50 ? 'bg-red-100 text-red-600' :
                                maxWaterLevel >= 30 ? 'bg-orange-100 text-orange-600' :
                                'bg-amber-100 text-amber-600'
                            }`}>
                                <BellRing className={`h-5 w-5 ${maxWaterLevel >= 30 ? 'animate-pulse' : ''}`} />
                            </div>
                            <div className="pr-6 sm:pr-0">
                                <h3 className={`text-sm font-bold uppercase tracking-wider ${
                                    maxWaterLevel >= 50 ? 'text-red-900' :
                                    maxWaterLevel >= 30 ? 'text-orange-900' :
                                    'text-amber-900'
                                }`}>
                                    Peringatan Dini: Status {getSeverityDetails(maxWaterLevel).label}
                                </h3>
                                <p className={`mt-0.5 text-xs leading-relaxed ${
                                    maxWaterLevel >= 50 ? 'text-red-700' :
                                    maxWaterLevel >= 30 ? 'text-orange-700' :
                                    'text-amber-700'
                                }`}>
                                    Terdeteksi <strong className="font-bold">{reports.length} titik genangan air</strong> aktif dengan estimasi ketinggian maksimal mencapai <strong className="font-bold">{maxWaterLevel} cm</strong>. Masyarakat di wilayah terdampak diimbau untuk meningkatkan kesiapsiagaan dan melihat panduan mitigasi.
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setDismissAlert(true)}
                            className={`absolute right-3 top-3 rounded-full p-1.5 transition sm:static sm:right-auto sm:top-auto sm:shrink-0 ${
                                maxWaterLevel >= 50 ? 'text-red-400 hover:bg-red-100 hover:text-red-600' :
                                maxWaterLevel >= 30 ? 'text-orange-400 hover:bg-orange-100 hover:text-orange-600' :
                                'text-amber-400 hover:bg-amber-100 hover:text-amber-600'
                            }`}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </section>
                )}
                {/* --- END NOTIFIKASI PERINGATAN DINI --- */}

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

                    {/* Tombol pemicu modal Posko Evakuasi terintegrasi di Quick Metric */}
                    <button
                        onClick={() => setShowPoskoModal(true)}
                        className="flex flex-col items-start rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:border-amber-300 hover:bg-amber-50 hover:shadow-md active:scale-95 text-left"
                    >
                        <div className="flex w-full items-center justify-between text-slate-500">
                            <span className="text-xs font-semibold uppercase tracking-wider">
                                Posko & Darurat
                            </span>
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                        </div>
                        <p className="mt-2 text-base font-bold text-slate-900">
                            112 / Tim Siaga
                        </p>
                        <span className="mt-0.5 text-[11px] font-medium text-teal-700 underline decoration-teal-700/30 underline-offset-2">
                            Lihat Lokasi Evakuasi →
                        </span>
                    </button>
                </section>

                {/* Section Peta GIS */}
                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                                Pemantauan Spasial Genangan (GIS)
                            </h2>
                            <p className="text-xs text-slate-500">
                                Peta sebaran spasial lokasi genangan dan titik evakuasi secara langsung.
                            </p>
                        </div>
                        <div className="flex items-center justify-between gap-3 sm:justify-end">
                            {/* Tombol alternatif pemicu Posko Evakuasi di atas Peta */}
                            <button
                                onClick={() => setShowPoskoModal(true)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700 transition hover:bg-teal-100 hover:text-teal-900 ring-1 ring-inset ring-teal-200"
                            >
                                <Tent className="h-4 w-4" />
                                <span>Posko Evakuasi</span>
                            </button>
                            <div className="hidden items-center gap-2 text-[10px] font-medium sm:flex">
                                <span className="inline-flex items-center gap-1 text-slate-500">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Aman
                                </span>
                                <span className="inline-flex items-center gap-1 text-slate-500">
                                    <span className="h-2 w-2 rounded-full bg-amber-500" /> Waspada
                                </span>
                                <span className="inline-flex items-center gap-1 text-slate-500">
                                    <span className="h-2 w-2 rounded-full bg-rose-500" /> Bahaya
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200">
                        <FloodMap reports={reports} />
                    </div>
                </section>

                {/* Section Video Edukasi */}
                {videos && videos.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 sm:text-lg">
                                    <VideoIcon className="h-5 w-5 text-teal-700" />
                                    Video Edukasi Mitigasi
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Kumpulan video panduan mitigasi dan dokumentasi banjir.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-6">
                            {videos.map((video) => (
                                <div key={video.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md cursor-pointer">
                                    <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                                        <video
                                            controls
                                            playsInline
                                            preload="metadata"
                                            poster={video.thumbnail ? `/storage/${video.thumbnail}` : undefined}
                                            className="h-full w-full object-cover"
                                        >
                                            <source src={`/storage/${video.video_path}`} type="video/mp4" />
                                            Browser Anda tidak mendukung tag video.
                                        </video>
                                        {video.duration && (
                                            <div className="pointer-events-none absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                                                {Math.floor(video.duration / 60).toString().padStart(2, '0')}:
                                                {(video.duration % 60).toString().padStart(2, '0')}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900 group-hover:text-teal-700 transition-colors">
                                            {video.title}
                                        </h3>
                                        <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-500">
                                            {video.category && (
                                                <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600">
                                                    {video.category}
                                                </span>
                                            )}
                                        </div>
                                        {video.description && (
                                            <p className="mt-2 line-clamp-2 text-xs text-slate-500">
                                                {video.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Section Edukasi Mitigasi */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 sm:text-lg">
                                <BookOpen className="h-5 w-5 text-teal-700" />
                                Edukasi Mitigasi Banjir
                            </h2>
                            <p className="text-xs text-slate-500">
                                Panduan kesiapsiagaan dan langkah evakuasi saat menghadapi banjir.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        {/* Pra-Bencana */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                            <div className="mb-3 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-200">
                                    <AlertTriangle className="h-5 w-5" />
                                </div>
                                <h3 className="font-bold text-slate-800">Siaga (Sebelum)</h3>
                            </div>
                            <ul className="space-y-2.5 text-xs leading-relaxed text-slate-600">
                                <li className="flex gap-2">
                                    <span className="text-amber-500">•</span>
                                    <span>Simpan dokumen penting dan surat berharga dalam wadah kedap air di tempat yang tinggi.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-amber-500">•</span>
                                    <span>Siapkan Tas Siaga Bencana (P3K, senter, makanan instan, pakaian ganti).</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-amber-500">•</span>
                                    <span>Pantau terus notifikasi peringatan dini dari aplikasi SIGAP BANJIR.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Saat Bencana */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                            <div className="mb-3 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-200">
                                    <LifeBuoy className="h-5 w-5" />
                                </div>
                                <h3 className="font-bold text-slate-800">Tindakan (Saat)</h3>
                            </div>
                            <ul className="space-y-2.5 text-xs leading-relaxed text-slate-600">
                                <li className="flex gap-2">
                                    <span className="text-rose-500">•</span>
                                    <span>Matikan segera aliran listrik dari meteran utama (MCB) rumah Anda.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-rose-500">•</span>
                                    <span>Evakuasi diri dan keluarga ke posko terdekat atau tempat yang lebih tinggi.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-rose-500">•</span>
                                    <span>Hindari berjalan atau mengemudi menerobos genangan air dan arus deras.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Pasca Bencana */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                            <div className="mb-3 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-200">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <h3 className="font-bold text-slate-800">Pemulihan (Pasca)</h3>
                            </div>
                            <ul className="space-y-2.5 text-xs leading-relaxed text-slate-600">
                                <li className="flex gap-2">
                                    <span className="text-emerald-500">•</span>
                                    <span>Bersihkan rumah menggunakan disinfektan untuk mencegah penyebaran penyakit.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-emerald-500">•</span>
                                    <span>Waspadai binatang berbisa atau berbahaya yang mungkin terbawa oleh genangan air.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-emerald-500">•</span>
                                    <span>Pastikan instalasi listrik dan peralatan elektronik benar-benar kering sebelum dihidupkan.</span>
                                </li>
                            </ul>
                        </div>
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
            </div>

            {/* MODAL: POSKO EVAKUASI & NOMOR DARURAT */}
            {showPoskoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
                    <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-100 bg-white shadow-2xl">
                        {/* Header Modal */}
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
                            <div className="flex items-center space-x-2.5">
                                <div className="rounded-xl bg-teal-50 p-2 text-teal-700 ring-1 ring-teal-200">
                                    <Tent className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">
                                        Posko Evakuasi & Darurat
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Lokasi pengungsian, puskesmas, dan hotline
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowPoskoModal(false)}
                                className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Body Modal */}
                        <div className="space-y-6 p-6">
                            {/* Nomor Darurat */}
                            <div className="space-y-3">
                                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                                    <Phone className="h-4 w-4 text-rose-500" />
                                    Nomor Panggilan Darurat
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Call Center Bencana</p>
                                        <p className="mt-1 text-lg font-black text-slate-800">112</p>
                                    </div>
                                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Basarnas / Tim SAR</p>
                                        <p className="mt-1 text-lg font-black text-slate-800">115</p>
                                    </div>
                                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Ambulans</p>
                                        <p className="mt-1 text-lg font-black text-slate-800">118 / 119</p>
                                    </div>
                                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Posko BPBD</p>
                                        <p className="mt-1 text-lg font-black text-slate-800">(021) 123456</p>
                                    </div>
                                </div>
                            </div>

                            {/* Daftar Posko / Puskesmas */}
                            <div className="space-y-3">
                                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                                    <MapPin className="h-4 w-4 text-teal-600" />
                                    Titik Posko & Puskesmas Siaga
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex items-start gap-3 rounded-xl border border-slate-200/60 bg-white p-3 shadow-sm">
                                        <div className="rounded-lg bg-teal-50 p-2 text-teal-700">
                                            <Tent className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-slate-800 text-sm">Posko Utama GOR Serbaguna</h5>
                                            <p className="text-xs text-slate-500 mt-0.5">Kapasitas: 500 Jiwa • Tersedia Dapur Umum</p>
                                            <p className="text-xs text-slate-600 mt-1">Jl. Pemuda No. 10</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 rounded-xl border border-slate-200/60 bg-white p-3 shadow-sm">
                                        <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
                                            <Stethoscope className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-slate-800 text-sm">Puskesmas Kecamatan (Siaga 24 Jam)</h5>
                                            <p className="text-xs text-slate-500 mt-0.5">Penanganan Medis Pertama</p>
                                            <p className="text-xs text-slate-600 mt-1">Jl. Kesehatan Raya No. 45</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 rounded-xl border border-slate-200/60 bg-white p-3 shadow-sm">
                                        <div className="rounded-lg bg-teal-50 p-2 text-teal-700">
                                            <Tent className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-slate-800 text-sm">Balai Warga RW 03</h5>
                                            <p className="text-xs text-slate-500 mt-0.5">Kapasitas: 150 Jiwa</p>
                                            <p className="text-xs text-slate-600 mt-1">Jl. Cempaka III</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowPoskoModal(false)}
                                className="w-full rounded-xl bg-slate-100 py-3 text-xs font-bold uppercase tracking-wider text-slate-600 transition hover:bg-slate-200"
                            >
                                Tutup Informasi
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: FORM LAPOR BANJIR */}
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
                                        Format JPG / PNG, Maksimal 10MB per foto
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
