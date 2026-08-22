<?php

namespace App\Http\Controllers;

use App\Models\FloodReport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the authenticated user's dashboard.
     */
    public function index(Request $request): Response
    {
        $userId = $request->user()->id;

        /*
        |--------------------------------------------------------------------------
        | User Report Statistics
        |--------------------------------------------------------------------------
        */

        $totalReports = FloodReport::query()
            ->where('user_id', $userId)
            ->count();

        $submittedReports = FloodReport::query()
            ->where('user_id', $userId)
            ->where('status', 'submitted')
            ->count();

        $verificationReports = FloodReport::query()
            ->where('user_id', $userId)
            ->where('status', 'verification')
            ->count();

        $verifiedReports = FloodReport::query()
            ->where('user_id', $userId)
            ->whereIn('status', [
                'verified',
                'published',
            ])
            ->count();

        $rejectedReports = FloodReport::query()
            ->where('user_id', $userId)
            ->where('status', 'rejected')
            ->count();

        $expiredReports = FloodReport::query()
            ->where('user_id', $userId)
            ->where('status', 'expired')
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Recent Reports
        |--------------------------------------------------------------------------
        */

        $recentReports = FloodReport::query()
            ->where('user_id', $userId)
            ->with('images')
            ->latest('reported_at')
            ->limit(5)
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Latest Report
        |--------------------------------------------------------------------------
        */

        $latestReport = $recentReports->first();

        return Inertia::render('dashboard', [
            'stats' => [
                'total_reports' => $totalReports,
                'submitted_reports' => $submittedReports,
                'verification_reports' => $verificationReports,
                'verified_reports' => $verifiedReports,
                'rejected_reports' => $rejectedReports,
                'expired_reports' => $expiredReports,
            ],

            'recentReports' => $recentReports,

            'latestReport' => $latestReport,
        ]);
    }
}
