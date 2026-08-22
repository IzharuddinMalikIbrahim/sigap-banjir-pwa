import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';

import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import CommunityLayout from '@/layouts/community-layout';
import SettingsLayout from '@/layouts/settings/layout';
import AdminLayout from '@/layouts/admin-layout';
import HomeLayout from '@/layouts/home-layout';

const appName =
    import.meta.env.VITE_APP_NAME || 'SIGAP BANJIR';

createInertiaApp({
    title: (title) =>
        title
            ? `${title} - ${appName}`
            : appName,

    layout: (name) => {
        switch (true) {
            case name === 'home':
                return HomeLayout;

            case name === 'dashboard':
            case name === 'my-reports':
            case name === 'notifications':
            case name.startsWith('flood-reports/'):
                return CommunityLayout;

            case name.startsWith('auth/'):
                return AuthLayout;

            case name.startsWith('admin/'):
                return AdminLayout;

            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];

            default:
                return AppLayout;
        }
    },

    strictMode: true,

    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}

                <Toaster />
            </TooltipProvider>
        );
    },

    progress: {
        color: '#4B5563',
    },
});

initializeTheme();
