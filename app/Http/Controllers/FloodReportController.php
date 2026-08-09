<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FloodReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FloodReportController extends Controller
{
    public function index()
    {
        $reports = FloodReport::with('images')
            ->where('status', 'verified')
            ->where('expired_at', '>', now())
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $reports
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'address' => 'required|string',
            'water_level' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'images.*' => 'image|max:2048' // Max 2MB per image
        ]);

        // Menentukan tingkat keparahan (Severity)
        $severity = $this->calculateSeverity($validated['water_level']);

        DB::beginTransaction();
        try {
            $report = FloodReport::create([
                'user_id' => $request->user()->id,
                'latitude' => $validated['latitude'],
                'longitude' => $validated['longitude'],
                'address' => $validated['address'],
                'water_level' => $validated['water_level'],
                'severity' => $severity,
                'description' => $validated['description'],
                'status' => 'pending',
                'reported_at' => now(),
            ]);

            // Handle Image Uploads jika ada
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('flood-images', 'public');
                    $report->images()->create([
                        'file_path' => $path,
                        'file_name' => $image->getClientOriginalName(),
                        'mime_type' => $image->getClientMimeType(),
                        'file_size' => $image->getSize(),
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Laporan banjir berhasil dikirim dan menunggu verifikasi.',
                'data' => $report
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengirim laporan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function calculateSeverity($waterLevel)
    {
        if ($waterLevel < 10) return 'Safe';
        if ($waterLevel <= 30) return 'Warning';
        if ($waterLevel <= 50) return 'Alert';
        if ($waterLevel <= 100) return 'High Alert';
        return 'Danger';
    }
}