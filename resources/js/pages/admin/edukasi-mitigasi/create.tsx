import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
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

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Props {
    categories: Category[];
}

export default function EdukasiMitigasiCreate({ categories }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        slug: '',
        category_id: '',
        content: '',
        video_url: '',
        status: 'draft',
        published_at: '',
        thumbnail: null as File | null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/edukasi-mitigasi');
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setData('thumbnail', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setData('thumbnail', null);
        setImagePreview(null);
    };

    return (
        <div className="min-h-full w-full bg-slate-50 p-4 font-sans text-slate-800 antialiased md:p-6 lg:p-8">
            <Head title="Tambah Edukasi Mitigasi - SIGAP BANJIR" />

            <div className="mx-auto max-w-6xl space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/edukasi-mitigasi"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-teal-700"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900">
                            Tambah Konten Edukasi
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Buat artikel atau panduan video baru untuk masyarakat.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3 lg:items-start">
                    
                    {/* Kolom Kiri (Konten Utama) */}
                    <div className="space-y-6 lg:col-span-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                            <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-4">
                                <LayoutTemplate className="h-5 w-5 text-teal-700" />
                                <h2 className="text-base font-bold text-slate-800">Informasi Dasar</h2>
                            </div>

                            <div className="space-y-5">
                                {/* Title */}
                                <div>
                                    <label htmlFor="title" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                                        <Type className="h-3.5 w-3.5 text-slate-400" />
                                        Judul Konten <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Contoh: Panduan Evakuasi Mandiri Saat Banjir"
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
                                        placeholder="Bila dikosongkan, akan dibuat otomatis dari judul"
                                        className={`w-full rounded-xl border bg-slate-50/70 px-4 py-2.5 text-sm transition focus:bg-white focus:outline-none focus:ring-1 ${
                                            errors.slug ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-200 focus:border-teal-700 focus:ring-teal-700'
                                        }`}
                                    />
                                    {errors.slug && <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.slug}</p>}
                                </div>

                                {/* Content */}
                                <div>
                                    <label htmlFor="content" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                                        Isi Edukasi / Artikel <span className="text-rose-500">*</span>
                                    </label>
                                    <textarea
                                        id="content"
                                        rows={12}
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        placeholder="Tuliskan panduan atau deskripsi edukasi di sini..."
                                        className={`w-full rounded-xl border bg-slate-50/70 px-4 py-3 text-sm transition focus:bg-white focus:outline-none focus:ring-1 ${
                                            errors.content ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-200 focus:border-teal-700 focus:ring-teal-700'
                                        }`}
                                    />
                                    {errors.content && <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.content}</p>}
                                </div>

                                {/* Video URL */}
                                <div>
                                    <label htmlFor="video_url" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                                        <Video className="h-3.5 w-3.5 text-slate-400" />
                                        Tautan Video (Opsional)
                                    </label>
                                    <input
                                        id="video_url"
                                        type="url"
                                        value={data.video_url}
                                        onChange={(e) => setData('video_url', e.target.value)}
                                        placeholder="https://youtube.com/watch?v=..."
                                        className={`w-full rounded-xl border bg-slate-50/70 px-4 py-2.5 text-sm transition focus:bg-white focus:outline-none focus:ring-1 ${
                                            errors.video_url ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-200 focus:border-teal-700 focus:ring-teal-700'
                                        }`}
                                    />
                                    {errors.video_url && <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.video_url}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan (Pengaturan & Meta) */}
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-5 border-b border-slate-100 pb-4 text-base font-bold text-slate-800">
                                Pengaturan Publikasi
                            </h2>

                            <div className="space-y-5">
                                {/* Category */}
                                <div>
                                    <label htmlFor="category_id" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                                        Kategori <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        id="category_id"
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        className={`w-full rounded-xl border bg-slate-50/70 px-3 py-2.5 text-sm transition focus:bg-white focus:outline-none focus:ring-1 ${
                                            errors.category_id ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-200 focus:border-teal-700 focus:ring-teal-700'
                                        }`}
                                    >
                                        <option value="" disabled>Pilih Kategori</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {errors.category_id && <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.category_id}</p>}
                                </div>

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
                                            onClick={removeImage}
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
                                            onChange={handleImageChange}
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
                                href="/admin/edukasi-mitigasi"
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
                                Simpan
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Pasangkan Layout Admin
EdukasiMitigasiCreate.layout = (page: React.ReactNode) => <AdminLayout children={page} />;
