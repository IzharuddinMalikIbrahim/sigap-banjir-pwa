<?php

namespace App\Http\Controllers;

use App\Models\EvacuationPost;
use App\Models\FloodReport;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    /**
     * Display admin dashboard.
     */
    public function index(): Response
    {
        /*
        |--------------------------------------------------------------------------
        | Flood Report Statistics
        |--------------------------------------------------------------------------
        */

        $totalReports = FloodReport::count();

        $submittedReports = FloodReport::where(
            'status',
            'submitted'
        )->count();

        $verificationReports = FloodReport::where(
            'status',
            'verification'
        )->count();

        $verifiedReports = FloodReport::where(
            'status',
            'verified'
        )->count();

        $publishedReports = FloodReport::where(
            'status',
            'published'
        )->count();

        $rejectedReports = FloodReport::where(
            'status',
            'rejected'
        )->count();

        $expiredReports = FloodReport::where(
            'status',
            'expired'
        )->count();

        /*
        |--------------------------------------------------------------------------
        | Highest Water Level
        |--------------------------------------------------------------------------
        |
        | Mengambil ketinggian genangan tertinggi dari laporan
        | yang masih aktif dan dipublikasikan.
        |
        */

        $highestWaterLevel = FloodReport::query()
            ->where('status', 'published')
            ->where(function ($query) {
                $query
                    ->whereNull('expired_at')
                    ->orWhere('expired_at', '>', now());
            })
            ->max('water_level') ?? 0;

        /*
        |--------------------------------------------------------------------------
        | User Statistics
        |--------------------------------------------------------------------------
        */

        $totalUsers = User::count();

        /*
        |--------------------------------------------------------------------------
        | Evacuation Post Statistics
        |--------------------------------------------------------------------------
        */

        $totalEvacuationPosts = EvacuationPost::count();

        $activeEvacuationPosts = EvacuationPost::where(
            'status',
            'active'
        )->count();

        /*
        |--------------------------------------------------------------------------
        | Admin Unread Notifications
        |--------------------------------------------------------------------------
        */

        $unreadNotifications = Notification::query()
            ->whereHas('recipients', function ($query) {
                $query
                    ->where('user_id', auth()->id())
                    ->whereNull('read_at');
            })
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Recent Reports
        |--------------------------------------------------------------------------
        */

        $recentReports = FloodReport::query()
            ->with([
                'user:id,name',
            ])
            ->latest('reported_at')
            ->limit(8)
            ->get([
                'id',
                'user_id',
                'address',
                'water_level',
                'severity',
                'status',
                'reported_at',
            ]);

        /*
        |--------------------------------------------------------------------------
        | Severity Statistics
        |--------------------------------------------------------------------------
        */

        $severityStatistics = FloodReport::query()
            ->where('status', 'published')
            ->select(
                'severity',
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('severity')
            ->pluck('total', 'severity');

        return Inertia::render('admin/home', [
            'stats' => [
                'total_reports' => $totalReports,

                'submitted_reports' => $submittedReports,

                'verification_reports' => $verificationReports,

                'verified_reports' => $verifiedReports,

                'published_reports' => $publishedReports,

                'rejected_reports' => $rejectedReports,

                'expired_reports' => $expiredReports,

                'total_users' => $totalUsers,

                'total_evacuation_posts' => $totalEvacuationPosts,

                'active_evacuation_posts' => $activeEvacuationPosts,

                'unread_notifications' => $unreadNotifications,

                'highest_water_level' => $highestWaterLevel,
            ],

            'recentReports' => $recentReports,

            'severityStatistics' => [
                'safe' => (int) ($severityStatistics['safe'] ?? 0),

                'warning' => (int) ($severityStatistics['warning'] ?? 0),

                'alert' => (int) ($severityStatistics['alert'] ?? 0),

                'high_alert' => (int) ($severityStatistics['high_alert'] ?? 0),

                'danger' => (int) ($severityStatistics['danger'] ?? 0),
            ],
        ]);
    }
}
