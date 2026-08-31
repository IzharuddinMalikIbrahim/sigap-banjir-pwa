<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FloodReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FloodReportController extends Controller
{
    /**
     * Get published flood reports.
     */
    public function index()
    {
        $reports = FloodReport::with('images')
            ->where('status', 'published')
            ->where(function ($query) {
                $query
                    ->whereNull('expired_at')
                    ->orWhere('expired_at', '>', now());
            })
            ->latest('reported_at')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $reports,
        ]);
    }

    /**
     * Store a new flood report.
     *
     * Authentication is optional.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'latitude' => [
                'required',
                'numeric',
                'between:-90,90',
            ],

            'longitude' => [
                'required',
                'numeric',
                'between:-180,180',
            ],

            'address' => [
                'required',
                'string',
                'max:500',
            ],

            'water_level' => [
                'required',
                'numeric',
                'min:0',
                'max:999.99',
            ],

            'description' => [
                'nullable',
                'string',
                'max:5000',
            ],

            'images' => [
                'nullable',
                'array',
                'max:5',
            ],

            'images.*' => [
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:10240',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Calculate Severity
        |--------------------------------------------------------------------------
        |
        | Sesuai dengan ENUM database:
        |
        | safe
        | warning
        | alert
        | high_alert
        | danger
        |
        */

        $severity = $this->calculateSeverity(
            (float) $validated['water_level']
        );

        DB::beginTransaction();

        try {
            /*
            |--------------------------------------------------------------------------
            | Create Flood Report
            |--------------------------------------------------------------------------
            */

            $report = FloodReport::create([
                'user_id' => $request->user()?->id,

                'latitude' => $validated['latitude'],
                'longitude' => $validated['longitude'],

                'address' => $validated['address'],

                'water_level' => $validated['water_level'],

                'severity' => $severity,

                'description' => $validated['description'] ?? null,

                /*
                 * Sesuai dengan ENUM database server.
                 */
                'status' => 'submitted',

                'reported_at' => now(),
            ]);

            /*
            |--------------------------------------------------------------------------
            | Upload Images
            |--------------------------------------------------------------------------
            */

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store(
                        'flood-images',
                        'public'
                    );

                    $report->images()->create([
                        'file_path' => $path,

                        'file_name' =>
                            $image->getClientOriginalName(),

                        'mime_type' =>
                            $image->getClientMimeType(),

                        'file_size' =>
                            $image->getSize(),
                    ]);
                }
            }

            DB::commit();

            /*
            |--------------------------------------------------------------------------
            | Load Images
            |--------------------------------------------------------------------------
            */

            $report->load('images');

            return response()->json([
                'status' => 'success',

                'message' =>
                    'Laporan banjir berhasil dikirim dan menunggu verifikasi.',

                'data' => $report,
            ], 201);

        } catch (\Throwable $e) {
            DB::rollBack();

            report($e);

            return response()->json([
                'status' => 'error',

                'message' =>
                    'Gagal mengirim laporan.',

                'error' => config('app.debug')
                    ? $e->getMessage()
                    : 'Terjadi kesalahan pada server.',
            ], 500);
        }
    }

    /**
     * Calculate flood severity based on water level.
     *
     * Database ENUM:
     *
     * safe
     * warning
     * alert
     * high_alert
     * danger
     */
    private function calculateSeverity(
        float|int $waterLevel
    ): string {
        return match (true) {
            // Siaga 4 - Normal
            $waterLevel < 10 => 'safe',

            // Siaga 3 - Waspada
            $waterLevel <= 30 => 'warning',

            // Siaga 2 - Siaga
            $waterLevel <= 50 => 'alert',

            // Siaga 1 - Awas
            $waterLevel <= 100 => 'high_alert',

            // Darurat
            default => 'danger',
        };
    }
}
