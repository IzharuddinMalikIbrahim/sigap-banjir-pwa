<?php

namespace Database\Seeders;

use App\Models\EmergencyContact;
use Illuminate\Database\Seeder;

class EmergencyContactSeeder extends Seeder
{
    public function run(): void
    {
        $contacts = [
            [
                'name' => 'Layanan Darurat',
                'category' => 'government',
                'phone' => '112',
                'description' => 'Nomor panggilan darurat.',
                'latitude' => null,
                'longitude' => null,
                'status' => 'active',
            ],
            [
                'name' => 'Ambulans',
                'category' => 'ambulance',
                'phone' => '119',
                'description' => 'Layanan kegawatdaruratan medis.',
                'latitude' => null,
                'longitude' => null,
                'status' => 'active',
            ],
        ];

        foreach ($contacts as $contact) {
            EmergencyContact::updateOrCreate(
                [
                    'category' => $contact['category'],
                    'phone' => $contact['phone'],
                ],
                $contact
            );
        }
    }
}
