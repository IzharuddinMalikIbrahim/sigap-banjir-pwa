import { Head, Link, router } from '@inertiajs/react';
import {
    Archive,
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Clock,
    Edit,
    FileText,
    Tag,
    Trash2,
    Video as VideoIcon,
} from 'lucide-react';
import React from 'react';

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

interface Props {
    video: VideoEducation;
}

export default function VideoEdukasiShow({ video }: Props) {
    const handleDelete = () => {
        if (confirm(`Apakah Anda yakin ingin menghapus video "${video.title}"?`)) {
            router.delete(`/admin/video-edukasi/${video.id}`);
        }
    };

    const getStatusConfig = (statusStr: string) => {
        switch (statusStr) {
            case 'published':
                return { label: 'Dipublikasikan', className: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 };
            case 'draft':
                return { label: 'Draft', className: 'bg-slate-100 text-slate-700 border-slate-200', icon: FileText };
            case 'archived':
                return { label: 'Diarsipkan', className: 'bg-amber-100 text-amber-700 border-amber-200', icon: Archive };
            default:
                return { label: statusStr, className: 'bg-slate-100 text-slate-600 border-slate-200', icon: FileText };
        }
    };

    const statConfig = getStatusConfig(video.status);
    const StatIcon = statConfig.icon;

    const formatDuration = (seconds: number | null) => {
        if (!seconds) return '--:--';
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div className="min-h-full w-full bg-slate-50 p-4 font-sans text-slate-800 antialiased md:p-6 lg:p-8 space-y-6">
            <Head title={`${video.title} - Video Edukasi`} />

            {/* Header / Navigasi */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/video-edukasi"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-800"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 line-clamp-1">
                            Detail Video
                        </h1>
                        <p className="text-sm text-slate-500">
                            Lihat dan kelola detail video edukasi.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href={`/admin/video-edukasi/${video.id}/edit`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-200 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                    >
                        <Edit className="h-4 w-4" />
                        Edit
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 border border-rose-100 transition hover:bg-rose-100 hover:text-rose-700"
                    >
                        <Trash2 className="h-4 w-4" />
                        Hapus
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="grid gap-6 lg:grid-cols-3">
                
                {/* Kolom Video Player & Info Utama */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Video Player Card */}
                    <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200">
                        <div className="aspect-video w-full bg-slate-900 relative">
                            {video.video_path ? (
                                <video
                                    controls
                                    poster={video.thumbnail ? `/storage/${video.thumbnail}` : undefined}
                                    className="h-full w-full object-contain"
                                >
                                    <source src={`/storage/${video.video_path}`} type="video/mp4" />
                                    Browser Anda tidak mendukung tag video.
                                </video>
                            ) : (
                                <div className="flex h-full w-full flex-col items-center justify-center text-slate-400 gap-3">
                                    <VideoIcon className="h-12 w-12 opacity-50" />
                                    <p className="text-sm">Video tidak tersedia</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="p-5 md:p-6 border-t border-slate-100">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <div className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${statConfig.className}`}>
                                    <StatIcon className="h-3.5 w-3.5" />
                                    {statConfig.label}
                                </div>
                                {video.category && (
                                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                        <Tag className="h-3.5 w-3.5" />
                                        {video.category}
                                    </div>
                                )}
                                <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                                    <Clock className="h-3.5 w-3.5" />
                                    {formatDuration(video.duration)}
                                </div>
                            </div>
                            
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                                {video.title}
                            </h2>
                            <p className="text-sm text-slate-500 mb-6">
                                {video.slug}
                            </p>
                            
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 mb-2 border-b border-slate-100 pb-2">Deskripsi</h3>
                                {video.description ? (
                                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                                        {video.description}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400 italic">Tidak ada deskripsi yang ditambahkan.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Kolom Info Tambahan */}
                <div className="space-y-6">
                    {/* Metadata Card */}
                    <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-5 md:p-6">
                        <h3 className="text-sm font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">Informasi Publikasi</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-medium text-slate-500 mb-1">Status Publikasi</p>
                                <p className="text-sm font-semibold text-slate-800">{statConfig.label}</p>
                            </div>
                            
                            <div>
                                <p className="text-xs font-medium text-slate-500 mb-1">Tanggal Dipublikasikan</p>
                                <div className="flex items-center gap-2 text-sm text-slate-800">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                    {video.published_at 
                                        ? new Date(video.published_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' }) 
                                        : '-'
                                    }
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-slate-500 mb-1">Tanggal Dibuat</p>
                                <div className="flex items-center gap-2 text-sm text-slate-800">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                    {new Date(video.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Thumbnail Preview Card */}
                    <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-5 md:p-6">
                        <h3 className="text-sm font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">Thumbnail Cover</h3>
                        
                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                            {video.thumbnail ? (
                                <img
                                    src={`/storage/${video.thumbnail}`}
                                    alt={video.title}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full flex-col items-center justify-center text-slate-400 gap-2">
                                    <VideoIcon className="h-8 w-8 opacity-50" />
                                    <p className="text-xs font-medium">Tidak ada thumbnail</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Pasangkan Layout Admin
VideoEdukasiShow.layout = (page: React.ReactNode) => <AdminLayout children={page} />;
