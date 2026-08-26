<?php

namespace App\Http\Controllers;

use App\Models\VideoEducation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminVideoEducationController extends Controller
{
    /**
     * Display video education list.
     */
    public function index(Request $request): Response
    {
        $query = VideoEducation::query()
            ->latest('created_at');

        if ($request->filled('search')) {
            $search = $request->string('search');

            $query->where(function ($q) use ($search) {
                $q->where(
                    'title',
                    'like',
                    "%{$search}%"
                )
                ->orWhere(
                    'description',
                    'like',
                    "%{$search}%"
                );
            });
        }

        if ($request->filled('category')) {
            $query->where(
                'category',
                $request->string('category')
            );
        }

        if ($request->filled('status')) {
            $query->where(
                'status',
                $request->string('status')
            );
        }

        $videos = $query
            ->paginate(12)
            ->withQueryString();

        $stats = [
            'total' => VideoEducation::count(),

            'draft' => VideoEducation::where(
                'status',
                'draft'
            )->count(),

            'published' => VideoEducation::where(
                'status',
                'published'
            )->count(),

            'archived' => VideoEducation::where(
                'status',
                'archived'
            )->count(),
        ];

        $categories = VideoEducation::query()
            ->whereNotNull('category')
            ->distinct()
            ->orderBy('category')
            ->pluck('category');

        return Inertia::render(
            'admin/video-edukasi/index',
            [
                'videos' => $videos,

                'stats' => $stats,

                'categories' => $categories,

                'filters' => [
                    'search' => $request->input('search'),
                    'category' => $request->input('category'),
                    'status' => $request->input('status'),
                ],
            ]
        );
    }

    /**
     * Show create form.
     */
    public function create(): Response
    {
        return Inertia::render(
            'admin/video-edukasi/create'
        );
    }

    /**
     * Store a new video.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'slug' => [
                'nullable',
                'string',
                'max:255',
                'unique:video_educations,slug',
            ],

            'thumbnail' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],

            'video' => [
                'required',
                'file',
                'mimes:mp4,webm,mov,avi',
                'max:102400',
            ],

            'description' => [
                'nullable',
                'string',
                'max:5000',
            ],

            'category' => [
                'nullable',
                'string',
                'max:100',
            ],

            'duration' => [
                'nullable',
                'integer',
                'min:0',
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

        $slug = $validated['slug']
            ?? Str::slug($validated['title']);

        $videoPath = $request
            ->file('video')
            ->store(
                'video-educations',
                'public'
            );

        $thumbnailPath = null;

        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request
                ->file('thumbnail')
                ->store(
                    'video-educations/thumbnails',
                    'public'
                );
        }

        $publishedAt =
            $validated['published_at'] ?? null;

        if (
            $validated['status'] === 'published'
            && !$publishedAt
        ) {
            $publishedAt = now();
        }

        VideoEducation::create([
            'title' => $validated['title'],

            'slug' => $slug,

            'thumbnail' => $thumbnailPath,

            'video_path' => $videoPath,

            'description' =>
                $validated['description'] ?? null,

            'category' =>
                $validated['category'] ?? null,

            'duration' =>
                $validated['duration'] ?? null,

            'status' => $validated['status'],

            'published_at' => $publishedAt,
        ]);

        return redirect()
            ->route('admin.video-edukasi')
            ->with(
                'success',
                'Video edukasi berhasil diupload.'
            );
    }

    /**
     * Display video detail.
     */
    public function show(
        VideoEducation $videoEducation
    ): Response {
        return Inertia::render(
            'admin/video-edukasi/show',
            [
                'video' => $videoEducation,
            ]
        );
    }

    /**
     * Show edit form.
     */
    public function edit(
        VideoEducation $videoEducation
    ): Response {
        return Inertia::render(
            'admin/video-edukasi/edit',
            [
                'video' => $videoEducation,
            ]
        );
    }

    /**
     * Update video.
     */
    public function update(
        Request $request,
        VideoEducation $videoEducation
    ): RedirectResponse {
        $validated = $request->validate([
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
                    'video_educations',
                    'slug'
                )->ignore($videoEducation->id),
            ],

            'thumbnail' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],

            'video' => [
                'nullable',
                'file',
                'mimes:mp4,webm,mov,avi',
                'max:102400',
            ],

            'description' => [
                'nullable',
                'string',
                'max:5000',
            ],

            'category' => [
                'nullable',
                'string',
                'max:100',
            ],

            'duration' => [
                'nullable',
                'integer',
                'min:0',
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

        $slug = $validated['slug']
            ?? Str::slug($validated['title']);

        /*
        |--------------------------------------------------------------------------
        | Thumbnail
        |--------------------------------------------------------------------------
        */

        $thumbnailPath =
            $videoEducation->thumbnail;

        if ($request->hasFile('thumbnail')) {
            if ($thumbnailPath) {
                Storage::disk('public')->delete(
                    $thumbnailPath
                );
            }

            $thumbnailPath = $request
                ->file('thumbnail')
                ->store(
                    'video-educations/thumbnails',
                    'public'
                );
        }

        /*
        |--------------------------------------------------------------------------
        | Video
        |--------------------------------------------------------------------------
        */

        $videoPath =
            $videoEducation->video_path;

        if ($request->hasFile('video')) {
            if ($videoPath) {
                Storage::disk('public')->delete(
                    $videoPath
                );
            }

            $videoPath = $request
                ->file('video')
                ->store(
                    'video-educations',
                    'public'
                );
        }

        $publishedAt =
            $validated['published_at'] ?? null;

        if (
            $validated['status'] === 'published'
            && !$publishedAt
        ) {
            $publishedAt =
                $videoEducation->published_at
                ?? now();
        }

        $videoEducation->update([
            'title' => $validated['title'],

            'slug' => $slug,

            'thumbnail' => $thumbnailPath,

            'video_path' => $videoPath,

            'description' =>
                $validated['description'] ?? null,

            'category' =>
                $validated['category'] ?? null,

            'duration' =>
                $validated['duration'] ?? null,

            'status' => $validated['status'],

            'published_at' => $publishedAt,
        ]);

        return redirect()
            ->route('admin.video-edukasi')
            ->with(
                'success',
                'Video edukasi berhasil diperbarui.'
            );
    }

    /**
     * Delete video.
     */
    public function destroy(
        VideoEducation $videoEducation
    ): RedirectResponse {
        if ($videoEducation->video_path) {
            Storage::disk('public')->delete(
                $videoEducation->video_path
            );
        }

        if ($videoEducation->thumbnail) {
            Storage::disk('public')->delete(
                $videoEducation->thumbnail
            );
        }

        $videoEducation->delete();

        return redirect()
            ->route('admin.video-edukasi')
            ->with(
                'success',
                'Video edukasi berhasil dihapus.'
            );
    }
}
