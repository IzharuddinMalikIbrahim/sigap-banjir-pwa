<?php

namespace App\Http\Controllers;

use App\Models\FloodReport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FloodReportController extends Controller
{
    /**
     * Public flood monitoring page.
     */
    public function index(): Response
    {
        $reports = FloodReport::query()
            ->with('images')
            ->where('status', 'verified')
            ->where(function ($query) {
                $query
                    ->whereNull('expired_at')
                    ->orWhere(
                        'expired_at',
                        '>',
                        now()
                    );
            })
            ->latest('reported_at')
            ->get();

        return Inertia::render('home', [
            'reports' => $reports,
        ]);
    }

    /**
     * Show authenticated user's reports.
     */
    public function myReports(): Response
    {
        $reports = FloodReport::query()
            ->with('images')
            ->where('user_id', auth()->id())
            ->latest('reported_at')
            ->paginate(10);

        return Inertia::render('flood-reports/my-reports', [
            'reports' => $reports,
        ]);
    }
}
