<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdatePageRequest;
use App\Models\Page;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function edit(Page $page): Response
    {
        return Inertia::render('Admin/Pages/Edit', [
            'page' => $page,
        ]);
    }

    public function update(UpdatePageRequest $request, Page $page)
    {
        $page->update([
            'title'      => $request->title,
            'content'    => $request->content,
            'is_active'  => $request->boolean('is_active', true),
            'updated_at' => now(),
        ]);

        return back()->with('success', 'Halaman berhasil diperbarui.');
    }
}
