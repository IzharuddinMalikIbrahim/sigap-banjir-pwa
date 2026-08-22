<?php

use App\Http\Controllers\Api\EducationController;
use App\Http\Controllers\Api\EmergencyContactController;
use App\Http\Controllers\Api\EvacuationPostController;
use App\Http\Controllers\Api\FloodAreaController;
use App\Http\Controllers\Api\FloodLevelController;
use App\Http\Controllers\Api\FloodReportController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\DeviceTokenController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| SIGAP BANJIR API
| API Version: v1
|
*/

/*
|--------------------------------------------------------------------------
| API v1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')
    ->middleware([
        'web',
        'throttle:10,1',
    ])
    ->group(function () {

        /*
        |--------------------------------------------------------------------------
        | Flood Reports
        |--------------------------------------------------------------------------
        |
        | Public:
        | - Melihat laporan banjir terverifikasi
        | - Mengirim laporan banjir
        |
        | Authentication bersifat optional.
        |
        */

        Route::get('/flood-reports', [
            FloodReportController::class,
            'index',
        ])->name('api.flood-reports.index');

        Route::post('/flood-reports', [
            FloodReportController::class,
            'store',
        ])->name('api.flood-reports.store');

        Route::get('/flood-reports/{floodReport}', [
            FloodReportController::class,
            'show',
        ])->name('api.flood-reports.show');


        /*
        |--------------------------------------------------------------------------
        | Flood Areas
        |--------------------------------------------------------------------------
        |
        | Area yang sedang atau memiliki potensi banjir.
        |
        */

        Route::get('/flood-areas', [
            FloodAreaController::class,
            'index',
        ])->name('api.flood-areas.index');

        Route::get('/flood-areas/{floodArea}', [
            FloodAreaController::class,
            'show',
        ])->name('api.flood-areas.show');


        /*
        |--------------------------------------------------------------------------
        | Flood Levels
        |--------------------------------------------------------------------------
        |
        | Informasi level/status banjir berdasarkan wilayah.
        |
        */

        Route::get('/flood-levels', [
            FloodLevelController::class,
            'index',
        ])->name('api.flood-levels.index');

        Route::get('/flood-levels/{floodLevel}', [
            FloodLevelController::class,
            'show',
        ])->name('api.flood-levels.show');


        /*
        |--------------------------------------------------------------------------
        | Evacuation Posts
        |--------------------------------------------------------------------------
        |
        | Posko evakuasi yang tersedia untuk masyarakat.
        |
        */

        Route::get('/evacuation-posts', [
            EvacuationPostController::class,
            'index',
        ])->name('api.evacuation-posts.index');

        Route::get('/evacuation-posts/{evacuationPost}', [
            EvacuationPostController::class,
            'show',
        ])->name('api.evacuation-posts.show');


        /*
        |--------------------------------------------------------------------------
        | Emergency Contacts
        |--------------------------------------------------------------------------
        |
        | Nomor/kontak darurat.
        |
        */

        Route::get('/emergency-contacts', [
            EmergencyContactController::class,
            'index',
        ])->name('api.emergency-contacts.index');

        Route::get('/emergency-contacts/{emergencyContact}', [
            EmergencyContactController::class,
            'show',
        ])->name('api.emergency-contacts.show');


        /*
        |--------------------------------------------------------------------------
        | Education
        |--------------------------------------------------------------------------
        |
        | Konten edukasi kebencanaan dan mitigasi banjir.
        |
        */

        Route::get('/education/categories', [
            EducationController::class,
            'categories',
        ])->name('api.education.categories');

        Route::get('/education', [
            EducationController::class,
            'index',
        ])->name('api.education.index');

        Route::get('/education/{educationContent}', [
            EducationController::class,
            'show',
        ])->name('api.education.show');


        /*
        |--------------------------------------------------------------------------
        | Authenticated API
        |--------------------------------------------------------------------------
        |
        | Endpoint di bawah membutuhkan user yang sudah login.
        |
        */

        Route::middleware('auth:sanctum')->group(function () {

            /*
            |--------------------------------------------------------------------------
            | My Flood Reports
            |--------------------------------------------------------------------------
            */

            Route::get('/my/flood-reports', [
                FloodReportController::class,
                'myReports',
            ])->name('api.my.flood-reports');

            /*
            |--------------------------------------------------------------------------
            | Notifications
            |--------------------------------------------------------------------------
            */

            Route::get('/notifications', [
                NotificationController::class,
                'index',
            ])->name('api.notifications.index');

            Route::get('/notifications/unread-count', [
                NotificationController::class,
                'unreadCount',
            ])->name('api.notifications.unread-count');

            Route::post('/notifications/{notification}/read', [
                NotificationController::class,
                'markAsRead',
            ])->name('api.notifications.read');


            /*
            |--------------------------------------------------------------------------
            | Device Tokens
            |--------------------------------------------------------------------------
            |
            | Digunakan untuk push notification PWA.
            |
            */

            Route::post('/device-tokens', [
                DeviceTokenController::class,
                'store',
            ])->name('api.device-tokens.store');

            Route::delete('/device-tokens/{deviceToken}', [
                DeviceTokenController::class,
                'destroy',
            ])->name('api.device-tokens.destroy');
        });
    });