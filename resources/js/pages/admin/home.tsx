import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRight,
    Bell,
    CheckCircle2,
    Clock3,
    Droplets,
    FileWarning,
    Layers,
    MapPin,
    ShieldAlert,
    Tent,
    Users,
    XCircle,
} from 'lucide-react';

interface DashboardStats {
    total_reports: number;
    submitted_reports: number;
    verification_reports: number;
    verified_reports: number;
    published_reports: number;
    rejected_reports: number;
    expired_reports: number;
    total_users: number;
    total_evacuation_posts: number;
    active_evacuation_posts: number;
    unread_notifications: number;
    highest_water_level: number;
}

interface RecentReport {
    id: number;
    address: string;
    water_level: number | string;
    severity: string;
    status: string;
    reported_at: string;
    user?: {
        id: number;
        name: string;
    } | null;
}

interface AdminHomeProps {
    stats?: Partial<DashboardStats>;
    recentReports?: RecentReport[];
    severityStatistics?: {
        safe: number;
        warning: number;
        alert: number;
        high_alert: number;
        danger: number;
    };
}

const defaultStats: DashboardStats = {
    total_reports: 0,
    submitted_reports: 0,
    verification_reports: 0,
    verified_reports: 0,
    published_reports: 0,
    rejected_reports: 0,
    expired_reports: 0,
    total_users: 0,
    total_evacuation_posts: 0,
    active_evacuation_posts: 0,
    unread_notifications: 0,
    highest_water_level: 0,
};

const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(date));
};

const getStatusConfig = (status: string) => {
    switch (status) {
        case 'submitted':
            return {
                label: 'Masuk',
                className: 'border-blue-200 bg-blue-50 text-blue-700',
                icon: Clock3,
            };
        case 'verification':
            return {
                label: 'Verifikasi',
                className: 'border-amber-200 bg-amber-50 text-amber-700',
                icon: ShieldAlert,
            };
        case 'verified':
            return {
                label: 'Terverifikasi',
                className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
                icon: CheckCircle2,
            };
        case 'published':
            return {
                label: 'Dipublikasikan',
                className: 'border-teal-200 bg-teal-50 text-teal-700',
                icon: CheckCircle2,
            };
        case 'rejected':
            return {
                label: 'Ditolak',
                className: 'border-rose-200 bg-rose-50 text-rose-700',
                icon: XCircle,
            };
        case 'expired':
            return {
                label: 'Kedaluwarsa',
                className: 'border-slate-200 bg-slate-100 text-slate-600',
                icon: Clock3,
            };
        default:
            return {
                label: status,
                className: 'border-slate-200 bg-slate-100 text-slate-600',
                icon: AlertCircle,
            };
    }
};

const getSeverityConfig = (severity: string) => {
    switch (severity) {
        case 'safe':
            return {
                label: 'Aman',
                className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
            };
        case 'warning':
            return {
                label: 'Waspada',
                className: 'border-amber-200 bg-amber-50 text-amber-700',
            };
        case 'alert':
            return {
                label: 'Siaga',
                className: 'border-orange-200 bg-orange-50 text-orange-700',
            };
        case 'high_alert':
            return {
                label: 'Siaga Tinggi',
                className: 'border-rose-200 bg-rose-50 text-rose-700',
            };
        case 'danger':
            return {
                label: 'Bahaya',
                className: 'border-red-200 bg-red-50 text-red-700',
            };
        default:
            return {
                label: severity,
                className: 'border-slate-200 bg-slate-100 text-slate-600',
            };
    }
};

export default function AdminHome({
    stats: statsProps = {},
    recentReports = [],
    severityStatistics = {
        safe: 0,
        warning: 0,
        alert: 0,
        high_alert: 0,
        danger: 0,
    },
}: AdminHomeProps) {
    const stats: DashboardStats = {
        ...defaultStats,
        ...statsProps,
    };

    return (
        <>
            <Head title="Dashboard Admin - SIGAP BANJIR" />

            <div className="min-h-full w-full bg-slate-50 font-sans text-slate-800 antialiased">
                <div className="mx-auto w-full max-w-[1600px] space-y-6 p-4 md:p-6 lg:p-8">

                    {/* Header */}
                    <section className="relative overflow-hidden rounded-3xl bg-teal-800 p-6 text-white shadow-lg md:p-8">
                        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/5" />
                        <div className="absolute -bottom-24 right-24 h-56 w-56 rounded-full bg-white/5" />

                        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-teal-100 ring-1 ring-white/10">
                                    <ShieldAlert className="h-3.5 w-3.5" />
                                    Administrator Panel
                                </div>

                                <h1 className="text-2xl font-black tracking-tight md:text-3xl">
                                    Dashboard SIGAP BANJIR
                                </h1>

                                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-teal-100/90">
                                    Pantau laporan banjir, proses verifikasi,
                                    kondisi genangan, dan kesiapan posko
                                    evakuasi dari satu tempat.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Link
                                    href="/admin/floodreport"
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-bold text-teal-800 transition hover:bg-teal-50 sm:w-auto sm:py-2.5"
                                >
                                    <FileWarning className="h-4 w-4" />
                                    Kelola Laporan
                                </Link>

                                <Link
                                    href="/admin/posko"
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-xs font-bold text-white ring-1 ring-white/20 transition hover:bg-white/20 sm:w-auto sm:py-2.5"
                                >
                                    <Tent className="h-4 w-4" />
                                    Kelola Posko
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Main Metrics */}
                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Total Laporan
                                </span>
                                <Layers className="h-5 w-5 text-teal-700" />
                            </div>
                            <p className="mt-3 text-3xl font-black text-slate-900">
                                {stats.total_reports}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                                Seluruh laporan yang masuk
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Perlu Tindakan
                                </span>
                                <Clock3 className="h-5 w-5 text-amber-500" />
                            </div>
                            <p className="mt-3 text-3xl font-black text-amber-600">
                                {stats.submitted_reports + stats.verification_reports}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                                Menunggu / sedang diverifikasi
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Dipublikasikan
                                </span>
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            </div>
                            <p className="mt-3 text-3xl font-black text-emerald-600">
                                {stats.published_reports}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                                Laporan aktif di peta publik
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Genangan Tertinggi
                                </span>
                                <Droplets className="h-5 w-5 text-rose-600" />
                            </div>
                            <p className="mt-3 text-3xl font-black text-rose-600">
                                {stats.highest_water_level}
                                <span className="ml-1 text-sm">cm</span>
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                                Berdasarkan laporan aktif
                            </p>
                        </div>
                    </section>

                    {/* Secondary Metrics */}
                    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <FileWarning className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Terverifikasi
                                    </p>
                                    <p className="text-xl font-black text-slate-900">
                                        {stats.verified_reports}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                                    <XCircle className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Ditolak
                                    </p>
                                    <p className="text-xl font-black text-slate-900">
                                        {stats.rejected_reports}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Pengguna
                                    </p>
                                    <p className="text-xl font-black text-slate-900">
                                        {stats.total_users}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                    <Tent className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Posko Aktif
                                    </p>
                                    <p className="text-xl font-black text-slate-900">
                                        {stats.active_evacuation_posts}
                                    </p>
                                    <p className="text-[10px] text-slate-400">
                                        dari {stats.total_evacuation_posts} posko
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Action + Status */}
                    {/* Perhatikan 'items-start' di sini agar panel kanan tidak dipaksa setinggi panel kiri */}
                    <section className="grid gap-6 items-start xl:grid-cols-[minmax(0,1fr)_360px]">

                        {/* Recent Reports (Kiri) */}
                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 md:px-6">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Laporan Terbaru
                                    </h2>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Laporan terbaru yang masuk ke sistem.
                                    </p>
                                </div>
                                <Link
                                    href="/admin/floodreport"
                                    className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900"
                                >
                                    Lihat Semua
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>

                            {recentReports.length === 0 ? (
                                <div className="flex min-h-[280px] flex-col items-center justify-center p-8 text-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                                        <Droplets className="h-8 w-8" />
                                    </div>
                                    <h3 className="mt-4 text-sm font-bold text-slate-800">
                                        Belum Ada Laporan
                                    </h3>
                                    <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
                                        Laporan banjir yang masuk akan ditampilkan di sini.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {recentReports.map((report) => {
                                        const status = getStatusConfig(report.status);
                                        const severity = getSeverityConfig(report.severity);
                                        const StatusIcon = status.icon;

                                        return (
                                            <div
                                                key={report.id}
                                                className="p-5 transition hover:bg-slate-50 md:p-6"
                                            >
                                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-bold ${status.className}`}>
                                                                <StatusIcon className="h-3.5 w-3.5" />
                                                                {status.label}
                                                            </span>
                                                            <span className={`rounded-lg border px-2.5 py-1 text-[10px] font-bold ${severity.className}`}>
                                                                {severity.label}
                                                            </span>
                                                        </div>

                                                        <h3 className="mt-3 line-clamp-2 text-sm font-bold text-slate-900 md:line-clamp-1">
                                                            {report.address}
                                                        </h3>

                                                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-400">
                                                            <span className="flex items-center gap-1">
                                                                <Droplets className="h-3.5 w-3.5 text-teal-700" />
                                                                {report.water_level} cm
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <MapPin className="h-3.5 w-3.5 text-teal-700" />
                                                                Lokasi
                                                            </span>
                                                            {report.user && (
                                                                <span>
                                                                    Pelapor:{' '}
                                                                    <strong className="text-slate-600">
                                                                        {report.user.name}
                                                                    </strong>
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p className="mt-2 text-[11px] text-slate-400">
                                                            {formatDate(report.reported_at)}
                                                        </p>
                                                    </div>

                                                    <Link
                                                        href={`/admin/floodreport/${report.id}`}
                                                        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-teal-700 hover:bg-teal-50 hover:text-teal-800 w-full md:w-auto"
                                                    >
                                                        Detail Laporan
                                                        <ArrowRight className="h-3.5 w-3.5" />
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Right Panel (Kanan) - Sidebar Semu */}
                        {/* 'xl:sticky xl:top-6' akan mengunci posisi panel ini di desktop saat digulir */}
                        <div className="space-y-6 xl:sticky xl:top-6">
                            
                            {/* Verification Queue */}
                            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-base font-bold text-slate-900">
                                            Antrian Verifikasi
                                        </h2>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Laporan yang membutuhkan tindakan.
                                        </p>
                                    </div>
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                        <ShieldAlert className="h-5 w-5" />
                                    </div>
                                </div>

                                <div className="mt-5 space-y-3">
                                    <div className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3">
                                        <span className="text-xs font-semibold text-blue-800">
                                            Laporan Baru
                                        </span>
                                        <span className="text-lg font-black text-blue-700">
                                            {stats.submitted_reports}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3">
                                        <span className="text-xs font-semibold text-amber-800">
                                            Sedang Diverifikasi
                                        </span>
                                        <span className="text-lg font-black text-amber-700">
                                            {stats.verification_reports}
                                        </span>
                                    </div>
                                </div>

                                <Link
                                    href="/admin/floodreport"
                                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-800 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-teal-900"
                                >
                                    Buka Antrian
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>

                            {/* Notifications */}
                            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-base font-bold text-slate-900">
                                            Notifikasi Admin
                                        </h2>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Pemberitahuan yang belum diproses.
                                        </p>
                                    </div>
                                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                                        <Bell className="h-5 w-5" />
                                        {stats.unread_notifications > 0 && (
                                            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[9px] font-black text-white">
                                                {stats.unread_notifications}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                                    <p className="text-xs font-semibold text-slate-700">
                                        {stats.unread_notifications > 0
                                            ? `${stats.unread_notifications} notifikasi belum dibaca`
                                            : 'Tidak ada notifikasi baru'}
                                    </p>
                                    <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                                        Pastikan setiap laporan penting segera ditindaklanjuti.
                                    </p>
                                </div>

                                <Link
                                    href="/admin/notifications"
                                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900"
                                >
                                    Lihat Notifikasi
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Severity Overview */}
                    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                        <div className="mb-5">
                            <h2 className="text-lg font-bold text-slate-900">
                                Ringkasan Kondisi Banjir
                            </h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Distribusi tingkat keparahan berdasarkan laporan aktif.
                            </p>
                        </div>

                        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                                    Aman
                                </p>
                                <p className="mt-2 text-2xl font-black text-emerald-800">
                                    {severityStatistics.safe}
                                </p>
                                <p className="mt-1 text-[10px] text-emerald-600">
                                    safe
                                </p>
                            </div>

                            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                                <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                                    Waspada
                                </p>
                                <p className="mt-2 text-2xl font-black text-amber-800">
                                    {severityStatistics.warning}
                                </p>
                                <p className="mt-1 text-[10px] text-amber-600">
                                    warning
                                </p>
                            </div>

                            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                                <p className="text-xs font-bold uppercase tracking-wider text-orange-700">
                                    Siaga
                                </p>
                                <p className="mt-2 text-2xl font-black text-orange-800">
                                    {severityStatistics.alert}
                                </p>
                                <p className="mt-1 text-[10px] text-orange-600">
                                    alert
                                </p>
                            </div>

                            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                                <p className="text-xs font-bold uppercase tracking-wider text-rose-700">
                                    Siaga Tinggi
                                </p>
                                <p className="mt-2 text-2xl font-black text-rose-800">
                                    {severityStatistics.high_alert}
                                </p>
                                <p className="mt-1 text-[10px] text-rose-600">
                                    high_alert
                                </p>
                            </div>

                            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                                <p className="text-xs font-bold uppercase tracking-wider text-red-700">
                                    Bahaya
                                </p>
                                <p className="mt-2 text-2xl font-black text-red-800">
                                    {severityStatistics.danger}
                                </p>
                                <p className="mt-1 text-[10px] text-red-600">
                                    danger
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Quick Actions */}
                    <section>
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-slate-900">
                                Akses Cepat
                            </h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Akses modul administrasi yang paling sering digunakan.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <Link
                                href="/admin/floodreport"
                                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:shadow-md"
                            >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                                    <FileWarning className="h-5 w-5" />
                                </div>
                                <h3 className="mt-4 text-sm font-bold text-slate-900">
                                    Laporan Banjir
                                </h3>
                                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                    Verifikasi dan kelola laporan masyarakat.
                                </p>
                                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-teal-700">
                                    Buka Modul
                                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                                </span>
                            </Link>

                            <Link
                                href="/admin/posko"
                                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:shadow-md"
                            >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                    <Tent className="h-5 w-5" />
                                </div>
                                <h3 className="mt-4 text-sm font-bold text-slate-900">
                                    Posko Evakuasi
                                </h3>
                                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                    Kelola lokasi, kapasitas, dan fasilitas posko.
                                </p>
                                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-teal-700">
                                    Buka Modul
                                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                                </span>
                            </Link>

                            <Link
                                href="/admin/notifications"
                                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:shadow-md"
                            >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                                    <Bell className="h-5 w-5" />
                                </div>
                                <h3 className="mt-4 text-sm font-bold text-slate-900">
                                    Notifikasi
                                </h3>
                                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                    Kelola peringatan dan informasi sistem.
                                </p>
                                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-teal-700">
                                    Buka Modul
                                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                                </span>
                            </Link>

                            <Link
                                href="/admin/users"
                                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:shadow-md"
                            >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                    <Users className="h-5 w-5" />
                                </div>
                                <h3 className="mt-4 text-sm font-bold text-slate-900">
                                    Pengguna
                                </h3>
                                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                    Kelola akun dan akses pengguna sistem.
                                </p>
                                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-teal-700">
                                    Buka Modul
                                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                                </span>
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

AdminHome.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard Admin',
            href: '/admin/home',
        },
    ],
};
