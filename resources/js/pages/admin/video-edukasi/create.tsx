import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Clock,
    FileText,
    Folder,
    Image as ImageIcon,
    LayoutTemplate,
    Link as LinkIcon,
    Loader2,
    Save,
    Type,
    UploadCloud,
    Video,
    X,
} from 'lucide-react';
import React, { useState } from 'react';

import AdminLayout from '@/layouts/admin-layout';

export default function VideoEdukasiCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        slug: '',
        category: '',
        description: '',
        duration: '',
        status: 'draft',
        published_at: '',
        thumbnail: null as File | null,
        video: null as File | null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [videoFileName, setVideoFileName] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/video-edukasi');
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setData('thumbnail', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeThumbnail = () => {
        setData('thumbnail', null);
        setImagePreview(null);
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setData('video', file);
            setVideoFileName(file.name);
        }
    };

    const removeVideo = () => {
        setData('video', null);
        setVideoFileName(null);
    };

    return (
        <div className="min-h-full w-full bg-slate-50 p-4 font-sans text-slate-800 antialiased md:p-6 lg:p-8">
            <Head title="Upload Video Edukasi - SIGAP BANJIR" />

            <div className="mx-auto max-w-6xl space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/video-edukasi"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-teal-700"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900">
                            Upload Video Edukasi Baru
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Unggah berkas video dan informasi panduan mitigasi banjir untuk masyarakat.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3 lg:items-start">
                    
                    {/* Kolom Kiri (File Video & Informasi Utama) */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Upload Berkas Video */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                            <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-4">
                                <Video className="h-5 w-5 text-teal-700" />
                                <h2 className="text-base font-bold text-slate-800">Berkas Video <span className="text-rose-500">*</span></h2>
                            </div>

                            <div className="space-y-3">
                                {videoFileName ? (
                                    <div className="flex items-center justify-between rounded-xl border border-teal-200 bg-teal-50/50 p-4">
                                        <div className="flex items-center gap-3 truncate">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                                                <Video className="h-5 w-5" />
                                            </div>
                                            <div className="truncate">
                                                <p className="text-sm font-bold text-teal-900 truncate">{videoFileName}</p>
                                                <p className="text-xs text-teal-600">Video siap diunggah</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeVideo}
                                            className="rounded-full bg-rose-100 p-1.5 text-rose-600 transition hover:bg-rose-200"
                                            title="Batalkan pilihan"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="relative flex aspect-[21/9] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-teal-500 hover:bg-teal-50/20">
                                        <input
                                            type="file"
                                            accept="video/mp4,video/webm,video/quicktime,video/x-msvideo,.mp4,.webm,.mov,.avi"
                                            onChange={handleVideoChange}
                                            className="absolute inset-0 cursor-pointer opacity-0"
                                        />
                                        <UploadCloud className="mb-2 h-10 w-10 text-slate-400" />
                                        <p className="text-sm font-bold text-slate-700">Klik atau seret berkas video ke sini</p>
                                        <p className="mt-1 text-xs text-slate-400">Format: MP4, WEBM, MOV, AVI (Maksimal 100MB)</p>
                                    </div>
                                )}
                                {errors.video && <p className="text-xs font-medium text-rose-500">{errors.video}</p>}
                            </div>
                        </div>

                        {/* Informasi Dasar */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                            <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-4">
                                <LayoutTemplate className="h-5 w-5 text-teal-700" />
                                <h2 className="text-base font-bold text-slate-800">Detail Informasi Video</h2>
                            </div>

                            <div className="space-y-5">
                                {/* Title */}
                                <div>
                                    <label htmlFor="title" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                                        <Type className="h-3.5 w-3.5 text-slate-400" />
                                        Judul Video <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Contoh: Langkah Cepat Penyelamatan Diri Saat Banjir Bandang"
                                        className={`w-full rounded-xl border bg-slate-50/70 px-4 py-2.5 text-sm transition focus:bg-white focus:outline-none focus:ring-1 ${
                                            errors.title ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-200 focus:border-teal-700 focus:ring-teal-700'
                                        }`}
                                    />
                                    {errors.title && <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.title}</p>}
                                </div>

                                {/* Slug */}
                                <div>
                                    <label htmlFor="slug" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                                        <LinkIcon className="h-3.5 w-3.5 text-slate-400" />
                                        Slug / Tautan (Opsional)
                                    </label>
                                    <input
                                        id="slug"
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="Dibuat otomatis dari judul jika dikosongkan"
                                        className={`w-full rounded-xl border bg-slate-50/70 px-4 py-2.5 text-sm transition focus:bg-white focus:outline-none focus:ring-1 ${
                                            errors.slug ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-200 focus:border-teal-700 focus:ring-teal-700'
                                        }`}
                                    />
                                    {errors.slug && <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.slug}</p>}
                                </div>

                                {/* Category & Duration */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="category" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                                            <Folder className="h-3.5 w-3.5 text-slate-400" />
                                            Kategori Video
                                        </label>
                                        <input
                                            id="category"
                                            type="text"
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value)}
                                            placeholder="Contoh: Mitigasi / Evakuasi"
                                            className={`w-full rounded-xl border bg-slate-50/70 px-4 py-2.5 text-sm transition focus:bg-white focus:outline-none focus:ring-1 ${
                                                errors.category ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-200 focus:border-teal-700 focus:ring-teal-700'
                                            }`}
                                        />
                                        {errors.category && <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.category}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="duration" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                                            Durasi (dalam Detik)
                                        </label>
                                        <input
                                            id="duration"
                                            type="number"
                                            min="0"
                                            value={data.duration}
                                            onChange={(e) => setData('duration', e.target.value)}
                                            placeholder="Contoh: 120 (untuk 2 menit)"
                                            className={`w-full rounded-xl border bg-slate-50/70 px-4 py-2.5 text-sm transition focus:bg-white focus:outline-none focus:ring-1 ${
                                                errors.duration ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-200 focus:border-teal-700 focus:ring-teal-700'
                                            }`}
                                        />
                                        {errors.duration && <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.duration}</p>}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label htmlFor="description" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                                        <FileText className="h-3.5 w-3.5 text-slate-400" />
                                        Deskripsi Video
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={6}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Tuliskan ringkasan isi video edukasi di sini..."
                                        className={`w-full rounded-xl border bg-slate-50/70 px-4 py-3 text-sm transition focus:bg-white focus:outline-none focus:ring-1 ${
                                            errors.description ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-200 focus:border-teal-700 focus:ring-teal-700'
                                        }`}
                                    />
                                    {errors.description && <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.description}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan (Pengaturan Publikasi & Thumbnail) */}
                    <div className="space-y-6">
                        {/* Pengaturan Publikasi */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 border-b border-slate-100 pb-4 text-base font-bold text-slate-800">
                                Pengaturan Publikasi
                            </h2>

                            <div className="space-y-5">
                                {/* Status */}
                                <div>
                                    <label htmlFor="status" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                                        Status Publikasi
                                    </label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-sm transition focus:border-teal-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-700"
                                    >
                                        <option value="draft">Draft (Konsep)</option>
                                        <option value="published">Terbit (Published)</option>
                                        <option value="archived">Arsip (Archived)</option>
                                    </select>
                                    {errors.status && <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.status}</p>}
                                </div>

                                {/* Published At */}
                                <div>
                                    <label htmlFor="published_at" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                        Jadwal Terbit (Opsional)
                                    </label>
                                    <input
                                        id="published_at"
                                        type="datetime-local"
                                        value={data.published_at}
                                        onChange={(e) => setData('published_at', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm transition focus:border-teal-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-700"
                                    />
                                    {errors.published_at && <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.published_at}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail Upload */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-4 text-base font-bold text-slate-800">
                                <ImageIcon className="h-5 w-5 text-teal-700" />
                                Gambar Mini (Thumbnail)
                            </h2>

                            <div className="space-y-4">
                                {imagePreview ? (
                                    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={removeThumbnail}
                                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-rose-600/90 text-white shadow-sm backdrop-blur transition hover:bg-rose-700"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="relative flex aspect-video cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-teal-500 hover:bg-teal-50/50">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleThumbnailChange}
                                            className="absolute inset-0 cursor-pointer opacity-0"
                                        />
                                        <UploadCloud className="mb-2 h-8 w-8 text-slate-400" />
                                        <p className="text-sm font-semibold text-slate-600">Klik atau seret gambar</p>
                                        <p className="text-[11px] text-slate-400">JPG, PNG, WEBP (Maks 2MB)</p>
                                    </div>
                                )}
                                {errors.thumbnail && <p className="text-xs font-medium text-rose-500">{errors.thumbnail}</p>}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-3">
                            <Link
                                href="/admin/video-edukasi"
                                className="flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-800"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-800 px-4 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-teal-900/20 transition hover:bg-teal-900 disabled:opacity-50"
                            >
                                {processing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                Simpan Video
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Pasangkan Layout Admin
VideoEdukasiCreate.layout = (page: React.ReactNode) => <AdminLayout children={page} />;
