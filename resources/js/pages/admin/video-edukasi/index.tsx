import { Head, Link, router } from '@inertiajs/react';
import {
    Archive,
    CheckCircle2,
    Clock,
    Edit,
    FileText,
    Filter,
    PlayCircle,
    Plus,
    Search,
    Trash2,
    Video as VideoIcon,
} from 'lucide-react';
import React, { useCallback, useState } from 'react';

import AdminLayout from '@/layouts/admin-layout';

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

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    videos: {
        data: VideoEducation[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    stats: {
        total: number;
        draft: number;
        published: number;
        archived: number;
    };
    categories: string[];
    filters: {
        search?: string;
        category?: string;
        status?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function VideoEdukasiIndex({
    videos,
    stats,
    categories,
    filters,
    flash,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');
    const [status, setStatus] = useState(filters.status || '');

    // Fungsi Filter
    const handleFilter = useCallback(
        (key: string, value: string) => {
            router.get(
                '/admin/video-edukasi',
                {
                    search: key === 'search' ? value : search,
                    category: key === 'category' ? value : category,
                    status: key === 'status' ? value : status,
                },
                {
                    preserveState: true,
                    replace: true,
                }
            );
        },
        [search, category, status]
    );

    const handleDelete = (id: number, title: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus video "${title}"?`)) {
            router.delete(`/admin/video-edukasi/${id}`);
        }
    };

    const getStatusConfig = (statusStr: string) => {
        switch (statusStr) {
            case 'published':
                return { label: 'Dipublikasikan', className: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 };
            case 'draft':
                return { label: 'Draft', className: 'bg-slate-100 text-slate-700', icon: FileText };
            case 'archived':
                return { label: 'Diarsipkan', className: 'bg-amber-100 text-amber-700', icon: Archive };
            default:
                return { label: statusStr, className: 'bg-slate-100 text-slate-600', icon: FileText };
        }
    };

    // Helper mengubah detik ke format MM:SS
    const formatDuration = (seconds: number | null) => {
        if (!seconds) {
            return '--:--';
        }

        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');

        return `${m}:${s}`;
    };

    return (
        <div className="min-h-full w-full bg-slate-50 p-4 font-sans text-slate-800 antialiased md:p-6 lg:p-8 space-y-6">
            <Head title="Manajemen Video Edukasi - SIGAP BANJIR" />

            {/* Flash Message */}
            {flash?.success && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800 shadow-sm">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <span>{flash.success}</span>
                </div>
            )}

            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900">
                        Video Edukasi
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Kelola arsip video panduan, mitigasi, dan dokumentasi banjir.
                    </p>
                </div>
                <Link
                    href="/admin/video-edukasi/create"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-800 px-4 py-2.5 text-sm font-bold tracking-wide text-white shadow-md shadow-teal-900/20 transition hover:bg-teal-900 active:scale-95"
                >
                    <Plus className="h-4 w-4" />
                    Upload Video
                </Link>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500">
                        <span className="text-xs font-bold uppercase tracking-wider">Total Video</span>
                        <VideoIcon className="h-5 w-5 text-teal-700" />
                    </div>
                    <p className="mt-3 text-3xl font-black text-slate-900">{stats.total}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500">
                        <span className="text-xs font-bold uppercase tracking-wider">Dipublikasikan</span>
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    </div>
                    <p className="mt-3 text-3xl font-black text-emerald-600">{stats.published}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500">
                        <span className="text-xs font-bold uppercase tracking-wider">Draft Baru</span>
                        <FileText className="h-5 w-5 text-slate-400" />
                    </div>
                    <p className="mt-3 text-3xl font-black text-slate-700">{stats.draft}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500">
                        <span className="text-xs font-bold uppercase tracking-wider">Diarsipkan</span>
                        <Archive className="h-5 w-5 text-amber-500" />
                    </div>
                    <p className="mt-3 text-3xl font-black text-amber-600">{stats.archived}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari judul atau deskripsi video..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                handleFilter('search', e.target.value);
                            }}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 transition focus:border-teal-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-700"
                        />
                    </div>
                    <div className="flex flex-1 gap-3 sm:flex-none">
                        <select
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                                handleFilter('category', e.target.value);
                            }}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 transition focus:border-teal-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-700 sm:w-48"
                        >
                            <option value="">Semua Kategori</option>
                            {categories.map((cat, idx) => (
                                <option key={idx} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>

                        <select
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                handleFilter('status', e.target.value);
                            }}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 transition focus:border-teal-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-700 sm:w-40"
                        >
                            <option value="">Semua Status</option>
                            <option value="published">Dipublikasikan</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Diarsipkan</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Video Grid Data */}
            {videos.data.length === 0 ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                        <Filter className="h-8 w-8" />
                    </div>
                    <h3 className="mt-4 font-bold text-slate-700">Video Tidak Ditemukan</h3>
                    <p className="mt-1 text-sm text-slate-500">Tidak ada data video yang sesuai dengan filter pencarian Anda.</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {videos.data.map((video) => {
                        const statConfig = getStatusConfig(video.status);
                        const StatIcon = statConfig.icon;

                        return (
                            <div key={video.id} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                                {/* Thumbnail Container */}
                                <Link href={`/admin/video-edukasi/${video.id}`} className="relative aspect-video w-full overflow-hidden bg-slate-900">
                                    {video.thumbnail ? (
                                        <img
                                            src={`/storage/${video.thumbnail}`}
                                            alt={video.title}
                                            className="h-full w-full object-cover opacity-80 transition duration-300 group-hover:scale-105 group-hover:opacity-100"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-slate-100">
                                            <VideoIcon className="h-10 w-10 text-slate-300" />
                                        </div>
                                    )}

                                    {/* Play Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition duration-300 group-hover:opacity-100">
                                        <PlayCircle className="h-12 w-12 text-white drop-shadow-md" />
                                    </div>

                                    {/* Duration Badge */}
                                    <div className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                                        {formatDuration(video.duration)}
                                    </div>

                                    {/* Status Badge */}
                                    <div className={`absolute left-2 top-2 inline-flex items-center gap-1 rounded bg-white/90 px-2 py-0.5 text-[10px] font-bold backdrop-blur ${statConfig.className}`}>
                                        <StatIcon className="h-3 w-3" />
                                        {statConfig.label}
                                    </div>
                                </Link>

                                {/* Video Info */}
                                <div className="flex flex-1 flex-col p-4">
                                    <Link href={`/admin/video-edukasi/${video.id}`}>
                                        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900 transition hover:text-teal-700">
                                            {video.title}
                                        </h3>
                                    </Link>
                                    
                                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                                        <span className="truncate rounded-md bg-slate-100 px-2 py-1 font-medium">
                                            {video.category || 'Tanpa Kategori'}
                                        </span>
                                    </div>

                                    <div className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-400">
                                        <Clock className="h-3 w-3" />
                                        <span>Dibuat: {new Date(video.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
                                        <Link
                                            href={`/admin/video-edukasi/${video.id}`}
                                            className="flex-1 rounded-xl bg-teal-50 py-2 text-center text-xs font-bold text-teal-700 transition hover:bg-teal-100"
                                        >
                                            Detail
                                        </Link>
                                        <Link
                                            href={`/admin/video-edukasi/${video.id}/edit`}
                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                                            title="Edit Video"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(video.id, video.title)}
                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
                                            title="Hapus Video"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {videos.links.length > 3 && (
                <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:px-6">
                    <span className="text-xs text-slate-500">
                        Menampilkan <strong className="font-semibold text-slate-900">{videos.from}</strong> - <strong className="font-semibold text-slate-900">{videos.to}</strong> dari <strong className="font-semibold text-slate-900">{videos.total}</strong> video
                    </span>
                    <div className="flex flex-wrap items-center justify-center gap-1">
                        {videos.links.map((link, k) => (
                            <Link
                                key={k}
                                href={link.url || '#'}
                                disabled={!link.url}
                                className={`flex min-w-[32px] items-center justify-center rounded-lg border px-2 py-1.5 text-xs font-semibold transition ${
                                    link.active
                                        ? 'border-teal-700 bg-teal-800 text-white shadow-sm'
                                        : link.url
                                        ? 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-teal-700'
                                        : 'border-transparent text-slate-300 cursor-not-allowed'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Pasangkan Layout Admin
VideoEdukasiIndex.layout = (page: React.ReactNode) => <AdminLayout children={page} />;
