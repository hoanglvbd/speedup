<?php

namespace App\Http\Controllers;

use App\Models\Level;
use App\Models\Question;
use App\Models\Result;
use App\Models\ResultDetail;
use App\Models\Temp;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function get_number_of_time(Request $req)
    {
        $user_id = $req->user_id;

        $count = Result::where("user_id", $user_id)->where('category', 1)->count();

        return response()->json([
            "total" =>  2 - $count,
        ]);
    }

    public function getQuestions(Request $rq)
    {
        $lang = isset($rq->lang) ? $rq->lang :  1;
        $category = isset($rq->category) ? $rq->category :  1;

        $questions = Question::where('lang', $lang)->where('status', 1)->where('category', $category)->orderBy('unique_group', "asc")->get();
        $levels_positive = Level::where('lang', $lang)->where('type', 1)->where('category', $category)->orderBy('order', "asc")->get();
        $levels_negative = Level::where('lang', $lang)->where('type', -1)->where('category', $category)->orderBy('order', "asc")->get();


        return response()->json([
            "questions" => $questions,
            'levels_positive' => $levels_positive,
            'levels_negative' => $levels_negative
        ]);
    }


    public function submit(Request $rq)
    {
        $user_id = $rq->user_id;
        $temp = Temp::where('user_id', $user_id)->first();
        if ($temp !== null) {
            $temp->delete();
        }


        $request_result = isset($rq->results) ? $rq->results : [];

        $newResult = new Result;
        $newResult->user_id = $user_id;

        $result_count = Result::where("user_id", $user_id)->count();
        if ($result_count < 2) { // temp
            $newResult->number_of_times = $result_count + 1;
            $newResult->category  = 1;
            $newResult->save();

            $data = [];

            foreach ($request_result as $value) {
                $temp = [
                    'result_id' => $newResult->id,
                    'question_group_id' => $value['group'],
                    'unique_group' => $value['unique_group'],
                    'level_id' => $value['level'],
                ];
                array_push($data, $temp);
            }
            ResultDetail::insert($data);
            return response()->json([
                'status' => "OK"
            ]);
        }
    }

    public function getTemp(Request $rq)
    {
        $user_id = $rq->user_id;

        $temp = Temp::where('user_id',  $user_id)->first();

        return response()->json([
            'temp' => $temp
        ]);
    }

    public function createTemp(Request $rq)
    {
        $user_id = $rq->user_id;

        $temp = Temp::where('user_id', $user_id)->first();
        if ($temp !== null)
            $temp->delete();


        $temp = new Temp;
        $temp->user_id = $user_id;
        $temp->save();

        return response()->json([
            'message' => "OK"
        ]);
    }

    public function updateTemp(Request $rq)
    {
        $user_id = $rq->user_id;

        $temp = Temp::where('user_id', $user_id)->first();
        $temp->data = $rq->data;
        $temp->save();

        return response()->json([
            'message' => "OK"
        ]);
    }

    public function deleteTemp(Request $rq)
    {
        $user_id = $rq->user_id;

        $temp = Temp::where('user_id', $user_id);
        $temp->delete();
        return response()->json([
            'message' => "OK"
        ]);
    }


    public function get_result(Request $rq)
    {
        $user_id = $rq->user_id;

        $results  = Result::where('user_id', $user_id)->get();

        return response()->json([
            "results" => $results
        ]);
    }

    public function results_detail(Request $rq)
    {
        $result_id = $rq->result_id;
        $user_id = $rq->user_id;

        $result_detail = Question::with(['result'  => function ($query) use ($result_id) {
            $query->where('result_id', $result_id);
        }])->where('lang', 3)->where('status', 1)->where('category', 1)->orderBy('unique_group', 'asc')->get()->toArray();

        $levels_positive = Level::where('lang', 3)->where('category', 1)->where("type", 1)->orderBy('group', 'asc')->get()->toArray();
        $levels_negative = Level::where('lang', 3)->where('category', 1)->where("type", -1)->orderBy('group', 'asc')->get()->toArray();

        $result = Result::where('id', $result_id)->first();
        return response()->json([
            "result_detail" => $result_detail,
            "levels_positive" => $levels_positive,
            "levels_negative" => $levels_negative,
            'result' => $result
        ]);
    }

    public function delete_results_detail(Request $rq)
    {
        $result_id = $rq->result_id;
        $user_id = $rq->user_id;
        $time = $rq->time;

        if ($time == 1) {
            $result = Result::where('id', $result_id)->first();
            $result->delete();

            ResultDetail::where("result_id",  $result_id)->delete();

            $result_2 = Result::where('user_id', $user_id)->where('number_of_times', 2)->first();

            if ($result_2 !== null) {
                $result_2->number_of_times = 1;
                $result_2->save();
            }
        }
        if ($time == 2) {
            $result = Result::where('id', $result_id)->first();
            $result->delete();

            ResultDetail::where("result_id",  $result_id)->delete();
        }

        return response()->json([
            'message' => "OK"
        ]);
    }
}
