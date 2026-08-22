<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Return the response after successful authentication.
     */
    public function toResponse($request)
    {
        $user = $request->user();

        if ($user?->role?->slug === 'admin') {
            return redirect('/admin/home');
        }

        if ($user?->role?->slug === 'community') {
            return redirect('/dashboard');
        }

        return redirect('/');
    }
}
