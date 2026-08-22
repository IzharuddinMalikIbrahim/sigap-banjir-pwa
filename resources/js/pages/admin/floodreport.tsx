import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Droplets,
    Eye,
    FileWarning,
    Filter,
    MapPin,
    Search,
    ShieldAlert,
    XCircle,
} from 'lucide-react';

import { useMemo, useState } from 'react';

interface FloodReportImage {
    id: number;
    flood_report_id: number;
    file_path: string;
    file_name: string;
    mime_type: string;
    file_size: number;
}

interface FloodReport {
    id: number;
    user_id: number | null;
    latitude: number | string;
    longitude: number | string;
    address: string;
    water_level: number | string;
    severity: string;
    description: string | null;
    status: string;
    reported_at: string;
    verified_at: string | null;
    verified_by: number | null;
    expired_at: string | null;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
    } | null;
    images?: FloodReportImage[];
}

interface PaginatedReports {
    data: FloodReport[];
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
}

interface ReportStats {
    total: number;
    submitted: number;
    verification: number;
    verified: number;
    published: number;
    rejected: number;
    expired: number;
}

interface FloodReportPageProps {
    reports: PaginatedReports;
    stats?: Partial<ReportStats>;
    filters?: {
        search?: string;
        status?: string;
        severity?: string;
    };
}

const defaultStats: ReportStats = {
    total: 0,
    submitted: 0,
    verification: 0,
    verified: 0,
    published: 0,
    rejected: 0,
    expired: 0,
};

const statusConfig: Record<
    string,
    {
        label: string;
        className: string;
        icon: typeof CheckCircle2;
    }
> = {
    submitted: {
        label: 'Laporan Baru',
        className:
            'border-blue-200 bg-blue-50 text-blue-700',
        icon: Clock3,
    },

    verification: {
        label: 'Verifikasi',
        className:
            'border-amber-200 bg-amber-50 text-amber-700',
        icon: ShieldAlert,
    },

    verified: {
        label: 'Terverifikasi',
        className:
            'border-emerald-200 bg-emerald-50 text-emerald-700',
        icon: CheckCircle2,
    },

    published: {
        label: 'Dipublikasikan',
        className:
            'border-teal-200 bg-teal-50 text-teal-700',
        icon: CheckCircle2,
    },

    rejected: {
        label: 'Ditolak',
        className:
            'border-rose-200 bg-rose-50 text-rose-700',
        icon: XCircle,
    },

    expired: {
        label: 'Kedaluwarsa',
        className:
            'border-slate-200 bg-slate-100 text-slate-600',
        icon: Clock3,
    },
};

const severityConfig: Record<
    string,
    {
        label: string;
        className: string;
    }
> = {
    safe: {
        label: 'Aman',
        className:
            'border-emerald-200 bg-emerald-50 text-emerald-700',
    },

    warning: {
        label: 'Waspada',
        className:
            'border-amber-200 bg-amber-50 text-amber-700',
    },

    alert: {
        label: 'Siaga',
        className:
            'border-orange-200 bg-orange-50 text-orange-700',
    },

    high_alert: {
        label: 'Siaga Tinggi',
        className:
            'border-rose-200 bg-rose-50 text-rose-700',
    },

    danger: {
        label: 'Bahaya',
        className:
            'border-red-200 bg-red-50 text-red-700',
    },
};

const formatDate = (
    value: string | null | undefined,
) => {
    if (!value) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
};

export default function FloodReport({
    reports,
    stats: statsProps = {},
    filters: filterProps = {},
}: FloodReportPageProps) {
    const stats: ReportStats = {
        ...defaultStats,
        ...statsProps,
    };

    const [search, setSearch] = useState(
        filterProps.search ?? '',
    );

    const [status, setStatus] = useState(
        filterProps.status ?? '',
    );

    const [severity, setSeverity] = useState(
        filterProps.severity ?? '',
    );

    const [processingId, setProcessingId] =
        useState<number | null>(null);

    const hasActiveFilter =
        search !== '' ||
        status !== '' ||
        severity !== '';

    const filteredReports = useMemo(() => {
        if (!search) {
            return reports.data;
        }

        const keyword =
            search.toLowerCase().trim();

        return reports.data.filter((report) => {
            return (
                report.address
                    ?.toLowerCase()
                    .includes(keyword) ||
                report.user?.name
                    ?.toLowerCase()
                    .includes(keyword) ||
                report.user?.email
                    ?.toLowerCase()
                    .includes(keyword)
            );
        });
    }, [reports.data, search]);

    const applyFilter = () => {
        router.get(
            '/admin/floodreport',
            {
                search: search || undefined,
                status: status || undefined,
                severity: severity || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const resetFilter = () => {
        setSearch('');
        setStatus('');
        setSeverity('');

        router.get(
            '/admin/floodreport',
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const updateStatus = (
        reportId: number,
        nextStatus: string,
        confirmationMessage: string,
    ) => {
        const confirmed =
            window.confirm(confirmationMessage);

        if (!confirmed) {
            return;
        }

        setProcessingId(reportId);

        router.patch(
            `/admin/floodreport/${reportId}/status`,
            {
                status: nextStatus,
            },
            {
                preserveScroll: true,

                onFinish: () => {
                    setProcessingId(null);
                },
            },
        );
    };

    return (
        <>
            <Head title="Laporan Banjir - Admin" />

            <div className="min-h-full bg-slate-50">
                <div className="mx-auto w-full max-w-[1600px] space-y-6 p-4 md:p-6 lg:p-8">

                    {/* Header */}
                    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-700 ring-1 ring-rose-100">
                                    <FileWarning className="h-3.5 w-3.5" />
                                    Monitoring Laporan
                                </div>

                                <h1 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
                                    Laporan Banjir
                                </h1>

                                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
                                    Kelola, verifikasi, dan publikasikan laporan
                                    banjir yang dikirim oleh masyarakat.
                                </p>
                            </div>

                            <Link
                                href="/admin/home"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                            >
                                Dashboard
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </section>

                    {/* Statistics */}
                    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Total
                            </p>

                            <p className="mt-2 text-2xl font-black text-slate-900">
                                {stats.total}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                                Baru
                            </p>

                            <p className="mt-2 text-2xl font-black text-blue-700">
                                {stats.submitted}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                                Verifikasi
                            </p>

                            <p className="mt-2 text-2xl font-black text-amber-700">
                                {stats.verification}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                                Verified
                            </p>

                            <p className="mt-2 text-2xl font-black text-emerald-700">
                                {stats.verified}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-teal-600">
                                Published
                            </p>

                            <p className="mt-2 text-2xl font-black text-teal-700">
                                {stats.published}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                                Ditolak
                            </p>

                            <p className="mt-2 text-2xl font-black text-rose-700">
                                {stats.rejected}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Expired
                            </p>

                            <p className="mt-2 text-2xl font-black text-slate-700">
                                {stats.expired}
                            </p>
                        </div>
                    </section>

                    {/* Filter */}
                    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                        <div className="mb-4 flex items-center gap-2">
                            <Filter className="h-4 w-4 text-teal-700" />

                            <h2 className="text-sm font-bold text-slate-900">
                                Filter Laporan
                            </h2>
                        </div>

                        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px_auto_auto]">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value,
                                        )
                                    }
                                    onKeyDown={(event) => {
                                        if (
                                            event.key ===
                                            'Enter'
                                        ) {
                                            applyFilter();
                                        }
                                    }}
                                    placeholder="Cari alamat atau nama pelapor..."
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-teal-700 focus:bg-white focus:ring-1 focus:ring-teal-700"
                                />
                            </div>

                            {/* Status */}
                            <select
                                value={status}
                                onChange={(event) =>
                                    setStatus(
                                        event.target.value,
                                    )
                                }
                                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700"
                            >
                                <option value="">
                                    Semua Status
                                </option>

                                <option value="submitted">
                                    Laporan Baru
                                </option>

                                <option value="verification">
                                    Verifikasi
                                </option>

                                <option value="verified">
                                    Terverifikasi
                                </option>

                                <option value="published">
                                    Dipublikasikan
                                </option>

                                <option value="rejected">
                                    Ditolak
                                </option>

                                <option value="expired">
                                    Kedaluwarsa
                                </option>
                            </select>

                            {/* Severity */}
                            <select
                                value={severity}
                                onChange={(event) =>
                                    setSeverity(
                                        event.target.value,
                                    )
                                }
                                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700"
                            >
                                <option value="">
                                    Semua Severity
                                </option>

                                <option value="safe">
                                    Aman
                                </option>

                                <option value="warning">
                                    Waspada
                                </option>

                                <option value="alert">
                                    Siaga
                                </option>

                                <option value="high_alert">
                                    Siaga Tinggi
                                </option>

                                <option value="danger">
                                    Bahaya
                                </option>
                            </select>

                            <button
                                type="button"
                                onClick={applyFilter}
                                className="h-11 rounded-xl bg-teal-800 px-5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-teal-900"
                            >
                                Terapkan
                            </button>

                            {hasActiveFilter && (
                                <button
                                    type="button"
                                    onClick={resetFilter}
                                    className="h-11 rounded-xl border border-slate-200 px-5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </section>

                    {/* Table */}
                    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Daftar Laporan
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    {reports.total} laporan ditemukan.
                                </p>
                            </div>

                            <div className="inline-flex items-center gap-2 text-xs text-slate-400">
                                <Droplets className="h-4 w-4 text-teal-700" />
                                Data laporan SIGAP BANJIR
                            </div>
                        </div>

                        {/* Desktop */}
                        <div className="hidden overflow-x-auto lg:block">
                            <table className="w-full min-w-[1100px]">
                                <thead>
                                    <tr className="border-b bg-slate-50/80 text-left">
                                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            Laporan
                                        </th>

                                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            Pelapor
                                        </th>

                                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            Genangan
                                        </th>

                                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            Severity
                                        </th>

                                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            Status
                                        </th>

                                        <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            Dilaporkan
                                        </th>

                                        <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {filteredReports.map(
                                        (report) => {
                                            const currentStatus =
                                                statusConfig[
                                                    report.status
                                                ] ??
                                                statusConfig.submitted;

                                            const currentSeverity =
                                                severityConfig[
                                                    report.severity
                                                ] ??
                                                severityConfig.safe;

                                            const StatusIcon =
                                                currentStatus.icon;

                                            const processing =
                                                processingId ===
                                                report.id;

                                            return (
                                                <tr
                                                    key={
                                                        report.id
                                                    }
                                                    className="transition hover:bg-slate-50/70"
                                                >
                                                    <td className="px-5 py-4">
                                                        <div className="max-w-[300px]">
                                                            <p className="line-clamp-2 text-sm font-bold text-slate-900">
                                                                {
                                                                    report.address
                                                                }
                                                            </p>

                                                            <div className="mt-2 flex items-center gap-1 text-[10px] font-mono text-slate-400">
                                                                <MapPin className="h-3 w-3 text-teal-700" />

                                                                {Number(
                                                                    report.latitude,
                                                                ).toFixed(
                                                                    5,
                                                                )}
                                                                ,{' '}
                                                                {Number(
                                                                    report.longitude,
                                                                ).toFixed(
                                                                    5,
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        {report.user ? (
                                                            <div>
                                                                <p className="text-xs font-bold text-slate-800">
                                                                    {
                                                                        report
                                                                            .user
                                                                            .name
                                                                    }
                                                                </p>

                                                                <p className="mt-0.5 text-[10px] text-slate-400">
                                                                    {
                                                                        report
                                                                            .user
                                                                            .email
                                                                    }
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-slate-400">
                                                                Anonymous
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-lg font-black text-teal-800">
                                                                {
                                                                    report.water_level
                                                                }
                                                            </span>

                                                            <span className="text-[10px] font-bold text-slate-400">
                                                                cm
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <span
                                                            className={`inline-flex rounded-lg border px-2.5 py-1 text-[10px] font-bold ${currentSeverity.className}`}
                                                        >
                                                            {
                                                                currentSeverity.label
                                                            }
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-bold ${currentStatus.className}`}
                                                        >
                                                            <StatusIcon className="h-3 w-3" />
                                                            {
                                                                currentStatus.label
                                                            }
                                                        </span>
                                                    </td>

                                                    <td className="whitespace-nowrap px-5 py-4">
                                                        <span className="text-[11px] text-slate-500">
                                                            {formatDate(
                                                                report.reported_at,
                                                            )}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Link
                                                                href={`/admin/floodreport/${report.id}`}
                                                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-teal-700 hover:bg-teal-50 hover:text-teal-800"
                                                                title="Detail"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Link>

                                                            {report.status ===
                                                                'submitted' && (
                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        processing
                                                                    }
                                                                    onClick={() =>
                                                                        updateStatus(
                                                                            report.id,
                                                                            'verification',
                                                                            'Mulai proses verifikasi laporan ini?',
                                                                        )
                                                                    }
                                                                    className="inline-flex h-9 items-center gap-1 rounded-lg bg-amber-500 px-3 text-[10px] font-bold text-white transition hover:bg-amber-600 disabled:opacity-50"
                                                                >
                                                                    <ShieldAlert className="h-3.5 w-3.5" />
                                                                    Verifikasi
                                                                </button>
                                                            )}

                                                            {report.status ===
                                                                'verification' && (
                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        processing
                                                                    }
                                                                    onClick={() =>
                                                                        updateStatus(
                                                                            report.id,
                                                                            'verified',
                                                                            'Tandai laporan ini sebagai terverifikasi?',
                                                                        )
                                                                    }
                                                                    className="inline-flex h-9 items-center gap-1 rounded-lg bg-emerald-600 px-3 text-[10px] font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                                                                >
                                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                                    Valid
                                                                </button>
                                                            )}

                                                            {report.status ===
                                                                'verified' && (
                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        processing
                                                                    }
                                                                    onClick={() =>
                                                                        updateStatus(
                                                                            report.id,
                                                                            'published',
                                                                            'Publikasikan laporan ini ke peta publik?',
                                                                        )
                                                                    }
                                                                    className="inline-flex h-9 items-center gap-1 rounded-lg bg-teal-700 px-3 text-[10px] font-bold text-white transition hover:bg-teal-800 disabled:opacity-50"
                                                                >
                                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                                    Publish
                                                                </button>
                                                            )}

                                                            {[
                                                                'submitted',
                                                                'verification',
                                                            ].includes(
                                                                report.status,
                                                            ) && (
                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        processing
                                                                    }
                                                                    onClick={() =>
                                                                        updateStatus(
                                                                            report.id,
                                                                            'rejected',
                                                                            'Tolak laporan ini?',
                                                                        )
                                                                    }
                                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                                                                    title="Tolak"
                                                                >
                                                                    <XCircle className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        },
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile */}
                        <div className="divide-y divide-slate-100 lg:hidden">
                            {filteredReports.map(
                                (report) => {
                                    const currentStatus =
                                        statusConfig[
                                            report.status
                                        ] ??
                                        statusConfig.submitted;

                                    const currentSeverity =
                                        severityConfig[
                                            report.severity
                                        ] ??
                                        severityConfig.safe;

                                    const StatusIcon =
                                        currentStatus.icon;

                                    return (
                                        <div
                                            key={
                                                report.id
                                            }
                                            className="p-5"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-slate-900">
                                                        {
                                                            report.address
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-[11px] text-slate-400">
                                                        {report.user
                                                            ?.name ??
                                                            'Anonymous'}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`inline-flex shrink-0 items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-bold ${currentStatus.className}`}
                                                >
                                                    <StatusIcon className="h-3 w-3" />
                                                    {
                                                        currentStatus.label
                                                    }
                                                </span>
                                            </div>

                                            <div className="mt-4 grid grid-cols-2 gap-3">
                                                <div className="rounded-xl bg-slate-50 p-3">
                                                    <p className="text-[10px] uppercase tracking-wider text-slate-400">
                                                        Ketinggian
                                                    </p>

                                                    <p className="mt-1 text-lg font-black text-teal-800">
                                                        {
                                                            report.water_level
                                                        }{' '}
                                                        <span className="text-xs">
                                                            cm
                                                        </span>
                                                    </p>
                                                </div>

                                                <div className="rounded-xl bg-slate-50 p-3">
                                                    <p className="text-[10px] uppercase tracking-wider text-slate-400">
                                                        Severity
                                                    </p>

                                                    <span
                                                        className={`mt-1 inline-flex rounded-lg border px-2 py-1 text-[10px] font-bold ${currentSeverity.className}`}
                                                    >
                                                        {
                                                            currentSeverity.label
                                                        }
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-3 flex items-center gap-1 text-[10px] font-mono text-slate-400">
                                                <MapPin className="h-3 w-3 text-teal-700" />

                                                {Number(
                                                    report.latitude,
                                                ).toFixed(
                                                    5,
                                                )}
                                                ,{' '}
                                                {Number(
                                                    report.longitude,
                                                ).toFixed(
                                                    5,
                                                )}
                                            </div>

                                            <div className="mt-4 flex flex-wrap gap-2">
                                                <Link
                                                    href={`/admin/floodreport/${report.id}`}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-bold text-slate-700"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                    Detail
                                                </Link>

                                                {report.status ===
                                                    'submitted' && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateStatus(
                                                                report.id,
                                                                'verification',
                                                                'Mulai proses verifikasi laporan ini?',
                                                            )
                                                        }
                                                        className="rounded-lg bg-amber-500 px-3 py-2 text-[10px] font-bold text-white"
                                                    >
                                                        Verifikasi
                                                    </button>
                                                )}

                                                {report.status ===
                                                    'verification' && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateStatus(
                                                                report.id,
                                                                'verified',
                                                                'Tandai laporan ini sebagai terverifikasi?',
                                                            )
                                                        }
                                                        className="rounded-lg bg-emerald-600 px-3 py-2 text-[10px] font-bold text-white"
                                                    >
                                                        Validasi
                                                    </button>
                                                )}

                                                {report.status ===
                                                    'verified' && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateStatus(
                                                                report.id,
                                                                'published',
                                                                'Publikasikan laporan ini ke peta publik?',
                                                            )
                                                        }
                                                        className="rounded-lg bg-teal-700 px-3 py-2 text-[10px] font-bold text-white"
                                                    >
                                                        Publish
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                },
                            )}
                        </div>

                        {/* Empty */}
                        {filteredReports.length === 0 && (
                            <div className="flex min-h-[280px] flex-col items-center justify-center p-8 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                    <FileWarning className="h-8 w-8" />
                                </div>

                                <h3 className="mt-4 text-sm font-bold text-slate-700">
                                    Laporan Tidak Ditemukan
                                </h3>

                                <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
                                    Tidak ada laporan yang sesuai dengan
                                    pencarian atau filter yang digunakan.
                                </p>
                            </div>
                        )}
                    </section>

                    {/* Pagination */}
                    {reports.last_page > 1 && (
                        <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-slate-500">
                                Menampilkan{' '}
                                <strong>{reports.from}</strong>
                                {' '}sampai{' '}
                                <strong>{reports.to}</strong>
                                {' '}dari{' '}
                                <strong>{reports.total}</strong>
                                {' '}laporan
                            </p>

                            <div className="flex items-center gap-2">
                                {reports.current_page > 1 && (
                                    <Link
                                        href={`/admin/floodreport?page=${
                                            reports.current_page -
                                            1
                                        }`}
                                        preserveScroll
                                        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Sebelumnya
                                    </Link>
                                )}

                                <span className="rounded-xl bg-teal-50 px-3 py-2 text-xs font-bold text-teal-800">
                                    {reports.current_page}
                                    {' / '}
                                    {reports.last_page}
                                </span>

                                {reports.current_page <
                                    reports.last_page && (
                                    <Link
                                        href={`/admin/floodreport?page=${
                                            reports.current_page +
                                            1
                                        }`}
                                        preserveScroll
                                        className="inline-flex items-center gap-1 rounded-xl bg-teal-800 px-3 py-2 text-xs font-semibold text-white transition hover:bg-teal-900"
                                    >
                                        Berikutnya
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                )}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </>
    );
}

FloodReport.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard Admin',
            href: '/admin/home',
        },
        {
            title: 'Laporan Banjir',
            href: '/admin/floodreport',
        },
    ],
};
