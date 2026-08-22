import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    Clock3,
    Droplets,
    Eye,
    MapPin,
    XCircle,
} from 'lucide-react';

import type { FloodReport } from '@/types/flood';

interface PaginatedReports {
    data: FloodReport[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface MyReportsProps {
    reports: PaginatedReports;
}

const getStatusConfig = (status: string) => {
    switch (status) {
        case 'submitted':
            return {
                label: 'Menunggu Verifikasi',
                className:
                    'border-blue-200 bg-blue-50 text-blue-700',
                icon: Clock3,
            };

        case 'verification':
            return {
                label: 'Sedang Diverifikasi',
                className:
                    'border-amber-200 bg-amber-50 text-amber-700',
                icon: AlertCircle,
            };

        case 'verified':
            return {
                label: 'Terverifikasi',
                className:
                    'border-emerald-200 bg-emerald-50 text-emerald-700',
                icon: CheckCircle2,
            };

        case 'published':
            return {
                label: 'Dipublikasikan',
                className:
                    'border-teal-200 bg-teal-50 text-teal-700',
                icon: CheckCircle2,
            };

        case 'rejected':
            return {
                label: 'Ditolak',
                className:
                    'border-rose-200 bg-rose-50 text-rose-700',
                icon: XCircle,
            };

        case 'expired':
            return {
                label: 'Kedaluwarsa',
                className:
                    'border-slate-200 bg-slate-100 text-slate-600',
                icon: Clock3,
            };

        default:
            return {
                label: status,
                className:
                    'border-slate-200 bg-slate-100 text-slate-600',
                icon: AlertCircle,
            };
    }
};

const getSeverityConfig = (severity: string) => {
    switch (severity) {
        case 'safe':
            return {
                label: 'Aman',
                className:
                    'border-emerald-200 bg-emerald-50 text-emerald-700',
            };

        case 'warning':
            return {
                label: 'Waspada',
                className:
                    'border-amber-200 bg-amber-50 text-amber-700',
            };

        case 'alert':
            return {
                label: 'Siaga',
                className:
                    'border-orange-200 bg-orange-50 text-orange-700',
            };

        case 'high_alert':
            return {
                label: 'Siaga Tinggi',
                className:
                    'border-rose-200 bg-rose-50 text-rose-700',
            };

        case 'danger':
            return {
                label: 'Bahaya',
                className:
                    'border-red-200 bg-red-50 text-red-700',
            };

        default:
            return {
                label: severity,
                className:
                    'border-slate-200 bg-slate-100 text-slate-600',
            };
    }
};

const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(date));
};

export default function MyReports({
    reports,
}: MyReportsProps) {
    return (
        <>
            <Head title="Laporan Saya - SIGAP BANJIR" />

            <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">

                {/* Header */}
                <section className="rounded-3xl bg-teal-800 p-6 text-white shadow-md md:p-8">
                    <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                            <Droplets className="h-7 w-7 text-teal-100" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-black tracking-tight">
                                Laporan Saya
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-teal-100/90">
                                Lihat riwayat laporan banjir yang pernah
                                Anda kirimkan dan pantau proses
                                verifikasinya.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Summary */}
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Total Laporan
                        </p>

                        <p className="mt-2 text-3xl font-black text-slate-900">
                            {reports.total}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Menunggu
                        </p>

                        <p className="mt-2 text-3xl font-black text-blue-600">
                            {
                                reports.data.filter(
                                    (report) =>
                                        report.status ===
                                            'submitted' ||
                                        report.status ===
                                            'verification',
                                ).length
                            }
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Terverifikasi
                        </p>

                        <p className="mt-2 text-3xl font-black text-emerald-600">
                            {
                                reports.data.filter(
                                    (report) =>
                                        report.status ===
                                            'verified' ||
                                        report.status ===
                                            'published',
                                ).length
                            }
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Ditolak
                        </p>

                        <p className="mt-2 text-3xl font-black text-rose-600">
                            {
                                reports.data.filter(
                                    (report) =>
                                        report.status === 'rejected',
                                ).length
                            }
                        </p>
                    </div>
                </section>

                {/* Reports */}
                <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-5 py-5 md:px-6">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Riwayat Laporan Genangan
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Daftar laporan yang pernah Anda kirimkan.
                                </p>
                            </div>

                            <Link
                                href="/"
                                className="inline-flex items-center justify-center rounded-xl bg-teal-800 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-teal-900"
                            >
                                Lihat Peta Banjir
                            </Link>
                        </div>
                    </div>

                    {reports.data.length === 0 ? (
                        <div className="flex min-h-[320px] flex-col items-center justify-center px-6 py-12 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                                <Droplets className="h-8 w-8" />
                            </div>

                            <h3 className="mt-4 text-base font-bold text-slate-800">
                                Belum Ada Laporan
                            </h3>

                            <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                                Anda belum pernah mengirimkan laporan banjir.
                                Silakan kembali ke halaman utama untuk
                                membuat laporan.
                            </p>

                            <Link
                                href="/"
                                className="mt-5 rounded-xl bg-teal-800 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-teal-900"
                            >
                                Buat Laporan
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {reports.data.map((report) => {
                                const status =
                                    getStatusConfig(report.status);

                                const severity =
                                    getSeverityConfig(
                                        report.severity,
                                    );

                                const StatusIcon = status.icon;

                                return (
                                    <article
                                        key={report.id}
                                        className="p-5 transition hover:bg-slate-50/70 md:p-6"
                                    >
                                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                            {/* Main */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-bold ${status.className}`}
                                                    >
                                                        <StatusIcon className="h-3.5 w-3.5" />

                                                        {status.label}
                                                    </span>

                                                    <span
                                                        className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold ${severity.className}`}
                                                    >
                                                        {severity.label}
                                                    </span>
                                                </div>

                                                <h3 className="mt-3 text-base font-bold text-slate-900">
                                                    {report.address}
                                                </h3>

                                                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                            Ketinggian
                                                        </p>

                                                        <p className="mt-1 text-sm font-bold text-slate-800">
                                                            {report.water_level}{' '}
                                                            cm
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                            Dilaporkan
                                                        </p>

                                                        <p className="mt-1 text-sm font-medium text-slate-700">
                                                            {formatDate(
                                                                report.reported_at,
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                            Koordinat
                                                        </p>

                                                        <p className="mt-1 flex items-center gap-1 text-sm font-mono text-slate-700">
                                                            <MapPin className="h-3.5 w-3.5 text-teal-700" />

                                                            {Number(
                                                                report.latitude,
                                                            ).toFixed(5)}
                                                            ,{' '}
                                                            {Number(
                                                                report.longitude,
                                                            ).toFixed(5)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {report.description && (
                                                    <div className="mt-4 rounded-xl bg-slate-50 p-3">
                                                        <p className="text-xs leading-relaxed text-slate-600">
                                                            {report.description}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action */}
                                            <div className="shrink-0">
                                                <Link
                                                    href={`/flood-reports/${report.id}`}
                                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-teal-700 hover:bg-teal-50 hover:text-teal-800 lg:w-auto"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    Detail
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* Pagination */}
                {reports.last_page > 1 && (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-xs text-slate-500">
                            Menampilkan{' '}
                            <strong>{reports.from}</strong>{' '}
                            sampai{' '}
                            <strong>{reports.to}</strong>{' '}
                            dari{' '}
                            <strong>{reports.total}</strong>{' '}
                            laporan
                        </p>

                        <div className="flex gap-2">
                            {reports.current_page > 1 && (
                                <Link
                                    href={`/my-reports?page=${
                                        reports.current_page - 1
                                    }`}
                                    className="rounded-xl border bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Sebelumnya
                                </Link>
                            )}

                            {reports.current_page <
                                reports.last_page && (
                                <Link
                                    href={`/my-reports?page=${
                                        reports.current_page + 1
                                    }`}
                                    className="rounded-xl bg-teal-800 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-900"
                                >
                                    Berikutnya
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

MyReports.layout = {
    breadcrumbs: [
        {
            title: 'Laporan Saya',
            href: '/my-reports',
        },
    ],
};
