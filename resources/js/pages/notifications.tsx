import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    Bell,
    CheckCircle2,
    CheckCheck,
    Clock3,
    Info,
    Megaphone,
    ShieldAlert,
} from 'lucide-react';

interface NotificationItem {
    id: number;
    type: string;
    title: string;
    message: string;
    data?: Record<string, unknown> | null;
    priority: string;
    created_at: string;
    read_at: string | null;
}

interface PaginatedNotifications {
    data: NotificationItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface NotificationsProps {
    notifications: PaginatedNotifications;
    unreadCount: number;
}

const getPriorityConfig = (priority: string) => {
    switch (priority) {
        case 'high':
        case 'urgent':
            return {
                label: priority === 'urgent'
                    ? 'Darurat'
                    : 'Penting',
                className:
                    'border-rose-200 bg-rose-50 text-rose-700',
                icon: ShieldAlert,
            };

        case 'medium':
            return {
                label: 'Perhatian',
                className:
                    'border-amber-200 bg-amber-50 text-amber-700',
                icon: AlertCircle,
            };

        default:
            return {
                label: 'Informasi',
                className:
                    'border-slate-200 bg-slate-100 text-slate-600',
                icon: Info,
            };
    }
};

const getNotificationIcon = (type: string) => {
    switch (type) {
        case 'flood':
        case 'flood_alert':
            return ShieldAlert;

        case 'report_verified':
            return CheckCircle2;

        case 'announcement':
            return Megaphone;

        default:
            return Bell;
    }
};

const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(date));
};

export default function Notifications({
    notifications,
    unreadCount,
}: NotificationsProps) {
    const markAsRead = (id: number) => {
        router.post(
            `/notifications/${id}/read`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const markAllAsRead = () => {
        router.post(
            '/notifications/read-all',
            {},
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <>
            <Head title="Notifikasi - SIGAP BANJIR" />

            <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">

                {/* Header */}
                <section className="flex flex-col gap-4 rounded-3xl bg-teal-800 p-6 text-white shadow-md sm:flex-row sm:items-center sm:justify-between md:p-8">
                    <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                            <Bell className="h-7 w-7 text-teal-100" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-black tracking-tight">
                                Notifikasi
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-teal-100/90">
                                Informasi terbaru terkait laporan banjir,
                                verifikasi, peringatan dini, dan aktivitas
                                SIGAP BANJIR.
                            </p>
                        </div>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={markAllAsRead}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-teal-800 transition hover:bg-teal-50"
                        >
                            <CheckCheck className="h-4 w-4" />
                            Tandai Semua Dibaca
                        </button>
                    )}
                </section>

                {/* Summary */}
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Total Notifikasi
                            </p>

                            <Bell className="h-5 w-5 text-teal-700" />
                        </div>

                        <p className="mt-3 text-3xl font-black text-slate-900">
                            {notifications.total}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Belum Dibaca
                            </p>

                            <AlertCircle className="h-5 w-5 text-amber-500" />
                        </div>

                        <p className="mt-3 text-3xl font-black text-amber-600">
                            {unreadCount}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Status
                            </p>

                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        </div>

                        <p className="mt-3 text-sm font-bold text-slate-900">
                            Sistem aktif
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            Notifikasi akan diperbarui secara berkala.
                        </p>
                    </div>
                </section>

                {/* Notification List */}
                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-5 py-5 md:px-6">
                        <h2 className="text-lg font-bold text-slate-900">
                            Daftar Notifikasi
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Informasi dan pembaruan terbaru untuk akun Anda.
                        </p>
                    </div>

                    {notifications.data.length === 0 ? (
                        <div className="flex min-h-[320px] flex-col items-center justify-center px-6 py-12 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                                <Bell className="h-8 w-8" />
                            </div>

                            <h3 className="mt-4 text-base font-bold text-slate-800">
                                Belum Ada Notifikasi
                            </h3>

                            <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                                Notifikasi tentang laporan banjir,
                                verifikasi, dan peringatan dini akan
                                muncul di halaman ini.
                            </p>

                            <Link
                                href="/"
                                className="mt-5 rounded-xl bg-teal-800 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-teal-900"
                            >
                                Kembali ke Beranda
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {notifications.data.map((notification) => {
                                const priority =
                                    getPriorityConfig(
                                        notification.priority,
                                    );

                                const NotificationIcon =
                                    getNotificationIcon(
                                        notification.type,
                                    );

                                return (
                                    <article
                                        key={notification.id}
                                        className={`p-5 transition hover:bg-slate-50 md:p-6 ${
                                            notification.read_at
                                                ? 'bg-white'
                                                : 'bg-teal-50/30'
                                        }`}
                                    >
                                        <div className="flex gap-4">
                                            <div
                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                                    notification.read_at
                                                        ? 'bg-slate-100 text-slate-500'
                                                        : 'bg-teal-100 text-teal-700'
                                                }`}
                                            >
                                                <NotificationIcon className="h-5 w-5" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3
                                                            className={`text-sm font-bold ${
                                                                notification.read_at
                                                                    ? 'text-slate-700'
                                                                    : 'text-slate-900'
                                                            }`}
                                                        >
                                                            {
                                                                notification.title
                                                            }
                                                        </h3>

                                                        <span
                                                            className={`inline-flex items-center rounded-lg border px-2 py-1 text-[10px] font-bold ${priority.className}`}
                                                        >
                                                            {priority.label}
                                                        </span>
                                                    </div>

                                                    <span className="flex shrink-0 items-center gap-1 text-[11px] text-slate-400">
                                                        <Clock3 className="h-3.5 w-3.5" />
                                                        {formatDate(
                                                            notification.created_at,
                                                        )}
                                                    </span>
                                                </div>

                                                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                                    {
                                                        notification.message
                                                    }
                                                </p>

                                                <div className="mt-4 flex items-center justify-between">
                                                    <span
                                                        className={`text-[10px] font-semibold uppercase tracking-wider ${
                                                            notification.read_at
                                                                ? 'text-slate-400'
                                                                : 'text-teal-700'
                                                        }`}
                                                    >
                                                        {notification.read_at
                                                            ? 'Sudah dibaca'
                                                            : 'Belum dibaca'}
                                                    </span>

                                                    {!notification.read_at && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                markAsRead(
                                                                    notification.id,
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-white px-3 py-2 text-[11px] font-bold text-teal-700 transition hover:bg-teal-50"
                                                        >
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                            Tandai Dibaca
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* Pagination */}
                {notifications.last_page > 1 && (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-xs text-slate-500">
                            Menampilkan{' '}
                            <strong>{notifications.from}</strong>
                            {' '}sampai{' '}
                            <strong>{notifications.to}</strong>
                            {' '}dari{' '}
                            <strong>{notifications.total}</strong>
                            {' '}notifikasi
                        </p>

                        <div className="flex gap-2">
                            {notifications.current_page > 1 && (
                                <Link
                                    href={`/notifications?page=${
                                        notifications.current_page - 1
                                    }`}
                                    className="rounded-xl border bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Sebelumnya
                                </Link>
                            )}

                            {notifications.current_page <
                                notifications.last_page && (
                                <Link
                                    href={`/notifications?page=${
                                        notifications.current_page + 1
                                    }`}
                                    className="rounded-xl bg-teal-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-teal-900"
                                >
                                    Berikutnya
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

Notifications.layout = {
    breadcrumbs: [
        {
            title: 'Notifikasi',
            href: '/notifications',
        },
    ],
};
