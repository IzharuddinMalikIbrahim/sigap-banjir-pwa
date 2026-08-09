<?php

namespace Database\Seeders;

use App\Models\Roles;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Administrator',
                'slug' => 'admin',
                'description' => 'Administrator yang memiliki akses penuh terhadap sistem SIGAP BANJIR.',
            ],
            [
                'name' => 'Petugas',
                'slug' => 'officer',
                'description' => 'Petugas yang melakukan verifikasi dan pengelolaan informasi kejadian banjir.',
            ],
            [
                'name' => 'Masyarakat',
                'slug' => 'community',
                'description' => 'Masyarakat yang menggunakan SIGAP BANJIR untuk memperoleh informasi dan melaporkan kejadian banjir.',
            ],
        ];

        foreach ($roles as $role) {
            Roles::updateOrCreate(
                ['slug' => $role['slug']],
                $role
            );
        }
    }
}
