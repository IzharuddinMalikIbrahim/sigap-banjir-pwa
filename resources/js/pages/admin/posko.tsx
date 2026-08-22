import { Head, Link, router } from '@inertiajs/react';
import {
    Activity,
    ArrowRight,
    BedDouble,
    Building2,
    CheckCircle2,
    Edit,
    MapPin,
    Phone,
    Plus,
    Search,
    Tent,
    Trash2,
    Users,
    XCircle,
} from 'lucide-react';

import { useMemo, useState } from 'react';

interface EvacuationPostFacility {
    id: number;
    evacuation_post_id: number;
    facility_name: string;
    description: string | null;
}

interface EvacuationPost {
    id: number;
    name: string;
    address: string;
    latitude: number | string;
    longitude: number | string;
    capacity: number;
    current_occupancy: number;
    contact: string | null;
    status: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    facilities?: EvacuationPostFacility[];
}

interface PaginatedPosts {
    data: EvacuationPost[];
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
}

interface PostStats {
    total: number;
    active: number;
    inactive: number;
    full: number;
    total_capacity: number;
    total_occupancy: number;
}

interface PoskoPageProps {
    posts: PaginatedPosts;
    stats?: Partial<PostStats>;
    filters?: {
        search?: string;
        status?: string;
    };
}

const defaultStats: PostStats = {
    total: 0,
    active: 0,
    inactive: 0,
    full: 0,
    total_capacity: 0,
    total_occupancy: 0,
};

const statusConfig: Record<
    string,
    {
        label: string;
        className: string;
        icon: typeof CheckCircle2;
    }
> = {
    active: {
        label: 'Aktif',
        className:
            'border-emerald-200 bg-emerald-50 text-emerald-700',
        icon: CheckCircle2,
    },

    inactive: {
        label: 'Tidak Aktif',
        className:
            'border-slate-200 bg-slate-100 text-slate-600',
        icon: XCircle,
    },

    full: {
        label: 'Penuh',
        className:
            'border-rose-200 bg-rose-50 text-rose-700',
        icon: Users,
    },
};

const formatNumber = (value: number) => {
    return new Intl.NumberFormat('id-ID').format(value);
};

const getOccupancyPercentage = (
    current: number,
    capacity: number,
) => {
    if (!capacity || capacity <= 0) {
        return 0;
    }

    return Math.min(
        100,
        Math.round((current / capacity) * 100),
    );
};

export default function Posko({
    posts,
    stats: statsProps = {},
    filters: filterProps = {},
}: PoskoPageProps) {
    const stats: PostStats = {
        ...defaultStats,
        ...statsProps,
    };

    const [search, setSearch] = useState(
        filterProps.search ?? '',
    );

    const [status, setStatus] = useState(
        filterProps.status ?? '',
    );

    const filteredPosts = useMemo(() => {
        if (!search) {
            return posts.data;
        }

        const keyword =
            search.toLowerCase().trim();

        return posts.data.filter((post) => {
            return (
                post.name
                    ?.toLowerCase()
                    .includes(keyword) ||
                post.address
                    ?.toLowerCase()
                    .includes(keyword)
            );
        });
    }, [posts.data, search]);

    const applyFilter = () => {
        router.get(
            '/admin/posko',
            {
                search: search || undefined,
                status: status || undefined,
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

        router.get(
            '/admin/posko',
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const deletePost = (
        post: EvacuationPost,
    ) => {
        const confirmed = window.confirm(
            `Hapus posko "${post.name}"? Tindakan ini tidak dapat dibatalkan.`,
        );

        if (!confirmed) {
            return;
        }

        router.delete(
            `/admin/posko/${post.id}`,
            {
                preserveScroll: true,
            },
        );
    };

    const occupancyPercentage =
        stats.total_capacity > 0
            ? Math.min(
                  100,
                  Math.round(
                      (stats.total_occupancy /
                          stats.total_capacity) *
                          100,
                  ),
              )
            : 0;

    return (
        <>
            <Head title="Posko Evakuasi - Admin" />

            <div className="min-h-full bg-slate-50">
                <div className="mx-auto w-full max-w-[1600px] space-y-6 p-4 md:p-6 lg:p-8">

                    {/* Header */}
                    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 ring-1 ring-amber-100">
                                    <Tent className="h-3.5 w-3.5" />
                                    Manajemen Posko
                                </div>

                                <h1 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
                                    Posko Evakuasi
                                </h1>

                                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
                                    Kelola lokasi pengungsian, kapasitas,
                                    informasi kontak, dan fasilitas posko
                                    evakuasi SIGAP BANJIR.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Link
                                    href="/admin/home"
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Dashboard
                                    <ArrowRight className="h-4 w-4" />
                                </Link>

                                <Link
                                    href="/admin/posko/create"
                                    className="inline-flex items-center gap-2 rounded-xl bg-teal-800 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-teal-900"
                                >
                                    <Plus className="h-4 w-4" />
                                    Tambah Posko
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Statistics */}
                    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                        {/* Total */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Total Posko
                                </span>

                                <Building2 className="h-5 w-5 text-teal-700" />
                            </div>

                            <p className="mt-3 text-3xl font-black text-slate-900">
                                {stats.total}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Seluruh posko terdaftar
                            </p>
                        </div>

                        {/* Active */}
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                                    Posko Aktif
                                </span>

                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            </div>

                            <p className="mt-3 text-3xl font-black text-emerald-700">
                                {stats.active}
                            </p>

                            <p className="mt-1 text-xs text-emerald-600">
                                Siap menerima pengungsi
                            </p>
                        </div>

                        {/* Capacity */}
                        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                                    Kapasitas
                                </span>

                                <BedDouble className="h-5 w-5 text-blue-600" />
                            </div>

                            <p className="mt-3 text-3xl font-black text-blue-700">
                                {formatNumber(
                                    stats.total_capacity,
                                )}
                            </p>

                            <p className="mt-1 text-xs text-blue-600">
                                Kapasitas seluruh posko
                            </p>
                        </div>

                        {/* Occupancy */}
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                                    Pengungsi
                                </span>

                                <Users className="h-5 w-5 text-amber-600" />
                            </div>

                            <p className="mt-3 text-3xl font-black text-amber-700">
                                {formatNumber(
                                    stats.total_occupancy,
                                )}
                            </p>

                            <p className="mt-1 text-xs text-amber-600">
                                {occupancyPercentage}% dari kapasitas
                            </p>
                        </div>
                    </section>

                    {/* Occupancy Overview */}
                    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Tingkat Hunian Posko
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Perbandingan jumlah pengungsi dengan kapasitas
                                    seluruh posko.
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-2xl font-black text-teal-800">
                                    {occupancyPercentage}%
                                </p>

                                <p className="text-[10px] text-slate-400">
                                    tingkat hunian
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                            <div
                                className={`h-full rounded-full transition-all ${
                                    occupancyPercentage >= 90
                                        ? 'bg-rose-600'
                                        : occupancyPercentage >= 70
                                          ? 'bg-amber-500'
                                          : 'bg-teal-700'
                                }`}
                                style={{
                                    width: `${occupancyPercentage}%`,
                                }}
                            />
                        </div>

                        <div className="mt-3 flex justify-between text-[10px] text-slate-400">
                            <span>
                                {formatNumber(
                                    stats.total_occupancy,
                                )}{' '}
                                pengungsi
                            </span>

                            <span>
                                {formatNumber(
                                    stats.total_capacity,
                                )}{' '}
                                kapasitas
                            </span>
                        </div>
                    </section>

                    {/* Filter */}
                    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                        <div className="mb-4 flex items-center gap-2">
                            <Search className="h-4 w-4 text-teal-700" />

                            <h2 className="text-sm font-bold text-slate-900">
                                Cari Posko
                            </h2>
                        </div>

                        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_auto_auto]">
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
                                    placeholder="Cari nama atau alamat posko..."
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-teal-700 focus:bg-white focus:ring-1 focus:ring-teal-700"
                                />
                            </div>

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

                                <option value="active">
                                    Aktif
                                </option>

                                <option value="inactive">
                                    Tidak Aktif
                                </option>

                                <option value="full">
                                    Penuh
                                </option>
                            </select>

                            <button
                                type="button"
                                onClick={applyFilter}
                                className="h-11 rounded-xl bg-teal-800 px-5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-teal-900"
                            >
                                Terapkan
                            </button>

                            {(search || status) && (
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

                    {/* Posko Grid */}
                    <section>
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Daftar Posko
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    {posts.total} posko terdaftar.
                                </p>
                            </div>
                        </div>

                        {filteredPosts.length === 0 ? (
                            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                                    <Tent className="h-8 w-8" />
                                </div>

                                <h3 className="mt-4 text-sm font-bold text-slate-800">
                                    Belum Ada Posko
                                </h3>

                                <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-500">
                                    Belum ada posko yang sesuai dengan
                                    pencarian atau filter yang dipilih.
                                </p>

                                <Link
                                    href="/admin/posko/create"
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-800 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-teal-900"
                                >
                                    <Plus className="h-4 w-4" />
                                    Tambah Posko
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {filteredPosts.map(
                                    (post) => {
                                        const currentStatus =
                                            statusConfig[
                                                post.status
                                            ] ??
                                            statusConfig
                                                .inactive;

                                        const StatusIcon =
                                            currentStatus.icon;

                                        const occupancy =
                                            getOccupancyPercentage(
                                                post.current_occupancy,
                                                post.capacity,
                                            );

                                        const remaining = Math.max(
                                            0,
                                            post.capacity -
                                                post.current_occupancy,
                                        );

                                        return (
                                            <article
                                                key={post.id}
                                                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:border-teal-300 hover:shadow-md"
                                            >
                                                {/* Card Header */}
                                                <div className="border-b border-slate-100 p-5">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex min-w-0 items-start gap-3">
                                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                                                                <Tent className="h-5 w-5" />
                                                            </div>

                                                            <div className="min-w-0">
                                                                <h3 className="line-clamp-2 text-sm font-bold text-slate-900">
                                                                    {
                                                                        post.name
                                                                    }
                                                                </h3>

                                                                <p className="mt-1 flex items-start gap-1 text-[11px] leading-relaxed text-slate-500">
                                                                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-700" />

                                                                    {
                                                                        post.address
                                                                    }
                                                                </p>
                                                            </div>
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
                                                </div>

                                                {/* Capacity */}
                                                <div className="p-5">
                                                    <div className="flex items-end justify-between">
                                                        <div>
                                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                                Hunian
                                                            </p>

                                                            <p className="mt-1 text-2xl font-black text-slate-900">
                                                                {
                                                                    post.current_occupancy
                                                                }

                                                                <span className="ml-1 text-xs font-bold text-slate-400">
                                                                    /
                                                                    {
                                                                        post.capacity
                                                                    }
                                                                </span>
                                                            </p>
                                                        </div>

                                                        <div className="text-right">
                                                            <p className="text-lg font-black text-teal-700">
                                                                {
                                                                    occupancy
                                                                }%
                                                            </p>

                                                            <p className="text-[10px] text-slate-400">
                                                                terisi
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                                                        <div
                                                            className={`h-full rounded-full ${
                                                                occupancy >=
                                                                90
                                                                    ? 'bg-rose-600'
                                                                    : occupancy >=
                                                                        70
                                                                      ? 'bg-amber-500'
                                                                      : 'bg-teal-700'
                                                            }`}
                                                            style={{
                                                                width: `${occupancy}%`,
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="mt-2 flex justify-between text-[10px]">
                                                        <span className="text-slate-400">
                                                            Pengungsi{' '}
                                                            {
                                                                post.current_occupancy
                                                            }
                                                        </span>

                                                        <span
                                                            className={`font-semibold ${
                                                                remaining ===
                                                                0
                                                                    ? 'text-rose-600'
                                                                    : 'text-slate-500'
                                                            }`}
                                                        >
                                                            {remaining ===
                                                            0
                                                                ? 'Kapasitas penuh'
                                                                : `${remaining} tempat tersedia`}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Information */}
                                                <div className="grid grid-cols-2 gap-3 border-t border-slate-100 p-5">
                                                    <div className="rounded-xl bg-slate-50 p-3">
                                                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                                            Kontak
                                                        </p>

                                                        <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                                                            <Phone className="h-3.5 w-3.5 text-teal-700" />

                                                            {
                                                                post.contact ??
                                                                    '-'
                                                            }
                                                        </p>
                                                    </div>

                                                    <div className="rounded-xl bg-slate-50 p-3">
                                                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                                            Koordinat
                                                        </p>

                                                        <p className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-slate-700">
                                                            <MapPin className="h-3.5 w-3.5 text-teal-700" />

                                                            {Number(
                                                                post.latitude,
                                                            ).toFixed(
                                                                3,
                                                            )}
                                                            ,{' '}
                                                            {Number(
                                                                post.longitude,
                                                            ).toFixed(
                                                                3,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                {post.description && (
                                                    <div className="border-t border-slate-100 px-5 py-4">
                                                        <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">
                                                            {
                                                                post.description
                                                            }
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                <div className="flex gap-2 border-t border-slate-100 p-4">
                                                    <Link
                                                        href={`/admin/posko/${post.id}`}
                                                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-[10px] font-bold text-slate-700 transition hover:bg-slate-50"
                                                    >
                                                        <Activity className="h-3.5 w-3.5" />
                                                        Detail
                                                    </Link>

                                                    <Link
                                                        href={`/admin/posko/${post.id}/edit`}
                                                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-teal-800 px-3 py-2.5 text-[10px] font-bold text-white transition hover:bg-teal-900"
                                                    >
                                                        <Edit className="h-3.5 w-3.5" />
                                                        Edit
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            deletePost(
                                                                post,
                                                            )
                                                        }
                                                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-200 text-rose-600 transition hover:bg-rose-50"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </article>
                                        );
                                    },
                                )}
                            </div>
                        )}
                    </section>

                    {/* Pagination */}
                    {posts.last_page > 1 && (
                        <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-slate-500">
                                Menampilkan{' '}
                                <strong>{posts.from}</strong>
                                {' '}sampai{' '}
                                <strong>{posts.to}</strong>
                                {' '}dari{' '}
                                <strong>{posts.total}</strong>
                                {' '}posko
                            </p>

                            <div className="flex items-center gap-2">
                                {posts.current_page > 1 && (
                                    <Link
                                        href={`/admin/posko?page=${
                                            posts.current_page -
                                            1
                                        }`}
                                        preserveScroll
                                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                                    >
                                        Sebelumnya
                                    </Link>
                                )}

                                <span className="rounded-xl bg-teal-50 px-3 py-2 text-xs font-bold text-teal-800">
                                    {posts.current_page}
                                    {' / '}
                                    {posts.last_page}
                                </span>

                                {posts.current_page <
                                    posts.last_page && (
                                    <Link
                                        href={`/admin/posko?page=${
                                            posts.current_page +
                                            1
                                        }`}
                                        preserveScroll
                                        className="rounded-xl bg-teal-800 px-3 py-2 text-xs font-semibold text-white transition hover:bg-teal-900"
                                    >
                                        Berikutnya
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

Posko.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard Admin',
            href: '/admin/home',
        },
        {
            title: 'Posko Evakuasi',
            href: '/admin/posko',
        },
    ],
};
