<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(): Response
    {
        $notifications = Notification::query()
            ->whereHas('recipients', function ($query) {
                $query->where('user_id', auth()->id());
            })
            ->with([
                'recipients' => function ($query) {
                    $query->where(
                        'user_id',
                        auth()->id()
                    );
                },
            ])
            ->latest('created_at')
            ->paginate(10)
            ->withQueryString();

        $notifications->through(function ($notification) {
            $recipient = $notification->recipients->first();

            return [
                'id' => $notification->id,
                'type' => $notification->type,
                'title' => $notification->title,
                'message' => $notification->message,
                'data' => $notification->data,
                'priority' => $notification->priority,
                'created_at' => $notification->created_at,
                'read_at' => $recipient?->read_at,
            ];
        });

        $unreadCount = Notification::query()
            ->whereHas('recipients', function ($query) {
                $query
                    ->where('user_id', auth()->id())
                    ->whereNull('read_at');
            })
            ->count();

        return Inertia::render('notifications', [
            'notifications' => $notifications,
            'unreadCount' => $unreadCount,
        ]);
    }

    public function markAsRead(
        Notification $notification
    ): RedirectResponse {
        $notification
            ->recipients()
            ->where('user_id', auth()->id())
            ->update([
                'read_at' => now(),
            ]);

        return back();
    }

    public function markAllAsRead(): RedirectResponse
    {
        $notificationIds = Notification::query()
            ->whereHas('recipients', function ($query) {
                $query->where(
                    'user_id',
                    auth()->id()
                );
            })
            ->pluck('id');

        if ($notificationIds->isNotEmpty()) {
            \App\Models\NotificationRecipient::query()
                ->where('user_id', auth()->id())
                ->whereIn(
                    'notification_id',
                    $notificationIds
                )
                ->whereNull('read_at')
                ->update([
                    'read_at' => now(),
                ]);
        }

        return back();
    }
}
