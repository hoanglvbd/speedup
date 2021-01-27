<?php

namespace App\Exports;

use App\Models\Level;
use App\Models\Question;
use Maatwebsite\Excel\Concerns\FromArray;

class UsersRawResultExport implements FromArray
{
    public function __construct($user, $result_id, $company)
    {
        $this->result_id = $result_id;
        $this->user = $user;
        $this->company = $company;
    }
    /**
     * @return \Illuminate\Support\Collection
     */
    public function array(): array
    {


        $resultDetail = Question::with(['result'  => function ($query) {
            $query->where('result_id', $this->result_id);
        }])->where('lang', 3)->where('status', 1)->where('category', 1)->orderBy('unique_group', 'asc')->get()->toArray();


        $collection = [];
        $_1 = ['', 'Name', $this->user['name']];
        $_2 = ['', 'Organization', $this->company['name']];
        $collection = [
            $_1,
            $_2,
        ];

        $levels_positive = Level::where('lang', 3)->where('category', 1)->where("type", 1)->orderBy('group', 'asc')->get()->toArray();
        $levels_negative = Level::where('lang', 3)->where('category', 1)->where("type", -1)->orderBy('group', 'asc')->get()->toArray();
        foreach ($resultDetail as $key => $value) {
            $temp = [$value['unique_group'], $value['question'], $this->level_to_answer($value['type'], $value['result']['level_id'], $levels_positive, $levels_negative)];
            array_push(
                $collection,
                $temp
            );
        }

        return $collection;
    }

    public function level_to_answer($type, $level, $levels_positive, $levels_negative)
    {
        if ($type == 1) {
            return $levels_positive[$level - 1]['level'];
        } else {
            return $levels_negative[$level - 1]['level'];
        }
    }
}
