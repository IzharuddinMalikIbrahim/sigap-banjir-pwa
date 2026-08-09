<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // Dashboard
            [
                'name' => 'View Dashboard',
                'slug' => 'view-dashboard',
                'description' => 'Melihat dashboard aplikasi.',
            ],

            // Flood Report
            [
                'name' => 'View Flood Reports',
                'slug' => 'view-flood-report',
                'description' => 'Melihat laporan banjir.',
            ],
            [
                'name' => 'Create Flood Report',
                'slug' => 'create-flood-report',
                'description' => 'Membuat laporan banjir.',
            ],
            [
                'name' => 'Update Flood Report',
                'slug' => 'update-flood-report',
                'description' => 'Memperbarui laporan banjir.',
            ],
            [
                'name' => 'Delete Flood Report',
                'slug' => 'delete-flood-report',
                'description' => 'Menghapus laporan banjir.',
            ],
            [
                'name' => 'Verify Flood Report',
                'slug' => 'verify-flood-report',
                'description' => 'Memverifikasi laporan banjir.',
            ],
            [
                'name' => 'Update Flood Status',
                'slug' => 'update-flood-status',
                'description' => 'Mengubah status laporan banjir.',
            ],
            [
                'name' => 'Upload Flood Image',
                'slug' => 'upload-flood-image',
                'description' => 'Mengunggah foto laporan banjir.',
            ],

            // Map
            [
                'name' => 'View Flood Map',
                'slug' => 'view-flood-map',
                'description' => 'Melihat peta banjir.',
            ],
            [
                'name' => 'Manage Flood Area',
                'slug' => 'manage-flood-area',
                'description' => 'Mengelola area banjir.',
            ],

            // Notification
            [
                'name' => 'View Notification',
                'slug' => 'view-notification',
                'description' => 'Melihat notifikasi.',
            ],
            [
                'name' => 'Manage Notification',
                'slug' => 'manage-notification',
                'description' => 'Mengelola notifikasi.',
            ],

            // Evacuation
            [
                'name' => 'View Evacuation Post',
                'slug' => 'view-evacuation-post',
                'description' => 'Melihat lokasi posko evakuasi.',
            ],
            [
                'name' => 'Manage Evacuation Post',
                'slug' => 'manage-evacuation-post',
                'description' => 'Mengelola posko evakuasi.',
            ],

            // Education
            [
                'name' => 'View Education',
                'slug' => 'view-education',
                'description' => 'Melihat konten edukasi.',
            ],
            [
                'name' => 'Manage Education',
                'slug' => 'manage-education',
                'description' => 'Mengelola konten edukasi.',
            ],

            // Emergency
            [
                'name' => 'View Emergency Contact',
                'slug' => 'view-emergency-contact',
                'description' => 'Melihat kontak darurat.',
            ],
            [
                'name' => 'Manage Emergency Contact',
                'slug' => 'manage-emergency-contact',
                'description' => 'Mengelola kontak darurat.',
            ],

            // Users
            [
                'name' => 'View Users',
                'slug' => 'view-users',
                'description' => 'Melihat data pengguna.',
            ],
            [
                'name' => 'Manage Users',
                'slug' => 'manage-users',
                'description' => 'Mengelola pengguna.',
            ],

            // Roles
            [
                'name' => 'View Roles',
                'slug' => 'view-roles',
                'description' => 'Melihat role.',
            ],
            [
                'name' => 'Manage Roles',
                'slug' => 'manage-roles',
                'description' => 'Mengelola role.',
            ],

            // Permissions
            [
                'name' => 'View Permissions',
                'slug' => 'view-permissions',
                'description' => 'Melihat permission.',
            ],
            [
                'name' => 'Manage Permissions',
                'slug' => 'manage-permissions',
                'description' => 'Mengelola permission.',
            ],

            // Statistics
            [
                'name' => 'View Statistics',
                'slug' => 'view-statistics',
                'description' => 'Melihat statistik aplikasi.',
            ],

            // Activity Log
            [
                'name' => 'View Activity Log',
                'slug' => 'view-activity-log',
                'description' => 'Melihat aktivitas pengguna.',
            ],

            // System
            [
                'name' => 'Manage System Settings',
                'slug' => 'manage-system-settings',
                'description' => 'Mengelola konfigurasi sistem.',
            ],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                [
                    'slug' => $permission['slug'],
                ],
                $permission
            );
        }
    }
}
