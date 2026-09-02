<?php

namespace App\Console\Commands;

use App\Models\FloodReport;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class FixFloodReportAddresses extends Command
{
    protected $signature = 'flood-reports:fix-addresses
                            {--update : Simpan hasil reverse geocoding ke database}';

    protected $description = 'Memperbaiki address flood reports yang masih berupa koordinat';

    public function handle(): int
    {
        $reports = FloodReport::query()
            ->where('address', 'like', 'Koordinat:%')
            ->orderBy('id')
            ->get();

        if ($reports->isEmpty()) {
            $this->info('Tidak ada flood report yang perlu diperbaiki.');
            return self::SUCCESS;
        }

        $this->info("Ditemukan {$reports->count()} data yang perlu diperbaiki.");
        $this->newLine();

        foreach ($reports as $report) {
            $lat = (float) $report->latitude;
            $lng = (float) $report->longitude;

            $this->line("ID {$report->id}");
            $this->line("Koordinat : {$lat}, {$lng}");

            try {
                $response = Http::timeout(15)
                    ->withHeaders([
                        'User-Agent' => 'SIGAP-BANJIR/1.0',
                    ])
                    ->get('https://nominatim.openstreetmap.org/reverse', [
                        'lat' => $lat,
                        'lon' => $lng,
                        'format' => 'json',
                        'addressdetails' => 1,
                        'zoom' => 18,
                    ]);

                if (! $response->successful()) {
                    $this->error(
                        "Gagal reverse geocoding ID {$report->id}. HTTP {$response->status()}"
                    );

                    sleep(1);
                    continue;
                }

                $data = $response->json();

                $address = $data['display_name'] ?? null;

                if (! $address) {
                    $this->warn("Alamat tidak ditemukan untuk ID {$report->id}");

                    sleep(1);
                    continue;
                }

                $this->info("Alamat     : {$address}");

                if ($this->option('update')) {
                    $report->update([
                        'address' => $address,
                    ]);

                    $this->info('✓ Database diperbarui.');
                } else {
                    $this->comment('Preview saja, database belum diubah.');
                }

                $this->newLine();

                // Batasi request agar tidak membombardir service geocoding.
                sleep(1);
            } catch (\Throwable $e) {
                $this->error(
                    "Error ID {$report->id}: {$e->getMessage()}"
                );

                sleep(1);
            }
        }

        $this->newLine();

        if ($this->option('update')) {
            $this->info('Proses selesai. Address telah diperbarui.');
        } else {
            $this->warn(
                'Mode preview. Jalankan dengan --update untuk menyimpan hasil ke database.'
            );
        }

        return self::SUCCESS;
    }
}
