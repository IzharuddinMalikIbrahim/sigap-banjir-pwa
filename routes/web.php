<?php

use App\Http\Controllers\FloodReportController;
use Illuminate\Support\Facades\Route;

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
| Authenticated
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia(
        'dashboard',
        'dashboard'
    )->name('dashboard');

    Route::get('/my-reports', [
        FloodReportController::class,
        'myReports',
    ])->name('flood-reports.mine');
});

require __DIR__.'/settings.php';