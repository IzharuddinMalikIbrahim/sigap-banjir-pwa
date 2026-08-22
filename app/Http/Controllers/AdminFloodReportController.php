<?php

namespace App\Http\Controllers;

use App\Models\FloodReport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminFloodReportController extends Controller
{
    public function index(Request $request): Response
    {
        $query = FloodReport::query()
            ->with([
                'user:id,name,email',
            ])
            ->latest('reported_at');

        if ($request->filled('search')) {
            $search = $request->string('search');

            $query->where(function ($q) use ($search) {
                $q->where('address', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere(
                                'email',
                                'like',
                                "%{$search}%"
                            );
                    });
            });
        }

        if ($request->filled('status')) {
            $query->where(
                'status',
                $request->string('status')
            );
        }

        if ($request->filled('severity')) {
            $query->where(
                'severity',
                $request->string('severity')
            );
        }

        $reports = $query
            ->paginate(15)
            ->withQueryString();

        $stats = [
            'total' => FloodReport::count(),

            'submitted' => FloodReport::where(
                'status',
                'submitted'
            )->count(),

            'verification' => FloodReport::where(
                'status',
                'verification'
            )->count(),

            'verified' => FloodReport::where(
                'status',
                'verified'
            )->count(),

            'published' => FloodReport::where(
                'status',
                'published'
            )->count(),

            'rejected' => FloodReport::where(
                'status',
                'rejected'
            )->count(),

            'expired' => FloodReport::where(
                'status',
                'expired'
            )->count(),
        ];

        return Inertia::render('admin/floodreport', [
            'reports' => $reports,

            'stats' => $stats,

            'filters' => [
                'search' => $request->input('search'),
                'status' => $request->input('status'),
                'severity' => $request->input('severity'),
            ],
        ]);
    }

    public function updateStatus(
        Request $request,
        FloodReport $floodReport
    ): RedirectResponse {
        $validated = $request->validate([
            'status' => [
                'required',
                'in:submitted,verification,verified,published,rejected,expired',
            ],
        ]);

        $status = $validated['status'];

        $data = [
            'status' => $status,
        ];

        if (
            in_array(
                $status,
                ['verified', 'published']
            )
        ) {
            $data['verified_at'] ??= now();
            $data['verified_by'] ??= auth()->id();
        }

        $floodReport->update($data);

        return back()->with(
            'success',
            'Status laporan berhasil diperbarui.'
        );
    }
}
