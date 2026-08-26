import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Clock,
    Edit,
    FileText,
    Folder,
    Globe,
    LayoutTemplate,
    Link as LinkIcon,
    Video,
} from 'lucide-react';
import React from 'react';

import AdminLayout from '@/layouts/admin-layout';

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
    content: string;
    video_url: string | null;
    status: 'draft' | 'published' | 'archived';
    published_at: string | null;
    created_at: string;
    updated_at: string;
    category: Category;
}

interface Props {
    content: Content;
}

export default function EdukasiMitigasiShow({ content }: Props) {
    // Fungsi untuk mendapatkan badge status
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'published':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" />
                        Dipublikasikan
                    </span>
                );
            case 'draft':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
                        <FileText className="h-4 w-4" />
                        Draft (Konsep)
                    </span>
                );
            case 'archived':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                        <Archive className="h-4 w-4" />
                        Diarsipkan
                    </span>
                );
            default:
                return null;
        }
    };

    // Fungsi format tanggal
    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';

        return new Intl.DateTimeFormat('id-ID', {
            dateStyle: 'long',
            timeStyle: 'short',
        }).format(new Date(dateString));
    };

    // Helper untuk mengubah URL YouTube biasa menjadi URL Embed (Iframe)
    const getYouTubeEmbedUrl = (url: string | null) => {
        if (!url) return null;

        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);

        return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
    };

    const embedUrl = getYouTubeEmbedUrl(content.video_url);

    return (
        <div className="min-h-full w-full bg-slate-50 p-4 font-sans text-slate-800 antialiased md:p-6 lg:p-8">
            <Head title={`Detail: ${content.title} - SIGAP BANJIR`} />

            <div className="mx-auto max-w-6xl space-y-6">
                {/* Header & Aksi */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/edukasi-mitigasi"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-teal-700"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                                Detail Konten Edukasi
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Pratinjau artikel dan informasi meta data.
                            </p>
                        </div>
                    </div>

                    <Link
                        href={`/admin/edukasi-mitigasi/${content.id}/edit`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-800 px-5 py-2.5 text-sm font-bold tracking-wide text-white shadow-md shadow-teal-900/20 transition hover:bg-teal-900 active:scale-95"
                    >
                        <Edit className="h-4 w-4" />
                        Edit Konten
                    </Link>
                </div>

                <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
                    
                    {/* Kolom Kiri (Pratinjau Konten Utama) */}
                    <div className="space-y-6 lg:col-span-2">
                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                            {/* Thumbnail Cover */}
                            {content.thumbnail ? (
                                <div className="aspect-[21/9] w-full bg-slate-100">
                                    <img
                                        src={`/storage/${content.thumbnail}`}
                                        alt={content.title}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="flex aspect-[21/9] w-full flex-col items-center justify-center bg-slate-50 text-slate-400 border-b border-slate-100">
                                    <LayoutTemplate className="mb-2 h-10 w-10 opacity-50" />
                                    <span className="text-sm font-semibold">Tidak ada thumbnail</span>
                                </div>
                            )}

                            {/* Isi Artikel */}
                            <div className="p-6 md:p-8">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-black leading-snug text-slate-900 md:text-3xl">
                                        {content.title}
                                    </h2>
                                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                        <span className="flex items-center gap-1.5 font-medium">
                                            <Folder className="h-4 w-4 text-teal-700" />
                                            {content.category.name}
                                        </span>
                                        <span className="text-slate-300">•</span>
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="h-4 w-4 text-slate-400" />
                                            {formatDate(content.published_at ?? content.created_at)}
                                        </span>
                                    </div>
                                </div>

                                {/* Video Embed jika ada */}
                                {embedUrl && (
                                    <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                                        <div className="aspect-video w-full bg-slate-900">
                                            <iframe
                                                src={embedUrl}
                                                title="Video Player"
                                                className="h-full w-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    </div>
                                )}

                                {/* Fallback Video Link jika format bukan YouTube */}
                                {content.video_url && !embedUrl && (
                                    <a
                                        href={content.video_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mb-8 flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50 p-4 transition hover:bg-blue-100"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                                <Video className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-blue-900">Tautan Video Eksternal</p>
                                                <p className="text-xs text-blue-700">{content.video_url}</p>
                                            </div>
                                        </div>
                                        <Globe className="h-5 w-5 text-blue-400" />
                                    </a>
                                )}

                                {/* Teks Artikel */}
                                <div className="prose prose-slate prose-teal max-w-none text-slate-700">
                                    {/* Gunakan whitespace-pre-wrap jika input murni text-area, 
                                        atau dangerouslySetInnerHTML jika menggunakan WYSIWYG editor nantinya */}
                                    <p className="whitespace-pre-wrap leading-relaxed">
                                        {content.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan (Informasi Meta Data) */}
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-5 border-b border-slate-100 pb-4 text-sm font-bold uppercase tracking-wider text-slate-800">
                                Informasi Meta
                            </h3>

                            <div className="space-y-5">
                                {/* Status */}
                                <div>
                                    <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">Status Publikasi</p>
                                    <div>{getStatusBadge(content.status)}</div>
                                </div>

                                {/* Kategori */}
                                <div>
                                    <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">Kategori Topik</p>
                                    <p className="text-sm font-semibold text-slate-900">{content.category.name}</p>
                                </div>

                                {/* URL Slug */}
                                <div>
                                    <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">URL Slug</p>
                                    <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600 border border-slate-100">
                                        <LinkIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                        <span className="truncate">{content.slug}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-5 border-b border-slate-100 pb-4 text-sm font-bold uppercase tracking-wider text-slate-800">
                                Riwayat Waktu
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Clock className="mt-0.5 h-4 w-4 text-slate-400" />
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Dibuat Pada</p>
                                        <p className="text-sm font-medium text-slate-700">{formatDate(content.created_at)}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Clock className="mt-0.5 h-4 w-4 text-slate-400" />
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Terakhir Diperbarui</p>
                                        <p className="text-sm font-medium text-slate-700">{formatDate(content.updated_at)}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Calendar className="mt-0.5 h-4 w-4 text-teal-600" />
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-teal-600">Jadwal Terbit</p>
                                        <p className="text-sm font-medium text-slate-700">
                                            {content.published_at ? formatDate(content.published_at) : 'Tidak ada jadwal spesifik'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Pasangkan Layout Admin
EdukasiMitigasiShow.layout = (page: React.ReactNode) => <AdminLayout children={page} />;
