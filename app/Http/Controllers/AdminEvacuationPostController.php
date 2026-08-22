<?php

namespace App\Http\Controllers;

use App\Models\EvacuationPost;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminEvacuationPostController extends Controller
{
    public function index(Request $request): Response
    {
        $query = EvacuationPost::query()
            ->with('facilities')
            ->latest('created_at');

        if ($request->filled('search')) {
            $search = $request->string('search');

            $query->where(function ($q) use ($search) {
                $q->where(
                    'name',
                    'like',
                    "%{$search}%"
                )->orWhere(
                    'address',
                    'like',
                    "%{$search}%"
                );
            });
        }

        if ($request->filled('status')) {
            $query->where(
                'status',
                $request->string('status')
            );
        }

        $posts = $query
            ->paginate(12)
            ->withQueryString();

        $stats = [
            'total' => EvacuationPost::count(),

            'active' => EvacuationPost::where(
                'status',
                'active'
            )->count(),

            'inactive' => EvacuationPost::where(
                'status',
                'inactive'
            )->count(),

            'full' => EvacuationPost::where(
                'status',
                'full'
            )->count(),

            'total_capacity' => EvacuationPost::sum(
                'capacity'
            ),

            'total_occupancy' => EvacuationPost::sum(
                'current_occupancy'
            ),
        ];

        return Inertia::render('admin/posko', [
            'posts' => $posts,

            'stats' => $stats,

            'filters' => [
                'search' => $request->input('search'),
                'status' => $request->input('status'),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/posko/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'address' => [
                'required',
                'string',
                'max:500',
            ],

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

            'capacity' => [
                'required',
                'integer',
                'min:1',
            ],

            'current_occupancy' => [
                'nullable',
                'integer',
                'min:0',
                'lte:capacity',
            ],

            'contact' => [
                'nullable',
                'string',
                'max:100',
            ],

            'status' => [
                'required',
                'in:active,inactive,full',
            ],

            'description' => [
                'nullable',
                'string',
                'max:5000',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Current Occupancy
        |--------------------------------------------------------------------------
        */

        $currentOccupancy =
            $validated['current_occupancy'] ?? 0;

        /*
        |--------------------------------------------------------------------------
        | Otomatis ubah status menjadi full
        |--------------------------------------------------------------------------
        |
        | Jika jumlah penghuni sudah sama dengan kapasitas,
        | status otomatis menjadi full.
        |
        */

        if (
            $currentOccupancy >= $validated['capacity']
        ) {
            $validated['status'] = 'full';
        }

        /*
        |--------------------------------------------------------------------------
        | Create Evacuation Post
        |--------------------------------------------------------------------------
        */

        $evacuationPost = EvacuationPost::create([
            'name' => $validated['name'],

            'address' => $validated['address'],

            'latitude' => $validated['latitude'],

            'longitude' => $validated['longitude'],

            'capacity' => $validated['capacity'],

            'current_occupancy' => $currentOccupancy,

            'contact' => $validated['contact'] ?? null,

            'status' => $validated['status'],

            'description' =>
                $validated['description'] ?? null,
        ]);

        return redirect()
            ->route('admin.posko')
            ->with(
                'success',
                'Posko evakuasi berhasil ditambahkan.'
            );
    }

    public function destroy(
        EvacuationPost $evacuationPost
    ) {
        $evacuationPost->delete();

        return back()->with(
            'success',
            'Posko berhasil dihapus.'
        );
    }
}
