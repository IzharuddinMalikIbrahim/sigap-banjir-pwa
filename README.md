# 🌊 SIGAP BANJIR

## Sistem Informasi dan Gotong Royong Antisipasi Banjir

> **Platform Digital untuk Pelaporan, Pemantauan, Edukasi, dan Peringatan Dini Banjir Berbasis Partisipasi Masyarakat**

---

## 📌 Project Overview

**SIGAP BANJIR** merupakan aplikasi berbasis **Progressive Web Application (PWA)** yang dikembangkan untuk membantu masyarakat, petugas, dan administrator dalam melakukan pemantauan serta penanganan informasi kejadian banjir.

SIGAP BANJIR mengintegrasikan teknologi:

- Progressive Web Application
- Geographic Information System (GIS)
- Geolocation
- Flood Reporting
- Push Notification
- Offline Support
- Background Synchronization
- Data Visualization
- Role Based Access Control
- REST API

Aplikasi dirancang menggunakan pendekatan **mobile-first**, sehingga dapat digunakan melalui smartphone maupun desktop.

---

# 🎯 Tujuan

SIGAP BANJIR dikembangkan dengan tujuan:

1. Menyediakan media pelaporan banjir yang cepat dan mudah digunakan.
2. Mengumpulkan informasi kondisi banjir dari masyarakat.
3. Menampilkan persebaran banjir dalam bentuk peta digital.
4. Membantu petugas melakukan verifikasi laporan.
5. Memberikan informasi peringatan dini kepada masyarakat.
6. Menyediakan informasi lokasi posko evakuasi.
7. Menyediakan informasi kontak layanan darurat.
8. Menyediakan edukasi mengenai mitigasi dan kesiapsiagaan banjir.
9. Meningkatkan partisipasi masyarakat dalam penanggulangan bencana.
10. Membangun sistem informasi kebencanaan yang terintegrasi dan berbasis data.

---

# 🌱 Konsep SIGAP BANJIR

Konsep utama aplikasi:

```text
                    MASYARAKAT
                         │
                         ▼
                  LAPORAN BANJIR
                         │
              ┌──────────┼──────────┐
              │          │          │
              ▼          ▼          ▼
            GPS        FOTO       DATA
              │          │          │
              └──────────┼──────────┘
                         ▼
                  SISTEM SIGAP
                         │
                         ▼
                    VERIFIKASI
                         │
                  ┌──────┴──────┐
                  ▼             ▼
                 PETA       NOTIFIKASI
                  │             │
                  └──────┬──────┘
                         ▼
                    MASYARAKAT
                         │
                ┌────────┴────────┐
                ▼                 ▼
             MITIGASI          EVAKUASI
```
---

# Konsep Gotong Royong
Masyarakat
     │
     ├── Lapor
     ├── Konfirmasi
     └── Update kondisi
             │
             ▼
       SIGAP BANJIR
             │
             ▼
        Verifikasi
             │
       ┌─────┴─────┐
       ▼           ▼
    Petugas      Sistem
       │           │
       ▼           ▼
    Validasi    Peringatan
       │           │
       └─────┬─────┘
             ▼
        Masyarakat

---

# System Architecture

┌─────────────────────────────────────────────┐
│                  USER DEVICE                │
│                                             │
│       Smartphone / Tablet / Desktop         │
└───────────────────────┬─────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────┐
│                    PWA                      │
│                                             │
│ React + Inertia + TypeScript + Tailwind    │
│                                             │
│ Service Worker                              │
│ Web App Manifest                            │
│ Offline Cache                               │
│ Background Sync                             │
└───────────────────────┬─────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────┐
│                  LARAVEL 13                 │
│                                             │
│ Controllers                                 │
│ Services                                    │
│ Requests                                    │
│ API                                         │
│ Authentication                              │
│ Authorization                               │
│ Jobs / Queue                                │
│ Notifications                               │
└───────────────┬──────────────┬──────────────┘
                │              │
                ▼              ▼
       ┌────────────────┐  ┌──────────────┐
       │ MySQL / MariaDB│  │    Redis     │
       │                │  │              │
       │ Application DB │  │ Cache / Queue│
       └────────────────┘  └──────────────┘
                │
                ▼
       ┌────────────────────┐
       │ Laravel Storage    │
       │                    │
       │ Flood Images       │
       │ Education Media    │
       └────────────────────┘

---

# Technology Stack

## Backend

| Technology            | Purpose               |
| --------------------- | --------------------- |
| Laravel 13            | Backend framework     |
| PHP 8.3+              | Programming language  |
| Laravel Sanctum       | API authentication    |
| Laravel Queue         | Background processing |
| Laravel Scheduler     | Scheduled jobs        |
| Laravel Notifications | Notification system   |
| Laravel Storage       | File management       |

## Frontend

| Technology   | Purpose                     |
| ------------ | --------------------------- |
| React        | User interface              |
| TypeScript   | Type safety                 |
| Inertia.js   | Laravel ↔ React integration |
| Tailwind CSS | UI styling                  |
| Vite         | Asset bundling              |
| shadcn/ui    | UI components               |
| Sonner       | Toast notification          |
| Wayfinder    | Laravel route integration   |

## PWA

| Technology        | Purpose                 |
| ----------------- | ----------------------- |
| `vite-plugin-pwa` | PWA integration         |
| Service Worker    | Offline/cache           |
| Web App Manifest  | Installable application |
| Workbox           | Service worker strategy |
| IndexedDB         | Local data storage      |
| Background Sync   | Offline synchronization |

## GIS

| Technology      | Purpose         |
| --------------- | --------------- |
| Leaflet.js      | Interactive map |
| OpenStreetMap   | Base map        |
| Geolocation API | User location   |
| GeoJSON         | Geographic data |

---

# Infrastructure
Ubuntu Server
Nginx
PHP-FPM
MySQL / MariaDB
Redis
Supervisor
Git
GitHub
HTTPS / SSL
---

# Arsitektur PWA

Browser
   │
   ▼
SIGAP BANJIR
   │
   ▼
Service Worker
   │
   ├── Cache
   ├── Offline
   ├── Background Sync
   └── Push Notification

# Struktur Web PWA

sigap-banjir/
│
├── app/
│   │
│   ├── Console/
│   │
│   ├── Events/
│   │
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── FloodReportController.php
│   │   │   │   ├── FloodMapController.php
│   │   │   │   ├── NotificationController.php
│   │   │   │   ├── EvacuationPostController.php
│   │   │   │   └── EducationController.php
│   │   │   │
│   │   │   └── Admin/
│   │   │       ├── DashboardController.php
│   │   │       ├── UserController.php
│   │   │       ├── FloodReportController.php
│   │   │       ├── FloodAreaController.php
│   │   │       ├── EvacuationPostController.php
│   │   │       ├── EducationController.php
│   │   │       └── NotificationController.php
│   │   │
│   │   ├── Middleware/
│   │   ├── Requests/
│   │   └── Resources/
│   │
│   ├── Jobs/
│   │   ├── ProcessFloodReport.php
│   │   ├── SendFloodNotification.php
│   │   └── ExpireFloodReport.php
│   │
│   ├── Models/
│   │   ├── User.php
│   │   ├── Role.php
│   │   ├── Permission.php
│   │   ├── FloodReport.php
│   │   ├── FloodReportImage.php
│   │   ├── FloodReportVerification.php
│   │   ├── FloodArea.php
│   │   ├── FloodLevel.php
│   │   ├── Notification.php
│   │   ├── NotificationRecipient.php
│   │   ├── EvacuationPost.php
│   │   ├── EvacuationPostFacility.php
│   │   ├── EmergencyContact.php
│   │   ├── EducationCategory.php
│   │   ├── EducationContent.php
│   │   ├── DeviceToken.php
│   │   └── ActivityLog.php
│   │
│   ├── Notifications/
│   │
│   ├── Policies/
│   │
│   └── Services/
│       ├── FloodReportService.php
│       ├── FloodSeverityService.php
│       ├── FloodMapService.php
│       ├── NotificationService.php
│       └── GeolocationService.php
│
├── bootstrap/
│
├── config/
│
├── database/
│   ├── factories/
│   ├── migrations/
│   └── seeders/
│
├── public/
│   ├── icons/
│   │   ├── pwa-192x192.png
│   │   └── pwa-512x512.png
│   │
│   ├── images/
│   └── build/
│
├── resources/
│   │
│   ├── css/
│   │   └── app.css
│   │
│   ├── js/
│   │   │
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── flood/
│   │   │   ├── map/
│   │   │   ├── notification/
│   │   │   └── pwa/
│   │   │       ├── install-prompt.tsx
│   │   │       ├── update-prompt.tsx
│   │   │       └── offline-indicator.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── use-appearance.ts
│   │   │   ├── use-online-status.ts
│   │   │   ├── use-geolocation.ts
│   │   │   └── use-pwa.ts
│   │   │
│   │   ├── layouts/
│   │   │   ├── app-layout.tsx
│   │   │   ├── auth-layout.tsx
│   │   │   ├── settings/
│   │   │   └── components/
│   │   │
│   │   ├── pages/
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── login.tsx
│   │   │   │   ├── register.tsx
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── dashboard.tsx
│   │   │   │
│   │   │   ├── flood/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── create.tsx
│   │   │   │   └── show.tsx
│   │   │   │
│   │   │   ├── map/
│   │   │   │   └── index.tsx
│   │   │   │
│   │   │   ├── notifications/
│   │   │   │   └── index.tsx
│   │   │   │
│   │   │   ├── evacuation/
│   │   │   │   ├── index.tsx
│   │   │   │   └── show.tsx
│   │   │   │
│   │   │   ├── education/
│   │   │   │   ├── index.tsx
│   │   │   │   └── show.tsx
│   │   │   │
│   │   │   ├── emergency/
│   │   │   │   └── index.tsx
│   │   │   │
│   │   │   └── settings/
│   │   │
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── flood-report.ts
│   │   │   ├── notification.ts
│   │   │   └── geolocation.ts
│   │   │
│   │   ├── types/
│   │   │   ├── flood.ts
│   │   │   ├── notification.ts
│   │   │   ├── evacuation.ts
│   │   │   └── user.ts
│   │   │
│   │   ├── app.tsx
│   │   └── vite-env.d.ts
│   │
│   └── views/
│
├── routes/
│   ├── web.php
│   ├── api.php
│   └── console.php
│
├── storage/
│
├── tests/
│   ├── Feature/
│   └── Unit/
│
├── .env
├── .env.example
├── .gitignore
├── composer.json
├── package.json
├── tsconfig.json
├── vite.config.js
├── phpunit.xml
└── README.md

# Struktur Frontend

resources/js/
│
├── components/
│   │
│   ├── ui/
│   │
│   ├── flood/
│   │   ├── flood-card.tsx
│   │   ├── flood-level-badge.tsx
│   │   ├── flood-status.tsx
│   │   └── flood-report-card.tsx
│   │
│   ├── map/
│   │   ├── flood-map.tsx
│   │   ├── flood-marker.tsx
│   │   ├── evacuation-marker.tsx
│   │   └── user-location-marker.tsx
│   │
│   ├── notification/
│   │   ├── notification-item.tsx
│   │   └── notification-badge.tsx
│   │
│   └── pwa/
│       ├── install-prompt.tsx
│       ├── update-prompt.tsx
│       └── offline-indicator.tsx
│
├── hooks/
│   ├── use-appearance.ts
│   ├── use-online-status.ts
│   ├── use-geolocation.ts
│   └── use-pwa.ts
│
├── layouts/
│   ├── app-layout.tsx
│   ├── auth-layout.tsx
│   ├── app/
│   │   ├── header.tsx
│   │   ├── bottom-navigation.tsx
│   │   └── sidebar.tsx
│   │
│   └── settings/
│
├── pages/
│   ├── auth/
│   │
│   ├── dashboard.tsx
│   │
│   ├── flood/
│   │   ├── index.tsx
│   │   ├── create.tsx
│   │   └── show.tsx
│   │
│   ├── map/
│   │   └── index.tsx
│   │
│   ├── notifications/
│   │   └── index.tsx
│   │
│   ├── evacuation/
│   │   ├── index.tsx
│   │   └── show.tsx
│   │
│   ├── education/
│   │   ├── index.tsx
│   │   └── show.tsx
│   │
│   ├── emergency/
│   │   └── index.tsx
│   │
│   └── settings/
│
├── services/
│   ├── api.ts
│   ├── flood-report.ts
│   ├── notification.ts
│   └── geolocation.ts
│
├── types/
│   ├── flood.ts
│   ├── user.ts
│   ├── notification.ts
│   ├── evacuation.ts
│   └── education.ts
│
├── app.tsx
└── vite-env.d.ts

# app.tsx
```
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName =
    import.meta.env.VITE_APP_NAME || 'SIGAP BANJIR';

createInertiaApp({
    title: (title) =>
        title ? `${title} - ${appName}` : appName,

    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;

            case name.startsWith('auth/'):
                return AuthLayout;

            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];

            default:
                return AppLayout;
        }
    },

    strictMode: true,

    withApp(app) {
        return (
            <TooltipProvider>
                <Toaster />
                {app}
            </TooltipProvider>
        );
    },

    progress: {
        color: '#4B5563',
    },
});

initializeTheme();
```

# Vite Configuration

```
import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.tsx'],
            refresh: true,

            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
            ],
        }),

        inertia(),

        react({
            babel: {
                plugins: [
                    'babel-plugin-react-compiler',
                ],
            },
        }),

        tailwindcss(),

        wayfinder({
            formVariants: true,
        }),

        VitePWA({
            registerType: 'autoUpdate',

            injectRegister: 'auto',

            manifest: {
                name: 'SIGAP BANJIR',

                short_name: 'SIGAP',

                description:
                    'Sistem Informasi dan Gotong Royong Antisipasi Banjir',

                theme_color: '#0F766E',

                background_color: '#FFFFFF',

                display: 'standalone',

                start_url: '/',

                scope: '/',

                orientation: 'portrait',

                icons: [
                    {
                        src: '/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },

                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },

                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                ],
            },

            workbox: {
                globPatterns: [
                    '**/*.{js,css,html,ico,png,svg,woff2}',
                ],
            },

            devOptions: {
                enabled: true,
            },
        }),
    ],
});
```

# PWA Infrastructure

```
resources/js/
│
├── components/
│   └── pwa/
│       ├── install-prompt.tsx
│       ├── update-prompt.tsx
│       └── offline-indicator.tsx
│
└── hooks/
    ├── use-pwa.ts
    ├── use-online-status.ts
    └── use-geolocation.ts
```

# Offline Support

```
User
 │
 ▼
Create Flood Report
 │
 ▼
Check Network
 │
 ├─────────────── ONLINE
 │                    │
 │                    ▼
 │               Laravel API
 │
 └─────────────── OFFLINE
                      │
                      ▼
                  IndexedDB
                      │
                      ▼
                Internet kembali
                      │
                      ▼
                Background Sync
                      │
                      ▼
                 Laravel API
```

# GIS & Flood MAP

## Layar Peta

```
                    FLOOD MAP
                        │
          ┌─────────────┼─────────────┐
          │             │             │
          ▼             ▼             ▼
    Flood Reports   Flood Areas   User Location
          │             │             │
          └─────────────┼─────────────┘
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
        Evacuation Post     Health Facility
```

## Legend

🟢 Aman
🟡 Waspada
🟠 Siaga
🔴 Darurat

📍 Laporan Banjir
🚑 Posko
🏥 Fasilitas Kesehatan
🔵 Lokasi Pengguna

# Flood Reporting

## Data Laporan

Lokasi
Latitude
Longitude
Alamat
Foto
Tinggi Genangan
Keterangan
Waktu
Pelapor
Status
Severity

## Alur

User
 │
 ▼
Lapor Banjir
 │
 ▼
Get GPS
 │
 ▼
Take / Upload Photo
 │
 ▼
Input Water Level
 │
 ▼
Input Description
 │
 ▼
Submit
 │
 ▼
Verification
 │
 ├── Rejected
 │
 └── Verified
       │
       ▼
   Published
       │
       ▼
     Map
       │
       ▼
 Notification

# Flood Severity

| Tinggi Air    | Severity   |
| ------------- | ---------- |
| `< 10 cm`     | Safe       |
| `10 - 30 cm`  | Warning    |
| `30 - 50 cm`  | Alert      |
| `50 - 100 cm` | High Alert |
| `> 100 cm`    | Danger     |

## Konsep Pengembangan

Water Level
     +
Report Count
     +
Report Age
     +
Location
     +
Weather Data
     +
Water Sensor
     ↓
Flood Severity Score

# Database Architecture

users
roles
permissions

flood_reports
flood_report_images
flood_report_verifications

flood_areas
flood_levels

notifications
notification_recipients

evacuation_posts
evacuation_post_facilities

emergency_contacts

education_categories
education_contents

device_tokens

activity_logs

## Database Relations

                       USERS
                         │
                         │
                         ▼
                  FLOOD_REPORTS
                    │         │
                    │         │
                    ▼         ▼
          FLOOD_REPORT_IMAGES
                    │
                    │
                    ▼
          FLOOD_REPORT_VERIFICATIONS


                  FLOOD_REPORTS
                         │
                         ▼
                   FLOOD_AREAS


                     USERS
                       │
                       ▼
                 DEVICE_TOKENS


                NOTIFICATIONS
                       │
                       ▼
          NOTIFICATION_RECIPIENTS


             EVACUATION_POSTS
                       │
                       ▼
         EVACUATION_POST_FACILITIES


           EDUCATION_CATEGORIES
                       │
                       ▼
             EDUCATION_CONTENTS

# Database Tables

## users
id
name
email
phone
password
role_id
latitude
longitude
location_updated_at
email_verified_at
created_at
updated_at

## roles
id
name
slug
description
created_at
updated_at

## permissions
id
name
slug
description
created_at
updated_at

## flood_reports
id
user_id
latitude
longitude
address
water_level
severity
description
status
reported_at
verified_at
verified_by
expired_at
created_at
updated_at

## flood_report_images
id
flood_report_id
file_path
file_name
mime_type
file_size
created_at
updated_at

## flood_report_verifications
id
flood_report_id
verified_by
status
notes
verified_at
created_at
updated_at

## flood_areas
id
name
code
geometry
severity
status
description
created_at
updated_at

## flood_levels
id
name
code
geometry
severity
status
description
created_at
updated_at

## notifications
id
type
title
message
data
priority
created_at
updated_at

## notification_recipients
id
notification_id
user_id
read_at
created_at
updated_at

## evacuation_posts
id
name
address
latitude
longitude
capacity
current_occupancy
contact
status
description
created_at
updated_at

## evacuation_post_facilities
id
evacuation_post_id
facility_name
description
created_at
updated_at

## emergency_contacts
id
name
category
phone
description
latitude
longitude
status
created_at
updated_at

## education_categories
id
name
slug
description
created_at
updated_at

## education_contents
id
category_id
title
slug
thumbnail
content
video_url
status
published_at
created_at
updated_at

## device_tokens
id
user_id
token
device_type
browser
last_used_at
created_at
updated_at

## activity_logs
id
user_id
action
module
description
ip_address
user_agent
created_at
updated_at

# User Roles

## Community

view-dashboard
view-flood-map
create-flood-report
upload-flood-image
view-notification
view-education
view-evacuation-post
confirm-flood-report
manage-profile

## Officer

view-dashboard
view-flood-map
create-flood-report
upload-flood-image
view-notification
view-education
view-evacuation-post
confirm-flood-report
manage-profile

## Administrator

view-dashboard
view-flood-map
create-flood-report
upload-flood-image
view-notification
view-education
view-evacuation-post
confirm-flood-report
manage-profile

# Application Modules

SIGAP BANJIR
│
├── Dashboard
├── Authentication
├── Flood Reporting
├── Flood Map
├── Flood Monitoring
├── Early Warning
├── Notification
├── Evacuation
├── Emergency Contact
├── Education
├── User Management
├── Role & Permission
└── System Administration

# API

prefix: /api/v1

## Authentication
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me

## Flood Reports
GET    /api/v1/flood-reports
POST   /api/v1/flood-reports
GET    /api/v1/flood-reports/{id}
POST   /api/v1/flood-reports/{id}/confirm
POST   /api/v1/flood-reports/{id}/cancel

## Flood Map
GET /api/v1/flood-map
GET /api/v1/flood-areas

## Notifications
GET  /api/v1/notifications
GET  /api/v1/notifications/unread-count
POST /api/v1/notifications/{id}/read
POST /api/v1/notifications/read-all

## Evacuation
GET /api/v1/evacuation-posts
GET /api/v1/evacuation-posts/{id}

## Education
GET /api/v1/education
GET /api/v1/education/{id}

# Emergency
GET /api/v1/emergency-contacts