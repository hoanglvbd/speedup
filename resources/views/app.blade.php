<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <link rel="stylesheet" href="{{ asset('public/css/global.css') }}">
    <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('public/images/favicon-16x16.png') }}">
    <title>Speedup</title>
</head>

<body>
    <div id="app" class="h-full"></div>
    <script>
        window.baseURL = "{{url('')}}";
        window.apiURL = "https://viecoi.vn/api/survey";
    </script>

    <script src="{{ asset('public/js/app.js') }}"></script>
    @if(config('app.env') == 'local')
    <script src="http://localhost:35729/livereload.js"></script>
    @endif
</body>

</html>