<?php

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\SupperAdminController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/Summary_result_No_1_2.xlsx', function () {
    return response()->download("Summary_result_No_1_2.xlsx");
});
Route::get('/Summary_result_No_1.xlsx', function () {
    return response()->download("Summary_result_No_1.xlsx");
});
Route::get('/Summary_Raw_Result.zip', function () {
    return response()->download("Summary_Raw_Result.zip");
});

Route::prefix('/')->group(function () {
    Route::get('/', function () {
        return view('app');
    });
    Route::get('/logout', function () {
        return view('app');
    });
    Route::get('/login', function () {
        return view('app');
    });
    Route::get('/speedup', function () {
        return view('app');
    });
    Route::get('/speedup', function () {
        return view('app');
    });
});

Route::prefix('/admin')->group(function () {
    Route::get('/', function () {
        return redirect("admin/company");
    });
    Route::get('/company', function () {
        return view('app');
    });
    Route::get('/users', function () {
        return view('app');
    });
    Route::get('/questions/speedup', function () {
        return view('app');
    });
    Route::get('/getQuestions', [SupperAdminController::class, 'getQuestions']);
    Route::put('/getQuestions', [SupperAdminController::class, 'editQuestions']);
});
Route::prefix('/company')->group(function () {
    Route::get('/', function () {
        return redirect("company/users");
    });
    Route::get('/users', function () {
        return view('app');
    });
    Route::get('/users/add', function () {
        return view('app');
    });
    Route::get('/users/list', function () {
        return view('app');
    });
    Route::get('/users/list', function () {
        return view('app');
    });
    Route::get('/users/pending-invite', function () {
        return view('app');
    });
    Route::get('/users/{id}/detail/{result_id}', function () {
        return view('app');
    });
    Route::get('/users/{id}', function () {
        return view('app');
    });
});
Route::prefix('/api')->group(function () {
    Route::get('/get_number_of_time', [UserController::class, 'get_number_of_time']);
    Route::get('/getQuestions', [UserController::class, 'getQuestions']);
    Route::post('/results', [UserController::class, 'get_result']);
    Route::post('/results_detail', [UserController::class, 'results_detail']);
    Route::delete('/result_detail', [UserController::class, 'delete_results_detail']);

    Route::get('/temp', [UserController::class, 'getTemp']);
    Route::post('/temp', [UserController::class, 'createTemp']);
    Route::put('/temp', [UserController::class, 'updateTemp']);
    Route::delete('/temp', [UserController::class, 'deleteTemp']);


    Route::post('/submit', [UserController::class, 'submit']);
    Route::post('/get_user', [CompanyController::class, 'get_user']);
    Route::post('/export/summaryExcel', [CompanyController::class, 'Company_summaryExcel']);
    Route::post('/export/exportraw', [CompanyController::class, 'Company_exportraw']);
});
