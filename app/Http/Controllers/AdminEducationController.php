<?php

namespace App\Http\Controllers;

use App\Models\EducationCategory;
use App\Models\EducationContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminEducationController extends Controller
{
    /**
     * Display a listing of education contents.
     */
    public function index(Request $request): Response
    {
        $query = EducationContent::query()
            ->with('category')
            ->latest('created_at');

        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        */

        if ($request->filled('search')) {
            $search = $request->string('search');

            $query->where(function ($q) use ($search) {
                $q->where(
                    'title',
                    'like',
                    "%{$search}%"
                )
                ->orWhere(
                    'slug',
                    'like',
                    "%{$search}%"
                )
                ->orWhereHas('category', function ($category) use ($search) {
                    $category->where(
                        'name',
                        'like',
                        "%{$search}%"
                    );
                });
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Category Filter
        |--------------------------------------------------------------------------
        */

        if ($request->filled('category_id')) {
            $query->where(
                'category_id',
                $request->integer('category_id')
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Status Filter
        |--------------------------------------------------------------------------
        */

        if ($request->filled('status')) {
            $query->where(
                'status',
                $request->string('status')
            );
        }

        $contents = $query
            ->paginate(10)
            ->withQueryString();

        /*
        |--------------------------------------------------------------------------
        | Statistics
        |--------------------------------------------------------------------------
        */

        $stats = [
            'total' => EducationContent::count(),

            'draft' => EducationContent::where(
                'status',
                'draft'
            )->count(),

            'published' => EducationContent::where(
                'status',
                'published'
            )->count(),

            'archived' => EducationContent::where(
                'status',
                'archived'
            )->count(),
        ];

        /*
        |--------------------------------------------------------------------------
        | Categories
        |--------------------------------------------------------------------------
        */

        $categories = EducationCategory::query()
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'slug',
            ]);

        return Inertia::render('admin/edukasi-mitigasi/index', [
            'contents' => $contents,
            'categories' => $categories,
            'stats' => $stats,

            'filters' => [
                'search' => $request->input('search'),
                'category_id' => $request->input('category_id'),
                'status' => $request->input('status'),
            ],
        ]);
    }

    /**
     * Show the form for creating a new education content.
     */
    public function create(): Response
    {
        $categories = EducationCategory::query()
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'slug',
            ]);

        return Inertia::render('admin/edukasi-mitigasi/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created education content.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => [
                'required',
                'integer',
                'exists:education_categories,id',
            ],

            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'slug' => [
                'nullable',
                'string',
                'max:255',
                'unique:education_contents,slug',
            ],

            'thumbnail' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],

            'content' => [
                'required',
                'string',
            ],

            'video_url' => [
                'nullable',
                'url',
                'max:500',
            ],

            'status' => [
                'required',
                Rule::in([
                    'draft',
                    'published',
                    'archived',
                ]),
            ],

            'published_at' => [
                'nullable',
                'date',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Slug
        |--------------------------------------------------------------------------
        */

        $slug = $validated['slug']
            ?? Str::slug($validated['title']);

        /*
        |--------------------------------------------------------------------------
        | Published At
        |--------------------------------------------------------------------------
        */

        $publishedAt = $validated['published_at'] ?? null;

        if (
            $validated['status'] === 'published'
            && !$publishedAt
        ) {
            $publishedAt = now();
        }

        /*
        |--------------------------------------------------------------------------
        | Thumbnail
        |--------------------------------------------------------------------------
        */

        $thumbnailPath = null;

        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request
                ->file('thumbnail')
                ->store(
                    'education/thumbnails',
                    'public'
                );
        }

        /*
        |--------------------------------------------------------------------------
        | Create Content
        |--------------------------------------------------------------------------
        */

        EducationContent::create([
            'category_id' => $validated['category_id'],

            'title' => $validated['title'],

            'slug' => $slug,

            'thumbnail' => $thumbnailPath,

            'content' => $validated['content'],

            'video_url' =>
                $validated['video_url'] ?? null,

            'status' => $validated['status'],

            'published_at' => $publishedAt,
        ]);

        return redirect()
            ->route('admin.edukasi-mitigasi')
            ->with(
                'success',
                'Konten edukasi berhasil ditambahkan.'
            );
    }

    /**
     * Display the specified education content.
     */
    public function show(
        EducationContent $educationContent
    ): Response {
        $educationContent->load('category');

        return Inertia::render(
            'admin/edukasi-mitigasi/show',
            [
                'content' => $educationContent,
            ]
        );
    }

    /**
     * Show the form for editing the specified education content.
     */
    public function edit(
        EducationContent $educationContent
    ): Response {
        $categories = EducationCategory::query()
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'slug',
            ]);

        return Inertia::render(
            'admin/edukasi-mitigasi/edit',
            [
                'content' => $educationContent,

                'categories' => $categories,
            ]
        );
    }

    /**
     * Update the specified education content.
     */
    public function update(
        Request $request,
        EducationContent $educationContent
    ): RedirectResponse {
        $validated = $request->validate([
            'category_id' => [
                'required',
                'integer',
                'exists:education_categories,id',
            ],

            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique(
                    'education_contents',
                    'slug'
                )->ignore($educationContent->id),
            ],

            'thumbnail' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],

            'content' => [
                'required',
                'string',
            ],

            'video_url' => [
                'nullable',
                'url',
                'max:500',
            ],

            'status' => [
                'required',
                Rule::in([
                    'draft',
                    'published',
                    'archived',
                ]),
            ],

            'published_at' => [
                'nullable',
                'date',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Slug
        |--------------------------------------------------------------------------
        */

        $slug = $validated['slug']
            ?? Str::slug($validated['title']);

        /*
        |--------------------------------------------------------------------------
        | Published At
        |--------------------------------------------------------------------------
        */

        $publishedAt = $validated['published_at'] ?? null;

        if (
            $validated['status'] === 'published'
            && !$publishedAt
        ) {
            $publishedAt = $educationContent->published_at
                ?? now();
        }

        /*
        |--------------------------------------------------------------------------
        | Thumbnail
        |--------------------------------------------------------------------------
        */

        $thumbnailPath =
            $educationContent->thumbnail;

        if ($request->hasFile('thumbnail')) {
            if ($educationContent->thumbnail) {
                Storage::disk('public')->delete(
                    $educationContent->thumbnail
                );
            }

            $thumbnailPath = $request
                ->file('thumbnail')
                ->store(
                    'education/thumbnails',
                    'public'
                );
        }

        /*
        |--------------------------------------------------------------------------
        | Update Content
        |--------------------------------------------------------------------------
        */

        $educationContent->update([
            'category_id' => $validated['category_id'],

            'title' => $validated['title'],

            'slug' => $slug,

            'thumbnail' => $thumbnailPath,

            'content' => $validated['content'],

            'video_url' =>
                $validated['video_url'] ?? null,

            'status' => $validated['status'],

            'published_at' => $publishedAt,
        ]);

        return redirect()
            ->route('admin.edukasi-mitigasi')
            ->with(
                'success',
                'Konten edukasi berhasil diperbarui.'
            );
    }

    /**
     * Remove the specified education content.
     */
    public function destroy(
        EducationContent $educationContent
    ): RedirectResponse {
        /*
        |--------------------------------------------------------------------------
        | Delete Thumbnail
        |--------------------------------------------------------------------------
        */

        if ($educationContent->thumbnail) {
            Storage::disk('public')->delete(
                $educationContent->thumbnail
            );
        }

        $educationContent->delete();

        return redirect()
            ->route('admin.edukasi-mitigasi')
            ->with(
                'success',
                'Konten edukasi berhasil dihapus.'
            );
    }
}
