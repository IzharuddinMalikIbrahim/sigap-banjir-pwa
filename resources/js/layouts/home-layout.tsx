import { router, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    LogIn,
    LogOut,
    Waves,
} from 'lucide-react';
import type { ReactNode } from 'react';

interface AuthUser {
    id: number;
    name: string;
    email: string;
    role?: {
        id: number;
        name: string;
        slug: string;
    } | null;
}

interface AuthProps extends Record<string, unknown> {
    auth: {
        user: AuthUser | null;
    };
}

interface HomeLayoutProps {
    children: ReactNode;
}

export default function HomeLayout({
    children,
}: HomeLayoutProps) {
    const { auth } = usePage<AuthProps>().props;

    const user = auth?.user;

    const isCommunity =
        user?.role?.slug === 'community';

    console.log('user:', user);
    console.log('role:', user?.role);
    console.log('slug:', user?.role?.slug);
    console.log('isCommunity:', isCommunity);

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-slate-50/70 font-sans text-slate-800 antialiased selection:bg-teal-700 selection:text-white">
            {/* Top Navigation */}
            <header className="sticky top-0 z-40 border-b border-teal-900/10 bg-teal-800 text-white shadow-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

                    {/* Branding */}
                    <a
                        href="/"
                        className="flex items-center space-x-3"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-md">
                            <Waves className="h-6 w-6 text-teal-200" />
                        </div>

                        <div>
                            <div className="flex items-center space-x-2">
                                <h1 className="text-lg font-black tracking-wider">
                                    SIGAP BANJIR
                                </h1>

                                <span className="inline-flex items-center rounded-full bg-teal-700/80 px-2 py-0.5 text-[10px] font-semibold text-teal-100 ring-1 ring-inset ring-teal-600">
                                    PWA Siaga
                                </span>
                            </div>

                            <p className="hidden text-xs text-teal-200/90 sm:block">
                                Sistem Informasi & Gotong Royong Antisipasi Banjir
                            </p>
                        </div>
                    </a>

                    {/* Navigation + Authentication */}
                    <div className="flex items-center gap-2 sm:gap-3">

                        {/* User Name */}
                        {user && (
                            <span className="hidden max-w-32 truncate text-xs font-semibold text-teal-100 lg:block">
                                {user.name}
                            </span>
                        )}

                        {/* Dashboard Community */}
                        {isCommunity && (
                            <a
                                href="/dashboard"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/20 active:scale-95 sm:px-4 sm:text-sm"
                            >
                                <LayoutDashboard className="h-4 w-4" />

                                <span className="hidden sm:inline">
                                    Dashboard
                                </span>
                            </a>
                        )}

                        {/* Login / Logout */}
                        {user ? (
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/20 active:scale-95 sm:px-4 sm:text-sm"
                            >
                                <LogOut className="h-4 w-4" />

                                <span className="hidden sm:inline">
                                    Keluar
                                </span>
                            </button>
                        ) : (
                            <a
                                href="/login"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/20 active:scale-95 sm:px-4 sm:text-sm"
                            >
                                <LogIn className="h-4 w-4" />

                                <span className="hidden sm:inline">
                                    Masuk
                                </span>
                            </a>
                        )}
                    </div>
                </div>
            </header>

            {/* Page Content */}
            <main>
                {children}
            </main>
        </div>
    );
}
