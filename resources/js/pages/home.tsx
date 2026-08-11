import axios from 'axios';
import { useState } from 'react';

import FloodMap from '@/components/map/flood-map';
import type { FloodReport } from '@/types/flood';

interface HomeProps {
    reports: FloodReport[];
}

interface FloodReportForm {
    latitude: string;
    longitude: string;
    address: string;
    water_level: string;
    description: string;
}

export default function Home({
    reports = [],
}: HomeProps) {
    const [showReportForm, setShowReportForm] = useState(false);

    const [form, setForm] = useState<FloodReportForm>({
        latitude: '',
        longitude: '',
        address: '',
        water_level: '',
        description: '',
    });

    const [images, setImages] = useState<File[]>([]);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    /**
     * Get user's current location.
     */
    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setErrorMessage(
                'Browser Anda tidak mendukung lokasi GPS.',
            );

            return;
        }

        setLoadingLocation(true);
        setErrorMessage('');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                setForm((current) => ({
                    ...current,
                    latitude: latitude.toFixed(8),
                    longitude: longitude.toFixed(8),
                }));

                setLoadingLocation(false);

                /*
                 * Reverse geocoding.
                 *
                 * Untuk sementara kita menggunakan koordinat.
                 * Nanti bisa diganti dengan API geocoding.
                 */
                setForm((current) => ({
                    ...current,
                    address: `${latitude.toFixed(
                        6,
                    )}, ${longitude.toFixed(6)}`,
                }));
            },
            (error) => {
                setLoadingLocation(false);

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setErrorMessage(
                            'Akses lokasi ditolak. Silakan izinkan lokasi pada browser.',
                        );
                        break;

                    case error.POSITION_UNAVAILABLE:
                        setErrorMessage(
                            'Lokasi Anda tidak dapat ditemukan.',
                        );
                        break;

                    case error.TIMEOUT:
                        setErrorMessage(
                            'Permintaan lokasi mengalami timeout.',
                        );
                        break;

                    default:
                        setErrorMessage(
                            'Gagal mendapatkan lokasi.',
                        );
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            },
        );
    };

    /**
     * Handle form input.
     */
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >,
    ) => {
        const { name, value } = e.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    /**
     * Handle image selection.
     */
    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (!e.target.files) {
            return;
        }

        const selectedFiles = Array.from(
            e.target.files,
        );

        if (selectedFiles.length > 5) {
            setErrorMessage(
                'Maksimal 5 foto dapat diunggah.',
            );

            return;
        }

        const invalidFile = selectedFiles.find(
            (file) => file.size > 2 * 1024 * 1024,
        );

        if (invalidFile) {
            setErrorMessage(
                'Ukuran setiap foto maksimal 2 MB.',
            );

            return;
        }

        setImages(selectedFiles);
        setErrorMessage('');
    };

    /**
     * Submit flood report.
     */
    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>,
    ) => {
        e.preventDefault();

        setSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const formData = new FormData();

            formData.append(
                'latitude',
                form.latitude,
            );

            formData.append(
                'longitude',
                form.longitude,
            );

            formData.append(
                'address',
                form.address,
            );

            formData.append(
                'water_level',
                form.water_level,
            );

            if (form.description) {
                formData.append(
                    'description',
                    form.description,
                );
            }

            images.forEach((image) => {
                formData.append(
                    'images[]',
                    image,
                );
            });

            await axios.post(
                '/api/v1/flood-reports',
                formData,
                {
                    headers: {
                        Accept: 'application/json',
                    },
                },
            );

            setSuccessMessage(
                'Laporan banjir berhasil dikirim dan menunggu verifikasi.',
            );

            setForm({
                latitude: '',
                longitude: '',
                address: '',
                water_level: '',
                description: '',
            });

            setImages([]);

            /*
             * Tutup form setelah beberapa saat.
             */
            setTimeout(() => {
                setShowReportForm(false);
                setSuccessMessage('');
            }, 2000);
        } catch (error: any) {
            if (
                error.response?.status === 422
            ) {
                const errors =
                    error.response.data.errors;

                const firstError = Object.values(
                    errors ?? {},
                )[0];

                setErrorMessage(
                    Array.isArray(firstError)
                        ? String(firstError[0])
                        : 'Data laporan tidak valid.',
                );
            } else {
                setErrorMessage(
                    error.response?.data?.message ??
                        'Gagal mengirim laporan banjir.',
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
                {/* Header */}
                <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            SIGAP BANJIR
                        </h1>

                        <p className="text-sm text-muted-foreground">
                            Pantau kondisi banjir di sekitar Anda.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setShowReportForm(true);
                            setErrorMessage('');
                            setSuccessMessage('');
                        }}
                        className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-red-700"
                    >
                        🚨 Lapor Banjir
                    </button>
                </section>

                {/* Map */}
                <section>
                    <FloodMap reports={reports} />
                </section>

                {/* Latest Reports */}
                <section>
                    <h2 className="mb-4 text-xl font-bold">
                        Laporan Banjir Terbaru
                    </h2>

                    {reports.length === 0 ? (
                        <div className="rounded-xl border p-8 text-center text-muted-foreground">
                            Belum ada laporan banjir.
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {reports.map((report) => (
                                <div
                                    key={report.id}
                                    className="rounded-xl border p-4"
                                >
                                    <h3 className="font-semibold">
                                        {report.address}
                                    </h3>

                                    <p className="mt-1 text-sm">
                                        Ketinggian air:{' '}
                                        <strong>
                                            {
                                                report.water_level
                                            }{' '}
                                            cm
                                        </strong>
                                    </p>

                                    {report.description && (
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {
                                                report.description
                                            }
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* Report Modal */}
            {showReportForm && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-background shadow-xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b p-5">
                            <div>
                                <h2 className="text-xl font-bold">
                                    🚨 Lapor Banjir
                                </h2>

                                <p className="text-sm text-muted-foreground">
                                    Bantu masyarakat mengetahui kondisi
                                    banjir di sekitar Anda.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowReportForm(false)
                                }
                                className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 p-5"
                        >
                            {/* Location */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="font-medium">
                                        Lokasi
                                    </label>

                                    <button
                                        type="button"
                                        onClick={
                                            getCurrentLocation
                                        }
                                        disabled={
                                            loadingLocation
                                        }
                                        className="rounded-lg border px-3 py-2 text-sm"
                                    >
                                        {loadingLocation
                                            ? 'Mencari lokasi...'
                                            : '📍 Gunakan Lokasi Saya'}
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="number"
                                        step="any"
                                        name="latitude"
                                        value={
                                            form.latitude
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Latitude"
                                        required
                                        className="w-full rounded-lg border bg-background px-3 py-2"
                                    />

                                    <input
                                        type="number"
                                        step="any"
                                        name="longitude"
                                        value={
                                            form.longitude
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Longitude"
                                        required
                                        className="w-full rounded-lg border bg-background px-3 py-2"
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="mb-2 block font-medium">
                                    Alamat / Lokasi
                                </label>

                                <input
                                    type="text"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    placeholder="Contoh: Jl. Sudirman, Jakarta"
                                    required
                                    className="w-full rounded-lg border bg-background px-3 py-2"
                                />
                            </div>

                            {/* Water Level */}
                            <div>
                                <label className="mb-2 block font-medium">
                                    Ketinggian Air
                                </label>

                                <div className="relative">
                                    <input
                                        type="number"
                                        name="water_level"
                                        value={
                                            form.water_level
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="0"
                                        step="1"
                                        placeholder="Contoh: 75"
                                        required
                                        className="w-full rounded-lg border bg-background px-3 py-2 pr-12"
                                    />

                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                        cm
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="mb-2 block font-medium">
                                    Deskripsi
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        form.description
                                    }
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Ceritakan kondisi banjir..."
                                    className="w-full rounded-lg border bg-background px-3 py-2"
                                />
                            </div>

                            {/* Images */}
                            <div>
                                <label className="mb-2 block font-medium">
                                    Foto Kondisi Banjir
                                </label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={
                                        handleImageChange
                                    }
                                    className="w-full rounded-lg border p-2 text-sm"
                                />

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Maksimal 5 foto, masing-masing
                                    maksimal 2 MB.
                                </p>

                                {images.length > 0 && (
                                    <div className="mt-3 grid grid-cols-3 gap-2">
                                        {images.map(
                                            (
                                                image,
                                                index,
                                            ) => (
                                                <div
                                                    key={`${image.name}-${index}`}
                                                    className="truncate rounded-lg border p-2 text-xs"
                                                >
                                                    {image.name}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Messages */}
                            {errorMessage && (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                    {errorMessage}
                                </div>
                            )}

                            {successMessage && (
                                <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                                    {successMessage}
                                </div>
                            )}

                            {/* Submit */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowReportForm(
                                            false,
                                        )
                                    }
                                    className="flex-1 rounded-xl border px-4 py-3 font-medium"
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {submitting
                                        ? 'Mengirim...'
                                        : 'Kirim Laporan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}