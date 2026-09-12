<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="AdaKamar.id — Platform iklan kos terpercaya untuk area Yogyakarta. Temukan kos putra, putri, dan campur dengan informasi lengkap.">
    <meta name="theme-color" content="#2D1B18">

    <title inertia>{{ config('app.name', 'AdaKamar.id') }}</title>

    {{-- Favicon --}}
    <link rel="icon" type="image/png" href="/image/logo.png">
    <link rel="shortcut icon" href="/favicon.ico">

    @routes
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>
<body class="antialiased">
    @inertia
</body>
</html>
