import { Link, router, usePage } from '@inertiajs/react';
import {
    BookOpen,
    LayoutDashboard,
    LogOut,
    Map,
    Menu,
    Tent,
    Video,
    Waves,
    X,
} from 'lucide-react';
import React, { useState  } from 'react';
import type {ReactNode} from 'react';

interface AuthUser {
    id: number;
    name: string;
    email: string;
}

interface AuthProps extends Record<string, unknown> {
    auth: {
        user: AuthUser | null;
    };
}

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({
    children,
}: AdminLayoutProps) {
    const { url } = usePage();
    const { auth } = usePage<AuthProps>().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const user = auth?.user;

    const isActive = (path: string) => {
        return (
            url === path ||
            url.startsWith(`${path}/`)
        );
    };

    const menuClass = (path: string) => {
        const active = isActive(path);

        return `
            flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
            transition-colors
            ${
                active
                    ? 'bg-teal-50 text-teal-800'
                    : 'text-slate-600 hover:bg-teal-50 hover:text-teal-800'
            }
        `;
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans antialiased">
            {/* Mobile Header Navbar */}
            <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm lg:hidden">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-800 shadow-sm">
                        <Waves className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm font-black tracking-wider text-teal-800">
                            SIGAP BANJIR
                        </h1>
                    </div>
                </div>

                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200 active:scale-95"
                >
                    <Menu className="h-5 w-5" />
                </button>
            </div>

            {/* Tambahan `items-start` agar flex item (sidebar) tidak meregang (stretch) otomatis */}
            <div className="flex items-start min-h-[calc(100vh-61px)] lg:min-h-screen">
                
                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity lg:hidden"
                        onClick={closeSidebar}
                        aria-hidden="true"
                    />
                )}

                {/* Sidebar */}
                {/* Tambahan `lg:sticky lg:top-0 lg:h-screen` agar sidebar menempel di atas dan tingginya pas dengan layar desktop */}
                <aside
                    className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
                        isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
                    }`}
                >
                    {/* Branding */}
                    <div className="flex items-center justify-between border-b border-slate-100 p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-800 shadow-sm shadow-teal-900/20">
                                <Waves className="h-5 w-5 text-white" />
                            </div>

                            <div>
                                <h1 className="font-black tracking-wider text-teal-800">
                                    SIGAP BANJIR
                                </h1>

                                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                    Administrator
                                </p>
                            </div>
                        </div>

                        {/* Close button for Mobile */}
                        <button
                            onClick={closeSidebar}
                            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 custom-scrollbar">
                        <Link
                            href="/admin/home"
                            onClick={closeSidebar}
                            className={menuClass('/admin/home')}
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Link>

                        <Link
                            href="/admin/floodreport"
                            onClick={closeSidebar}
                            className={menuClass('/admin/floodreport')}
                        >
                            <Map className="h-4 w-4" />
                            Laporan Banjir
                        </Link>

                        <Link
                            href="/admin/posko"
                            onClick={closeSidebar}
                            className={menuClass('/admin/posko')}
                        >
                            <Tent className="h-4 w-4" />
                            Posko
                        </Link>

                        {/* --- MENU BARU: EDUKASI --- */}
                        <div className="pt-4 pb-2">
                            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Manajemen Edukasi
                            </p>
                        </div>

                        <Link
                            href="/admin/video-edukasi"
                            onClick={closeSidebar}
                            className={menuClass('/admin/video-edukasi')}
                        >
                            <Video className="h-4 w-4" />
                            Video Edukasi
                        </Link>

                        <Link
                            href="/admin/edukasi-mitigasi"
                            onClick={closeSidebar}
                            className={menuClass('/admin/edukasi-mitigasi')}
                        >
                            <BookOpen className="h-4 w-4" />
                            Edukasi Mitigasi
                        </Link>
                        {/* --- END MENU BARU --- */}
                    </nav>

                    {/* User / Logout */}
                    <div className="border-t border-slate-100 p-4">
                        <div className="mb-4 flex items-center gap-3 px-2">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-800">
                                {user?.name?.charAt(0).toUpperCase() ?? 'A'}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-slate-900">
                                    {user?.name ?? 'Administrator'}
                                </p>
                                <p className="truncate text-xs font-medium text-slate-500">
                                    {user?.email ?? '-'}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-rose-600 transition hover:bg-rose-100 active:scale-95"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Keluar Sistem</span>
                        </button>
                    </div>
                </aside>

                {/* Content */}
                <main className="min-w-0 flex-1 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
