<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <link rel="stylesheet" href="{{ asset('public/css/global.css') }}">
    <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('public/images/favicon-16x16.png') }}">
    <style type="text/css">
        .ipl-progress-indicator.available {
            opacity: 0;
            pointer-events: none;
        }

        .ipl-progress-indicator {
            background-color: #f5f5f5;
            width: 100%;
            height: 100%;
            position: fixed;
            opacity: 1;
            -webkit-transition: opacity cubic-bezier(.4, 0, .2, 1) 436ms;
            -moz-transition: opacity cubic-bezier(.4, 0, .2, 1) 436ms;
            transition: opacity cubic-bezier(.4, 0, .2, 1) 436ms;
            z-index: 9999
        }

        .insp-logo-frame {
            display: -webkit-flex;
            display: -moz-flex;
            display: flex;
            -webkit-flex-direction: column;
            -moz-flex-direction: column;
            flex-direction: column;
            -webkit-justify-content: center;
            -moz-justify-content: center;
            justify-content: center;
            -webkit-animation: fadein 436ms;
            -moz-animation: fadein 436ms;
            animation: fadein 436ms;
            height: 100%
        }

        .insp-logo-frame-img {
            width: 112px;
            height: 112px;
            -webkit-align-self: center;
            -moz-align-self: center;
            align-self: center;
            border-radius: 50%
        }

        .ipl-progress-indicator .insp-logo {
            animation: App-logo-spin infinite 20s linear;
            border-radius: 50%;
            -webkit-align-self: center;
            -moz-align-self: center;
            align-self: center
        }


        @-webkit-keyframes fadein {
            from {
                opacity: 0
            }

            to {
                opacity: 1
            }
        }

        @-moz-keyframes fadein {
            from {
                opacity: 0
            }

            to {
                opacity: 1
            }
        }

        @keyframes fadein {
            from {
                opacity: 0
            }

            to {
                opacity: 1
            }
        }
    </style>
    <title>Speed Up</title>
</head>

<body>
    <div class="ipl-progress-indicator available" id="ipl-progress-indicator">
        <div class="insp-logo-frame">
            <!--   <svg width="112" class="insp-logo-frame-img" height="112" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.9 595.3">
                <g fill="#61DAFB">
                    <path d="M666.3 296.5c0-32.5-40.7-63.3-103.1-82.4 14.4-63.6 8-114.2-20.2-130.4-6.5-3.8-14.1-5.6-22.4-5.6v22.3c4.6 0 8.3.9 11.4 2.6 13.6 7.8 19.5 37.5 14.9 75.7-1.1 9.4-2.9 19.3-5.1 29.4-19.6-4.8-41-8.5-63.5-10.9-13.5-18.5-27.5-35.3-41.6-50 32.6-30.3 63.2-46.9 84-46.9V78c-27.5 0-63.5 19.6-99.9 53.6-36.4-33.8-72.4-53.2-99.9-53.2v22.3c20.7 0 51.4 16.5 84 46.6-14 14.7-28 31.4-41.3 49.9-22.6 2.4-44 6.1-63.6 11-2.3-10-4-19.7-5.2-29-4.7-38.2 1.1-67.9 14.6-75.8 3-1.8 6.9-2.6 11.5-2.6V78.5c-8.4 0-16 1.8-22.6 5.6-28.1 16.2-34.4 66.7-19.9 130.1-62.2 19.2-102.7 49.9-102.7 82.3 0 32.5 40.7 63.3 103.1 82.4-14.4 63.6-8 114.2 20.2 130.4 6.5 3.8 14.1 5.6 22.5 5.6 27.5 0 63.5-19.6 99.9-53.6 36.4 33.8 72.4 53.2 99.9 53.2 8.4 0 16-1.8 22.6-5.6 28.1-16.2 34.4-66.7 19.9-130.1 62-19.1 102.5-49.9 102.5-82.3zm-130.2-66.7c-3.7 12.9-8.3 26.2-13.5 39.5-4.1-8-8.4-16-13.1-24-4.6-8-9.5-15.8-14.4-23.4 14.2 2.1 27.9 4.7 41 7.9zm-45.8 106.5c-7.8 13.5-15.8 26.3-24.1 38.2-14.9 1.3-30 2-45.2 2-15.1 0-30.2-.7-45-1.9-8.3-11.9-16.4-24.6-24.2-38-7.6-13.1-14.5-26.4-20.8-39.8 6.2-13.4 13.2-26.8 20.7-39.9 7.8-13.5 15.8-26.3 24.1-38.2 14.9-1.3 30-2 45.2-2 15.1 0 30.2.7 45 1.9 8.3 11.9 16.4 24.6 24.2 38 7.6 13.1 14.5 26.4 20.8 39.8-6.3 13.4-13.2 26.8-20.7 39.9zm32.3-13c5.4 13.4 10 26.8 13.8 39.8-13.1 3.2-26.9 5.9-41.2 8 4.9-7.7 9.8-15.6 14.4-23.7 4.6-8 8.9-16.1 13-24.1zM421.2 430c-9.3-9.6-18.6-20.3-27.8-32 9 .4 18.2.7 27.5.7 9.4 0 18.7-.2 27.8-.7-9 11.7-18.3 22.4-27.5 32zm-74.4-58.9c-14.2-2.1-27.9-4.7-41-7.9 3.7-12.9 8.3-26.2 13.5-39.5 4.1 8 8.4 16 13.1 24 4.7 8 9.5 15.8 14.4 23.4zM420.7 163c9.3 9.6 18.6 20.3 27.8 32-9-.4-18.2-.7-27.5-.7-9.4 0-18.7.2-27.8.7 9-11.7 18.3-22.4 27.5-32zm-74 58.9c-4.9 7.7-9.8 15.6-14.4 23.7-4.6 8-8.9 16-13 24-5.4-13.4-10-26.8-13.8-39.8 13.1-3.1 26.9-5.8 41.2-7.9zm-90.5 125.2c-35.4-15.1-58.3-34.9-58.3-50.6 0-15.7 22.9-35.6 58.3-50.6 8.6-3.7 18-7 27.7-10.1 5.7 19.6 13.2 40 22.5 60.9-9.2 20.8-16.6 41.1-22.2 60.6-9.9-3.1-19.3-6.5-28-10.2zM310 490c-13.6-7.8-19.5-37.5-14.9-75.7 1.1-9.4 2.9-19.3 5.1-29.4 19.6 4.8 41 8.5 63.5 10.9 13.5 18.5 27.5 35.3 41.6 50-32.6 30.3-63.2 46.9-84 46.9-4.5-.1-8.3-1-11.3-2.7zm237.2-76.2c4.7 38.2-1.1 67.9-14.6 75.8-3 1.8-6.9 2.6-11.5 2.6-20.7 0-51.4-16.5-84-46.6 14-14.7 28-31.4 41.3-49.9 22.6-2.4 44-6.1 63.6-11 2.3 10.1 4.1 19.8 5.2 29.1zm38.5-66.7c-8.6 3.7-18 7-27.7 10.1-5.7-19.6-13.2-40-22.5-60.9 9.2-20.8 16.6-41.1 22.2-60.6 9.9 3.1 19.3 6.5 28.1 10.2 35.4 15.1 58.3 34.9 58.3 50.6-.1 15.7-23 35.6-58.4 50.6zM320.8 78.4z" />
                    <circle cx="420.9" cy="296.5" r="45.7" />
                    <path d="M520.5 78.1z" />
                </g>
            </svg> -->

            <svg width="112" class="insp-logo-frame-img" height="112" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 189.3 165.33">
                <defs>
                    <style>
                        .cls-1 {
                            fill: #8a1b00;
                        }

                        .cls-2 {
                            fill: #004c98;
                        }

                        .cls-3 {
                            fill: #ff3c15;
                        }

                        .cls-4 {
                            fill: #66bde6;
                        }
                    </style>
                </defs>
                <g id="Layer_2" data-name="Layer 2">
                    <g id="Layer_2-2" data-name="Layer 2">
                        <circle class="cls-1" cx="13.4" cy="73" r="13.4" />
                        <circle class="cls-2" cx="175.9" cy="92" r="13.4" />
                    </g>
                    <g id="Layer_4" data-name="Layer 4">
                        <polygon class="cls-1" points="31.4 91.83 62.4 110.33 95.4 91.67 63.4 73.33 63.46 73.3 31.4 54.95 31.4 91.83" />
                        <polygon class="cls-3" points="126.4 0 31.4 54.33 31.4 54.95 63.46 73.3 126.23 37.17 126.4 0" />
                        <polygon class="cls-2" points="158.4 73.5 127.4 55 94.4 73.67 126.4 92 126.34 92.04 158.4 110.38 158.4 73.5" />
                        <polygon class="cls-4" points="63.4 165.33 158.4 111 158.4 110.38 126.34 92.04 63.57 128.17 63.4 165.33" />
                    </g>
                </g>
            </svg>
        </div>
    </div>
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