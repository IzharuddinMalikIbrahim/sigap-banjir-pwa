import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Droplets,
    ExternalLink,
    FileImage,
    MapPin,
    ShieldAlert,
    XCircle,
} from 'lucide-react';

import type { FloodReport } from '@/types/flood';

interface FloodReportImage {
    id: number;
    flood_report_id: number;
    file_path: string;
    file_name: string;
    mime_type: string;
    file_size: number;
    created_at: string;
    updated_at: string;
}

interface FloodReportDetail extends FloodReport {
    images?: FloodReportImage[];
}

interface ShowProps {
    report: FloodReportDetail;
}

const getSeverityConfig = (severity: string) => {
    switch (severity) {
        case 'safe':
            return {
                label: 'Aman',
                className:
                    'border-emerald-200 bg-emerald-50 text-emerald-700',
                dotClass: 'bg-emerald-500',
            };

        case 'warning':
            return {
                label: 'Waspada',
                className:
                    'border-amber-200 bg-amber-50 text-amber-700',
                dotClass: 'bg-amber-500',
            };

        case 'alert':
            return {
                label: 'Siaga',
                className:
                    'border-orange-200 bg-orange-50 text-orange-700',
                dotClass: 'bg-orange-500',
            };

        case 'high_alert':
            return {
                label: 'Siaga Tinggi',
                className:
                    'border-rose-200 bg-rose-50 text-rose-700',
                dotClass: 'bg-rose-500',
            };

        case 'danger':
            return {
                label: 'Bahaya / Darurat',
                className:
                    'border-red-200 bg-red-50 text-red-700',
                dotClass: 'bg-red-600',
            };

        default:
            return {
                label: severity,
                className:
                    'border-slate-200 bg-slate-100 text-slate-600',
                dotClass: 'bg-slate-400',
            };
    }
};

const getStatusConfig = (status: string) => {
    switch (status) {
        case 'submitted':
            return {
                label: 'Menunggu Verifikasi',
                description:
                    'Laporan telah diterima dan menunggu pemeriksaan petugas.',
                className:
                    'border-blue-200 bg-blue-50 text-blue-700',
                icon: Clock3,
            };

        case 'verification':
            return {
                label: 'Sedang Diverifikasi',
                description:
                    'Petugas sedang melakukan proses verifikasi terhadap laporan.',
                className:
                    'border-amber-200 bg-amber-50 text-amber-700',
                icon: ShieldAlert,
            };

        case 'verified':
            return {
                label: 'Terverifikasi',
                description:
                    'Laporan telah dinyatakan valid oleh petugas.',
                className:
                    'border-emerald-200 bg-emerald-50 text-emerald-700',
                icon: CheckCircle2,
            };

        case 'published':
            return {
                label: 'Dipublikasikan',
                description:
                    'Laporan telah dipublikasikan pada sistem SIGAP BANJIR.',
                className:
                    'border-teal-200 bg-teal-50 text-teal-700',
                icon: CheckCircle2,
            };

        case 'rejected':
            return {
                label: 'Ditolak',
                description:
                    'Laporan tidak lolos proses verifikasi.',
                className:
                    'border-rose-200 bg-rose-50 text-rose-700',
                icon: XCircle,
            };

        case 'expired':
            return {
                label: 'Kedaluwarsa',
                description:
                    'Laporan sudah melewati masa berlaku.',
                className:
                    'border-slate-200 bg-slate-100 text-slate-600',
                icon: Clock3,
            };

        default:
            return {
                label: status,
                description: 'Status laporan.',
                className:
                    'border-slate-200 bg-slate-100 text-slate-600',
                icon: Clock3,
            };
    }
};

const formatDate = (
    date: string | null | undefined,
) => {
    if (!date) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(date));
};

const formatFileSize = (size: number) => {
    if (size < 1024) {
        return `${size} B`;
    }

    if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const getImageUrl = (path: string) => {
    if (
        path.startsWith('http://') ||
        path.startsWith('https://')
    ) {
        return path;
    }

    return `/storage/${path}`;
};

export default function Show({
    report,
}: ShowProps) {
    const severity = getSeverityConfig(
        report.severity,
    );

    const status = getStatusConfig(
        report.status,
    );

    const StatusIcon = status.icon;

    return (
        <>
            <Head title={`Detail Laporan #${report.id} - SIGAP BANJIR`} />

            <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Link
                            href="/my-reports"
                            className="mb-3 inline-flex items-center gap-2 text-xs font-semibold text-teal-700 transition hover:text-teal-900"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Laporan Saya
                        </Link>

                        <h1 className="text-2xl font-black text-slate-900">
                            Detail Laporan Banjir
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Laporan #{report.id}
                        </p>
                    </div>
                </div>

                {/* Status */}
                <section
                    className={`rounded-2xl border p-5 ${status.className}`}
                >
                    <div className="flex items-start gap-3">
                        <StatusIcon className="mt-0.5 h-5 w-5 shrink-0" />

                        <div>
                            <h2 className="font-bold">
                                {status.label}
                            </h2>

                            <p className="mt-1 text-sm opacity-90">
                                {status.description}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Main Information */}
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">

                    {/* Left */}
                    <div className="space-y-6">

                        {/* Flood Information */}
                        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Informasi Laporan
                                    </h2>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Data kondisi banjir yang Anda laporkan.
                                    </p>
                                </div>

                                <Droplets className="h-5 w-5 text-teal-700" />
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">

                                {/* Water Level */}
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Ketinggian Genangan
                                    </p>

                                    <div className="mt-2 flex items-baseline gap-2">
                                        <span className="text-4xl font-black text-teal-800">
                                            {report.water_level}
                                        </span>

                                        <span className="text-sm font-bold text-slate-500">
                                            cm
                                        </span>
                                    </div>
                                </div>

                                {/* Severity */}
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Tingkat Keparahan
                                    </p>

                                    <div className="mt-3">
                                        <span
                                            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold ${severity.className}`}
                                        >
                                            <span
                                                className={`h-2 w-2 rounded-full ${severity.dotClass}`}
                                            />

                                            {severity.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Lokasi
                                    </p>

                                    <div className="mt-2 flex gap-2">
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />

                                        <p className="text-sm font-semibold leading-relaxed text-slate-800">
                                            {report.address}
                                        </p>
                                    </div>
                                </div>

                                {/* Coordinates */}
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Latitude
                                    </p>

                                    <p className="mt-2 font-mono text-sm text-slate-800">
                                        {Number(
                                            report.latitude,
                                        ).toFixed(8)}
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Longitude
                                    </p>

                                    <p className="mt-2 font-mono text-sm text-slate-800">
                                        {Number(
                                            report.longitude,
                                        ).toFixed(8)}
                                    </p>
                                </div>

                                {/* Description */}
                                <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Deskripsi
                                    </p>

                                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                                        {report.description ||
                                            'Tidak ada deskripsi tambahan.'}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Images */}
                        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                            <div className="mb-5 border-b border-slate-100 pb-4">
                                <h2 className="text-lg font-bold text-slate-900">
                                    Dokumentasi Foto
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Foto yang dilampirkan saat membuat laporan.
                                </p>
                            </div>

                            {!report.images ||
                            report.images.length === 0 ? (
                                <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center">
                                    <FileImage className="h-10 w-10 text-slate-300" />

                                    <p className="mt-3 text-sm font-semibold text-slate-600">
                                        Tidak ada dokumentasi foto
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                                    {report.images.map(
                                        (image) => (
                                            <a
                                                key={image.id}
                                                href={getImageUrl(
                                                    image.file_path,
                                                )}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                                            >
                                                <div className="aspect-square overflow-hidden bg-slate-100">
                                                    <img
                                                        src={getImageUrl(
                                                            image.file_path,
                                                        )}
                                                        alt={
                                                            image.file_name
                                                        }
                                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                    />
                                                </div>

                                                <div className="p-3">
                                                    <p className="truncate text-xs font-semibold text-slate-700">
                                                        {
                                                            image.file_name
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-[10px] text-slate-400">
                                                        {
                                                            image.mime_type
                                                        }{' '}
                                                        •{' '}
                                                        {formatFileSize(
                                                            image.file_size,
                                                        )}
                                                    </p>
                                                </div>
                                            </a>
                                        ),
                                    )}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right */}
                    <aside className="space-y-6">

                        {/* Timeline */}
                        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="mb-5">
                                <h2 className="text-lg font-bold text-slate-900">
                                    Status Laporan
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Riwayat proses laporan.
                                </p>
                            </div>

                            <div className="space-y-5">

                                {/* Submitted */}
                                <div className="flex gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                        <Clock3 className="h-4 w-4" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold text-slate-800">
                                            Laporan Dikirim
                                        </p>

                                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                            <CalendarDays className="h-3.5 w-3.5" />
                                            {formatDate(
                                                report.reported_at,
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Verified */}
                                <div className="flex gap-3">
                                    <div
                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                            report.verified_at
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : 'bg-slate-100 text-slate-400'
                                        }`}
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold text-slate-800">
                                            Verifikasi
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {report.verified_at
                                                ? formatDate(
                                                      report.verified_at,
                                                  )
                                                : 'Belum diverifikasi'}
                                        </p>
                                    </div>
                                </div>

                                {/* Expired */}
                                <div className="flex gap-3">
                                    <div
                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                            report.expired_at
                                                ? 'bg-slate-100 text-slate-500'
                                                : 'bg-slate-100 text-slate-400'
                                        }`}
                                    >
                                        <Clock3 className="h-4 w-4" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold text-slate-800">
                                            Masa Berlaku
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {report.expired_at
                                                ? formatDate(
                                                      report.expired_at,
                                                  )
                                                : 'Masih aktif'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Location */}
                        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="mb-4">
                                <h2 className="text-lg font-bold text-slate-900">
                                    Lokasi Laporan
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Koordinat lokasi kejadian.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <div className="grid gap-3">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            Latitude
                                        </p>

                                        <p className="mt-1 font-mono text-xs text-slate-800">
                                            {report.latitude}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            Longitude
                                        </p>

                                        <p className="mt-1 font-mono text-xs text-slate-800">
                                            {report.longitude}
                                        </p>
                                    </div>
                                </div>

                                <a
                                    href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-800 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-teal-900"
                                >
                                    <MapPin className="h-4 w-4" />
                                    Buka di Google Maps
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                            </div>
                        </section>

                    </aside>
                </div>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        {
            title: 'Laporan Saya',
            href: '/my-reports',
        },
        {
            title: 'Detail Laporan',
            href: '#',
        },
    ],
};
