<?php

namespace Database\Seeders;

use App\Models\EducationCategory;
use Illuminate\Database\Seeder;

class EducationCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Kesiapsiagaan Banjir',
                'slug' => 'kesiapsiagaan-banjir',
                'description' => 'Panduan persiapan masyarakat sebelum dan saat terjadi banjir.',
            ],
            [
                'name' => 'Mitigasi Bencana',
                'slug' => 'mitigasi-bencana',
                'description' => 'Informasi mengenai upaya mengurangi risiko dan dampak banjir.',
            ],
            [
                'name' => 'Evakuasi',
                'slug' => 'evakuasi',
                'description' => 'Panduan proses evakuasi yang aman saat terjadi banjir.',
            ],
            [
                'name' => 'Keselamatan',
                'slug' => 'keselamatan',
                'description' => 'Informasi keselamatan bagi masyarakat saat menghadapi kondisi banjir.',
            ],
            [
                'name' => 'Kesehatan',
                'slug' => 'kesehatan',
                'description' => 'Panduan menjaga kesehatan sebelum, saat, dan setelah banjir.',
            ],
            [
                'name' => 'Perlengkapan Darurat',
                'slug' => 'perlengkapan-darurat',
                'description' => 'Informasi mengenai perlengkapan yang perlu disiapkan untuk menghadapi banjir.',
            ],
            [
                'name' => 'Pasca Banjir',
                'slug' => 'pasca-banjir',
                'description' => 'Panduan penanganan dan pemulihan setelah banjir.',
            ],
        ];

        foreach ($categories as $category) {
            EducationCategory::updateOrCreate(
                [
                    'slug' => $category['slug'],
                ],
                $category
            );
        }
    }
}
