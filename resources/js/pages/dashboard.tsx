import { Head } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock,
    Droplets,
    Layers,
    Waves,
} from 'lucide-react';

interface DashboardStats {
    total_reports: number;
    submitted_reports: number;
    verification_reports: number;
    verified_reports: number;
    rejected_reports: number;
    expired_reports: number;
}

interface FloodReport {
    id: number;
    address: string;
    water_level: number | string;
    severity: string;
    status: string;
    description: string | null;
    reported_at: string;
}

interface DashboardProps {
    stats: DashboardStats;
    recentReports: FloodReport[];
}

const statusConfig: Record<
    string,
    {
        label: string;
        className: string;
    }
> = {
    submitted: {
        label: 'Menunggu Verifikasi',
        className:
            'bg-blue-50 text-blue-700 border-blue-200',
    },

    verification: {
        label: 'Sedang Diverifikasi',
        className:
            'bg-amber-50 text-amber-700 border-amber-200',
    },

    verified: {
        label: 'Terverifikasi',
        className:
            'bg-emerald-50 text-emerald-700 border-emerald-200',
    },

    published: {
        label: 'Dipublikasikan',
        className:
            'bg-teal-50 text-teal-700 border-teal-200',
    },

    rejected: {
        label: 'Ditolak',
        className:
            'bg-rose-50 text-rose-700 border-rose-200',
    },

    expired: {
        label: 'Kedaluwarsa',
        className:
            'bg-slate-100 text-slate-600 border-slate-200',
    },
};

const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(date));
};

export default function Dashboard({
    stats,
    recentReports,
}: DashboardProps) {
    return (
        <div className="font-sans text-slate-800 antialiased selection:bg-teal-700 selection:text-white">
            <Head title="Dashboard Komunitas - SIGAP BANJIR" />

            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-6">

                {/* Welcome Banner */}
                <section className="relative overflow-hidden rounded-3xl bg-teal-800 p-6 shadow-md md:p-8">
                    <Waves className="absolute -bottom-6 -right-6 h-48 w-48 text-teal-700/30" />

                    <div className="relative z-10 flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-teal-100 ring-1 ring-white/20 backdrop-blur-md">
                            <Waves className="h-7 w-7" />
                        </div>

                        <div>
                            <h1 className="text-xl font-black tracking-tight text-white md:text-2xl">
                                Selamat Datang di SIGAP BANJIR
                            </h1>

                            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-teal-100/90">
                                Pantau kondisi genangan air, lihat progres
                                verifikasi laporan, dan kelola aktivitas
                                partisipasi mitigasi Anda.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Summary */}
                <section className="grid gap-4 md:grid-cols-3">

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between text-slate-500">
                            <span className="text-xs font-bold uppercase tracking-wider">
                                Laporan Saya
                            </span>

                            <Layers className="h-5 w-5 text-teal-700" />
                        </div>

                        <p className="mt-3 text-3xl font-black text-slate-900">
                            {stats.total_reports}
                        </p>

                        <p className="mt-1.5 text-[11px] font-medium text-slate-400">
                            Total laporan yang Anda kirim
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between text-slate-500">
                            <span className="text-xs font-bold uppercase tracking-wider">
                                Menunggu Verifikasi
                            </span>

                            <Clock className="h-5 w-5 text-amber-500" />
                        </div>

                        <p className="mt-3 text-3xl font-black text-amber-600">
                            {stats.submitted_reports +
                                stats.verification_reports}
                        </p>

                        <p className="mt-1.5 text-[11px] font-medium text-slate-400">
                            Laporan sedang diperiksa petugas
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between text-slate-500">
                            <span className="text-xs font-bold uppercase tracking-wider">
                                Terverifikasi
                            </span>

                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        </div>

                        <p className="mt-3 text-3xl font-black text-emerald-600">
                            {stats.verified_reports}
                        </p>

                        <p className="mt-1.5 text-[11px] font-medium text-slate-400">
                            Laporan valid dan dipublikasikan
                        </p>
                    </div>
                </section>

                {/* Recent Reports */}
                <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Riwayat Laporan Genangan
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Daftar laporan banjir yang Anda kirimkan.
                            </p>
                        </div>
                    </div>

                    {recentReports.length === 0 ? (
                        <div className="mt-6 flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                                <Droplets className="h-8 w-8" />
                            </div>

                            <p className="mt-4 text-sm font-bold text-slate-800">
                                Belum Ada Riwayat Laporan
                            </p>

                            <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-slate-500">
                                Laporan genangan yang Anda kirimkan melalui
                                sistem akan muncul di sini.
                            </p>

                            <a
                                href="/"
                                className="mt-5 rounded-xl bg-teal-800 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-teal-900"
                            >
                                Buat Laporan
                            </a>
                        </div>
                    ) : (
                        <div className="mt-6 space-y-3">
                            {recentReports.map((report) => {
                                const currentStatus =
                                    statusConfig[
                                        report.status
                                    ] ?? {
                                        label: report.status,
                                        className:
                                            'bg-slate-100 text-slate-600 border-slate-200',
                                    };

                                return (
                                    <div
                                        key={report.id}
                                        className="rounded-2xl border border-slate-200 p-4 transition hover:border-teal-300 hover:bg-slate-50"
                                    >
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-slate-800">
                                                    {report.address}
                                                </h3>

                                                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                                    <span>
                                                        Ketinggian:{' '}
                                                        <strong className="text-teal-800">
                                                            {report.water_level}{' '}
                                                            cm
                                                        </strong>
                                                    </span>

                                                    <span>
                                                        {formatDate(
                                                            report.reported_at,
                                                        )}
                                                    </span>
                                                </div>

                                                {report.description && (
                                                    <p className="mt-2 line-clamp-2 text-xs text-slate-500">
                                                        {
                                                            report.description
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <span
                                                className={`inline-flex shrink-0 items-center rounded-lg border px-2.5 py-1 text-[10px] font-bold ${currentStatus.className}`}
                                            >
                                                {
                                                    currentStatus.label
                                                }
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {recentReports.length > 0 && (
                        <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
                            <a
                                href="/my-reports"
                                className="text-xs font-bold text-teal-700 hover:text-teal-900"
                            >
                                Lihat Semua Laporan →
                            </a>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard Komunitas',
            href: '/dashboard',
        },
    ],
};
