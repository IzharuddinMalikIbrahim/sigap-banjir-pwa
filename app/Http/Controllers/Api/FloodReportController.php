<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FloodReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FloodReportController extends Controller
{
    /**
     * Get verified flood reports.
     */
    public function index()
    {
        $reports = FloodReport::with('images')
            ->where('status', 'verified')
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
                'max:2048',
            ],
        ]);

        $severity = $this->calculateSeverity(
            $validated['water_level']
        );

        DB::beginTransaction();

        try {
            $report = FloodReport::create([
                'user_id' => $request->user()?->id,

                'latitude' => $validated['latitude'],
                'longitude' => $validated['longitude'],

                'address' => $validated['address'],

                'water_level' => $validated['water_level'],

                'severity' => $severity,

                'description' =>
                    $validated['description'] ?? null,

                'status' => 'pending',

                'reported_at' => now(),
            ]);

            /*
             * Handle image uploads.
             */
            if ($request->hasFile('images')) {
                foreach (
                    $request->file('images')
                    as $image
                ) {
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
             * Load images after transaction.
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

            return response()->json([
                'status' => 'error',

                'message' =>
                    'Gagal mengirim laporan.',

                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Calculate flood severity based on water level.
     */
    private function calculateSeverity(
        float|int $waterLevel
    ): string {
        if ($waterLevel < 10) {
            return 'Safe';
        }

        if ($waterLevel <= 30) {
            return 'Warning';
        }

        if ($waterLevel <= 50) {
            return 'Alert';
        }

        if ($waterLevel <= 100) {
            return 'High Alert';
        }

        return 'Danger';
    }
}
