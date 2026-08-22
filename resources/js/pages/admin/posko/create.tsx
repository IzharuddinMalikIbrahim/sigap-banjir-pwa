import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Save,
    Tent,
} from 'lucide-react';
import type { FormEvent} from 'react';
import { useState } from 'react';

export default function Create() {
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (
        e: FormEvent<HTMLFormElement>,
    ) => {
        e.preventDefault();

        const formData = new FormData(
            e.currentTarget,
        );

        setProcessing(true);

        router.post(
            '/admin/posko',
            {
                name: formData.get('name'),
                address: formData.get('address'),
                latitude: formData.get('latitude'),
                longitude: formData.get('longitude'),
                capacity: formData.get('capacity'),
                current_occupancy:
                    formData.get('current_occupancy'),
                contact: formData.get('contact'),
                status: formData.get('status'),
                description: formData.get('description'),
            },
            {
                onFinish: () => {
                    setProcessing(false);
                },
            },
        );
    };

    return (
        <>
            <Head title="Tambah Posko - Admin" />

            <div className="min-h-full bg-slate-50">
                <div className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-6 lg:p-8">

                    <div>
                        <Link
                            href="/admin/posko"
                            className="mb-3 inline-flex items-center gap-2 text-xs font-semibold text-teal-700 hover:text-teal-900"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Posko
                        </Link>

                        <h1 className="text-2xl font-black text-slate-900">
                            Tambah Posko Evakuasi
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Tambahkan lokasi posko evakuasi baru.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                                <Tent className="h-5 w-5" />
                            </div>

                            <div>
                                <h2 className="font-bold text-slate-900">
                                    Informasi Posko
                                </h2>

                                <p className="text-xs text-slate-500">
                                    Isi informasi posko secara lengkap.
                                </p>
                            </div>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-6 space-y-5"
                        >

                            {/* Nama */}
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                                    Nama Posko
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Contoh: Posko Utama GOR Serbaguna"
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-teal-800 text-sm outline-none focus:border-teal-700 focus:bg-white focus:ring-1 focus:ring-teal-700"
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                                    Alamat
                                </label>

                                <textarea
                                    name="address"
                                    rows={3}
                                    placeholder="Alamat lengkap posko"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-teal-800 text-sm outline-none focus:border-teal-700 focus:bg-white focus:ring-1 focus:ring-teal-700"
                                />
                            </div>

                            {/* Coordinates */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                                        Latitude
                                    </label>

                                    <input
                                        type="number"
                                        step="any"
                                        name="latitude"
                                        placeholder="-7.77867611"
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-mono text-teal-800 text-sm outline-none focus:border-teal-700 focus:bg-white focus:ring-1 focus:ring-teal-700"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                                        Longitude
                                    </label>

                                    <input
                                        type="number"
                                        step="any"
                                        name="longitude"
                                        placeholder="110.47960265"
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-mono text-teal-800 text-sm outline-none focus:border-teal-700 focus:bg-white focus:ring-1 focus:ring-teal-700"
                                    />
                                </div>
                            </div>

                            {/* Capacity */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                                        Kapasitas
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        name="capacity"
                                        placeholder="500"
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-teal-800 text-sm outline-none focus:border-teal-700 focus:bg-white focus:ring-1 focus:ring-teal-700"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                                        Penghuni Saat Ini
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        name="current_occupancy"
                                        defaultValue="0"
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-teal-800 text-sm outline-none focus:border-teal-700 focus:bg-white focus:ring-1 focus:ring-teal-700"
                                    />
                                </div>
                            </div>

                            {/* Contact */}
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                                    Kontak
                                </label>

                                <input
                                    type="text"
                                    name="contact"
                                    placeholder="0812xxxxxxx"
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-teal-800 text-sm outline-none focus:border-teal-700 focus:bg-white focus:ring-1 focus:ring-teal-700"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    defaultValue="active"
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-teal-800 text-sm outline-none focus:border-teal-700 focus:bg-white focus:ring-1 focus:ring-teal-700"
                                >
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
                            </div>

                            {/* Description */}
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                                    Deskripsi
                                </label>

                                <textarea
                                    name="description"
                                    rows={4}
                                    placeholder="Informasi tambahan mengenai posko..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-teal-800 text-sm outline-none focus:border-teal-700 focus:bg-white focus:ring-1 focus:ring-teal-700"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                                <Link
                                    href="/admin/posko"
                                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
                                >
                                    Batal
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-800 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4" />

                                    {processing
                                        ? 'Menyimpan...'
                                        : 'Simpan Posko'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard Admin',
            href: '/admin/home',
        },
        {
            title: 'Posko Evakuasi',
            href: '/admin/posko',
        },
        {
            title: 'Tambah Posko',
            href: '/admin/posko/create',
        },
    ],
};
