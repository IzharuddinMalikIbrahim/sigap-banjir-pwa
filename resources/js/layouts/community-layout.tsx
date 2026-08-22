import { Link, router, usePage } from '@inertiajs/react';
import {
    Bell,
    ClipboardList,
    LayoutDashboard,
    LogOut,
    Map,
    Menu,
    Waves,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import type { ReactNode } from 'react';

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

interface CommunityLayoutProps {
    children: ReactNode;
}

export default function CommunityLayout({
    children,
}: CommunityLayoutProps) {
    const page = usePage<AuthProps>();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const auth = page.props.auth;
    const url = page.url;

    const user = auth?.user;

    const isActive = (
        path: string,
        exact = false,
    ): boolean => {
        if (exact) {
            return url === path;
        }

        return (
            url === path ||
            url.startsWith(`${path}/`)
        );
    };

    const menuClass = (
        path: string,
        exact = false,
    ): string => {
        const active = isActive(
            path,
            exact,
        );

        return [
            'group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-all duration-200',
            active
                ? 'border-teal-100 bg-teal-50 font-bold text-teal-800 shadow-sm'
                : 'border-transparent text-slate-700 hover:bg-teal-50 hover:text-teal-800',
        ].join(' ');
    };

    const iconClass = (
        path: string,
        exact = false,
    ): string => {
        const active = isActive(
            path,
            exact,
        );

        return active
            ? 'h-4 w-4 text-teal-700'
            : 'h-4 w-4 text-slate-500 group-hover:text-teal-700';
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
                        <h1 className="text-sm font-black tracking-wider text-slate-900">
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

            {/* Tambahan `items-start` mencegah flex child memanjang (stretch) */}
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
                {/* Ubah `lg:static` menjadi `lg:sticky lg:top-0 lg:h-screen` */}
                <aside
                    className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
                        isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
                    }`}
                >
                    {/* Brand */}
                    <div className="flex items-center justify-between border-b border-slate-100 p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-800 shadow-sm shadow-teal-900/20">
                                <Waves className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-sm font-black tracking-wider text-slate-900">
                                    SIGAP BANJIR
                                </h1>
                                <p className="text-[10px] font-semibold text-slate-500">
                                    Portal Masyarakat
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
                    <nav className="flex-1 space-y-1.5 overflow-y-auto p-4 custom-scrollbar">
                        <Link
                            href="/dashboard"
                            onClick={closeSidebar}
                            className={menuClass(
                                '/dashboard',
                                true,
                            )}
                        >
                            <LayoutDashboard
                                className={iconClass(
                                    '/dashboard',
                                    true,
                                )}
                            />
                            <span>Dashboard</span>
                        </Link>

                        <Link
                            href="/my-reports"
                            onClick={closeSidebar}
                            className={menuClass(
                                '/my-reports',
                                true,
                            )}
                        >
                            <ClipboardList
                                className={iconClass(
                                    '/my-reports',
                                    true,
                                )}
                            />
                            <span>Laporan Saya</span>
                        </Link>

                        <Link
                            href="/"
                            onClick={closeSidebar}
                            className={menuClass(
                                '/',
                                true,
                            )}
                        >
                            <Map
                                className={iconClass(
                                    '/',
                                    true,
                                )}
                            />
                            <span>Peta Banjir</span>
                        </Link>

                        <Link
                            href="/notifications"
                            onClick={closeSidebar}
                            className={menuClass(
                                '/notifications',
                                true,
                            )}
                        >
                            <Bell
                                className={iconClass(
                                    '/notifications',
                                    true,
                                )}
                            />
                            <span>Notifikasi</span>
                        </Link>
                    </nav>

                    {/* User Profile & Logout */}
                    <div className="border-t border-slate-100 p-4">
                        <div className="mb-4 flex items-center gap-3 px-2">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-800">
                                {user?.name?.charAt(0).toUpperCase() ?? 'P'}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-slate-900">
                                    {user?.name ?? 'Pengguna'}
                                </p>
                                <p className="truncate text-xs font-medium text-slate-500">
                                    {user?.email ?? '-'}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-red-600 transition hover:bg-red-100 active:scale-95"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Keluar Sistem</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="min-w-0 flex-1 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
