<?php

namespace App\Http\Controllers;

use App\Http\Controllers\CalculationController;
use App\Models\Result;
use Illuminate\Http\Request;

class CompanyController extends CalculationController
{
    public function get_user(Request $req)
    {
        $data = $req->data;


        foreach ($data as $key => $value) {
            $user_id = $value['user_id'];

            $result = Result::where('user_id', $user_id)->where('category', 1)->orderBy('created_at', 'desc')->get()->toArray();
            $data[$key]['results_count'] = count($result);
            if (count($result) > 0) {
                $data[$key]['updated_at'] = $result[0]['created_at'];
            } else {
                $data[$key]['updated_at'] = null;
            }
        }

        return response()->json([
            'users' => $data
        ]);
    }

    public function Company_summaryExcel(Request $req)
    {
        return $this->summaryExcel($req);
    }
}
