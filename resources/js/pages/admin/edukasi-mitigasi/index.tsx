import { Head, Link, router } from '@inertiajs/react';
import {
    Archive,
    BookOpen,
    CheckCircle2,
    Edit,
    FileText,
    Filter,
    Layers,
    Plus,
    Search,
    Trash2,
    Video,
} from 'lucide-react';
import React, { useCallback, useState } from 'react';

import AdminLayout from '@/layouts/admin-layout'; // Sesuaikan path layout Anda

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Content {
    id: number;
    category_id: number;
    title: string;
    slug: string;
    thumbnail: string | null;
    video_url: string | null;
    status: 'draft' | 'published' | 'archived';
    published_at: string | null;
    created_at: string;
    category: Category;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    contents: {
        data: Content[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    categories: Category[];
    stats: {
        total: number;
        draft: number;
        published: number;
        archived: number;
    };
    filters: {
        search?: string;
        category_id?: string;
        status?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function EdukasiMitigasiIndex({
    contents,
    categories,
    stats,
    filters,
    flash,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || '');
    const [status, setStatus] = useState(filters.status || '');

    // Fungsi debounce pencarian sederhana
    const handleFilter = useCallback(
        (key: string, value: string) => {
            router.get(
                '/admin/edukasi-mitigasi',
                {
                    search: key === 'search' ? value : search,
                    category_id: key === 'category_id' ? value : categoryId,
                    status: key === 'status' ? value : status,
                },
                {
                    preserveState: true,
                    replace: true,
                }
            );
        },
        [search, categoryId, status]
    );

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus konten edukasi ini?')) {
            router.delete(`/admin/edukasi-mitigasi/${id}`);
        }
    };

    const getStatusConfig = (statusStr: string) => {
        switch (statusStr) {
            case 'published':
                return { label: 'Dipublikasikan', className: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 };
            case 'draft':
                return { label: 'Draft', className: 'bg-slate-100 text-slate-700 border-slate-200', icon: FileText };
            case 'archived':
                return { label: 'Diarsipkan', className: 'bg-amber-50 text-amber-700 border-amber-200', icon: Archive };
            default:
                return { label: statusStr, className: 'bg-slate-100 text-slate-600', icon: FileText };
        }
    };

    return (
        <div className="min-h-full w-full bg-slate-50 font-sans text-slate-800 antialiased p-4 md:p-6 lg:p-8 space-y-6">
            <Head title="Manajemen Edukasi Mitigasi - SIGAP BANJIR" />

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
                        Edukasi Mitigasi
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Kelola artikel panduan dan video edukasi mitigasi banjir untuk masyarakat.
                    </p>
                </div>
                <Link
                    href="/admin/edukasi-mitigasi/create"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-800 px-4 py-2.5 text-sm font-bold tracking-wide text-white shadow-md shadow-teal-900/20 transition hover:bg-teal-900 active:scale-95"
                >
                    <Plus className="h-4 w-4" />
                    Tambah Konten
                </Link>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500">
                        <span className="text-xs font-bold uppercase tracking-wider">Total Konten</span>
                        <Layers className="h-5 w-5 text-teal-700" />
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

            {/* Main Content Area */}
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                {/* Filters */}
                <div className="border-b border-slate-100 bg-slate-50/50 p-4 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari judul konten..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    handleFilter('search', e.target.value);
                                }}
                                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                            />
                        </div>
                        <div className="flex flex-1 gap-3 sm:flex-none">
                            <select
                                value={categoryId}
                                onChange={(e) => {
                                    setCategoryId(e.target.value);
                                    handleFilter('category_id', e.target.value);
                                }}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700 sm:w-48"
                            >
                                <option value="">Semua Kategori</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value);
                                    handleFilter('status', e.target.value);
                                }}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700 sm:w-40"
                            >
                                <option value="">Semua Status</option>
                                <option value="published">Dipublikasikan</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Diarsipkan</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table Data */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                            <tr>
                                <th className="px-6 py-4 font-bold">Judul Konten</th>
                                <th className="px-6 py-4 font-bold">Kategori</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold">Tanggal Dibuat</th>
                                <th className="px-6 py-4 font-bold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {contents.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <Filter className="mb-2 h-8 w-8" />
                                            <p className="font-medium text-slate-600">Data tidak ditemukan</p>
                                            <p className="text-xs">Coba ubah filter pencarian Anda.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                contents.data.map((content) => {
                                    const statConfig = getStatusConfig(content.status);
                                    const StatIcon = statConfig.icon;

                                    return (
                                        <tr key={content.id} className="transition hover:bg-slate-50/80">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                                                        {content.thumbnail ? (
                                                            <img
                                                                src={`/storage/${content.thumbnail}`}
                                                                alt={content.title}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <BookOpen className="h-5 w-5 text-slate-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 line-clamp-1">
                                                            {content.title}
                                                        </p>
                                                        {content.video_url && (
                                                            <span className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-teal-600">
                                                                <Video className="h-3 w-3" />
                                                                Terdapat Video
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                                    {content.category.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statConfig.className}`}>
                                                    <StatIcon className="h-3 w-3" />
                                                    {statConfig.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-slate-700">
                                                    {new Date(content.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/edukasi-mitigasi/${content.id}/edit`}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200"
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(content.id)}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {contents.links.length > 3 && (
                    <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4">
                        <span className="text-xs text-slate-500">
                            Menampilkan <strong className="font-semibold text-slate-900">{contents.from}</strong> hingga <strong className="font-semibold text-slate-900">{contents.to}</strong> dari <strong className="font-semibold text-slate-900">{contents.total}</strong> konten
                        </span>
                        <div className="flex items-center gap-1">
                            {contents.links.map((link, k) => (
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
        </div>
    );
}

// Pasangkan Layout Admin di file komponen
EdukasiMitigasiIndex.layout = (page: React.ReactNode) => <AdminLayout children={page} />;
