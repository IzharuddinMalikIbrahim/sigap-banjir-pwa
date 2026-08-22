<?php

use App\Http\Controllers\FloodReportController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminFloodReportController;
use App\Http\Controllers\AdminEvacuationPostController;

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

Route::get('/', [
    FloodReportController::class,
    'index',
])->name('home');

/*
|--------------------------------------------------------------------------
| Community
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [
        DashboardController::class,
        'index',
    ])->name('dashboard');

    Route::get('/my-reports', [
        FloodReportController::class,
        'myReports',
    ])->name('flood-reports.mine');

    Route::get('/flood-reports/{floodReport}', [
        FloodReportController::class,
        'show',
    ])->name('flood-reports.show');

    Route::get('/flood-reports/{floodReport}', [
        FloodReportController::class,
        'show',
    ])->name('flood-reports.show');

    Route::get('/notifications', [
        NotificationController::class,
        'index',
    ])->name('notifications.index');

    Route::post('/notifications/{notification}/read', [
        NotificationController::class,
        'markAsRead',
    ])->name('notifications.read');

    Route::post('/notifications/read-all', [
        NotificationController::class,
        'markAllAsRead',
    ])->name('notifications.read-all');
});

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

Route::middleware([
    'auth',
    'verified',
    'role:admin',
])->prefix('admin')->group(function () {
    Route::get('/home', [
        AdminDashboardController::class,
        'index',
    ])->name('admin.home');

    Route::get('/floodreport', [
        AdminFloodReportController::class,
        'index',
    ])->name('admin.floodreport');

    Route::patch('/floodreport/{floodReport}/status', [
        AdminFloodReportController::class,
        'updateStatus',
    ])->name('admin.floodreport.status');

    /*
    |--------------------------------------------------------------------------
    | Posko Evakuasi
    |--------------------------------------------------------------------------
    */

    Route::get('/posko', [
        AdminEvacuationPostController::class,
        'index',
    ])->name('admin.posko');

    Route::get('/posko/create', [
        AdminEvacuationPostController::class,
        'create',
    ])->name('admin.posko.create');

    Route::post('/posko', [
        AdminEvacuationPostController::class,
        'store',
    ])->name('admin.posko.store');

    Route::get('/posko/{evacuationPost}', [
        AdminEvacuationPostController::class,
        'show',
    ])->name('admin.posko.show');

    Route::get('/posko/{evacuationPost}/edit', [
        AdminEvacuationPostController::class,
        'edit',
    ])->name('admin.posko.edit');

    Route::put('/posko/{evacuationPost}', [
        AdminEvacuationPostController::class,
        'update',
    ])->name('admin.posko.update');

    Route::delete('/posko/{evacuationPost}', [
        AdminEvacuationPostController::class,
        'destroy',
    ])->name('admin.posko.destroy');

});

require __DIR__.'/settings.php';
