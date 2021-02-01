<?php

namespace App\Http\Controllers;

use App\Models\Level;
use App\Models\Question;
use App\Models\Setting;
use Illuminate\Http\Request;

class SupperAdminController extends Controller
{
    public function getQuestions(Request $rq)
    {

        $category = isset($rq->category) ? $rq->category :  1;

        $questions_vi = Question::where('lang', 1)->where('status', 1)->where('category', $category)->orderBy('unique_group', "asc")->get();
        $questions_ja = Question::where('lang', 2)->where('status', 1)->where('category', $category)->orderBy('unique_group', "asc")->get();
        $questions_en = Question::where('lang', 3)->where('status', 1)->where('category', $category)->orderBy('unique_group', "asc")->get();

        $levels_positive_vi = Level::where('lang', 1)->where('type', 1)->where('category', $category)->orderBy('order', "asc")->get();
        $levels_positive_ja = Level::where('lang', 2)->where('type', 1)->where('category', $category)->orderBy('order', "asc")->get();
        $levels_positive_en = Level::where('lang', 3)->where('type', 1)->where('category', $category)->orderBy('order', "asc")->get();


        $levels_negative_vi = Level::where('lang', 1)->where('type', -1)->where('category', $category)->orderBy('order', "asc")->get();
        $levels_negative_ja = Level::where('lang', 2)->where('type', -1)->where('category', $category)->orderBy('order', "asc")->get();
        $levels_negative_en = Level::where('lang', 3)->where('type', -1)->where('category', $category)->orderBy('order', "asc")->get();

        $group_1_vn_avg  = Setting::where("key", 'group_1_vn_avg')->first();
        $group_2_vn_avg  = Setting::where("key", 'group_2_vn_avg')->first();
        $group_3_vn_avg  = Setting::where("key", 'group_3_vn_avg')->first();
        $group_4_vn_avg  = Setting::where("key", 'group_4_vn_avg')->first();
        $group_5_vn_avg  = Setting::where("key", 'group_5_vn_avg')->first();
        $group_6_vn_avg  = Setting::where("key", 'group_6_vn_avg')->first();
        $group_7_vn_avg  = Setting::where("key", 'group_7_vn_avg')->first();
        $group_8_vn_avg  = Setting::where("key", 'group_8_vn_avg')->first();
        $total  = Setting::where("key", 'total_vn_avg')->first();

        return response()->json([
            "questions_vi" => $questions_vi,
            "questions_ja" => $questions_ja,
            "questions_en" => $questions_en,
            "levels_positive_vi" => $levels_positive_vi,
            "levels_positive_ja" => $levels_positive_ja,
            "levels_positive_en" => $levels_positive_en,
            "levels_negative_vi" => $levels_negative_vi,
            "levels_negative_ja" => $levels_negative_ja,
            "levels_negative_en" => $levels_negative_en,

            'group_1_vn_avg' => $group_1_vn_avg,
            'group_2_vn_avg' => $group_2_vn_avg,
            'group_3_vn_avg' => $group_3_vn_avg,
            'group_4_vn_avg' => $group_4_vn_avg,
            'group_5_vn_avg' => $group_5_vn_avg,
            'group_6_vn_avg' => $group_6_vn_avg,
            'group_7_vn_avg' => $group_7_vn_avg,
            'group_8_vn_avg' => $group_8_vn_avg,
            'total' => $total,
        ]);
    }

    public function editQuestions(Request $rq)
    {
        $type = $rq->type;

        if ($type == "question") {
            $unique_group = $rq->unique_group;
            $question_en = $rq->question_en;
            $question_ja = $rq->question_ja;
            $question_vi = $rq->question_vi;

            $db_question_vi = Question::where('unique_group', $unique_group)->where('lang', 1)->where('category', 1)->first();
            $db_question_vi->question = $question_vi;
            $db_question_vi->save();

            $db_question_ja = Question::where('unique_group', $unique_group)->where('lang', 2)->where('category', 1)->first();
            $db_question_ja->question = $question_ja;
            $db_question_ja->save();

            $db_question_en = Question::where('unique_group', $unique_group)->where('lang', 3)->where('category', 1)->first();
            $db_question_en->question = $question_en;
            $db_question_en->save();

            return response()->json([
                "message" => "OK"
            ]);
        }
        if ($type == "level") {

            $is_positive = $rq->is_positive;

            $question_en = $rq->question_en;
            $question_ja = $rq->question_ja;
            $question_vi = $rq->question_vi;

            $db_question_vi = Level::where('type', $is_positive)->where('lang', 1)->where('category', 1)->first();
            $db_question_vi->level = $question_vi;
            $db_question_vi->save();

            $db_question_ja = Level::where('type', $is_positive)->where('lang', 2)->where('category', 1)->first();
            $db_question_ja->level = $question_ja;
            $db_question_ja->save();

            $db_question_en = Level::where('type', $is_positive)->where('lang', 3)->where('category', 1)->first();
            $db_question_en->level = $question_en;
            $db_question_en->save();

            return response()->json([
                "message" => "OK"
            ]);
        }
        if ($type == "setting") {

            $group_1 = $rq->group_1;
            $group_2 = $rq->group_2;
            $group_3 = $rq->group_3;
            $group_4 = $rq->group_4;
            $group_5 = $rq->group_5;
            $group_6 = $rq->group_6;
            $group_7 = $rq->group_7;
            $group_8 = $rq->group_8;
            $total = $rq->total;

            $group_1_vn_avg  = Setting::where("key", 'group_1_vn_avg')->first();
            $group_1_vn_avg->value = $group_1;
            $group_1_vn_avg->save();

            $group_2_vn_avg  = Setting::where("key", 'group_2_vn_avg')->first();
            $group_2_vn_avg->value = $group_2;
            $group_2_vn_avg->save();

            $group_3_vn_avg  = Setting::where("key", 'group_3_vn_avg')->first();
            $group_3_vn_avg->value = $group_3;
            $group_3_vn_avg->save();

            $group_4_vn_avg  = Setting::where("key", 'group_4_vn_avg')->first();
            $group_4_vn_avg->value = $group_4;
            $group_4_vn_avg->save();

            $group_5_vn_avg  = Setting::where("key", 'group_5_vn_avg')->first();
            $group_5_vn_avg->value = $group_5;
            $group_5_vn_avg->save();

            $group_6_vn_avg  = Setting::where("key", 'group_6_vn_avg')->first();
            $group_6_vn_avg->value = $group_6;
            $group_6_vn_avg->save();

            $group_7_vn_avg  = Setting::where("key", 'group_7_vn_avg')->first();
            $group_7_vn_avg->value = $group_7;
            $group_7_vn_avg->save();

            $group_8_vn_avg  = Setting::where("key", 'group_8_vn_avg')->first();
            $group_8_vn_avg->value = $group_8;
            $group_8_vn_avg->save();


            $total_vn_avg  = Setting::where("key", 'total_vn_avg')->first();
            $total_vn_avg->value = $total;
            $total_vn_avg->save();

            return response()->json([
                'status' => "OK"
            ]);
        }
    }


    public function get_translation(Request $rq)
    {
        $en = json_decode(file_get_contents(resource_path("lang/en/translation.json")), true);
        $vi = json_decode(file_get_contents(resource_path("lang/vi/translation.json")), true);
        $ja = json_decode(file_get_contents(resource_path("lang/ja/translation.json")), true);
        return response()->json([
            'en' => $en,
            'vi' => $vi,
            'ja' => $ja
        ]);
    }
    public function edit_translation(Request $rq)
    {
        $data = $rq->data;
        $en = $data["en"];
        $vi = $data["vi"];
        $ja = $data["ja"];

        $object = new \stdClass();
        foreach ($en as $key => $value) {
            $object->{$value[0]} = $value[1];
        }

        file_put_contents(resource_path("lang/en/translation.json"), json_encode($object));

        $object = new \stdClass();
        foreach ($vi as $key => $value) {
            $object->{$value[0]} = $value[1];
        }

        file_put_contents(resource_path("lang/vi/translation.json"), json_encode($object));

        $object = new \stdClass();
        foreach ($ja as $key => $value) {
            $object->{$value[0]} = $value[1];
        }

        file_put_contents(resource_path("lang/ja/translation.json"), json_encode($object));

        return response()->json([
            'status' => "OK"
        ]);
    }
}
