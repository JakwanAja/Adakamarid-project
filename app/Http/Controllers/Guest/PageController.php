<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function show(string $slug): Response
    {
        $page = Page::findBySlug($slug);

        if (!$page) {
            abort(404);
        }

        return Inertia::render('Guest/Page/Show', [
            'page' => $page,
        ]);
    }
}
