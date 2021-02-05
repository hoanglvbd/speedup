<?php

namespace App\Http\Controllers;

use App\Exports\UsersRawResultExport;
use App\Http\Controllers\Controller;
use App\Models\Result;
use App\Models\ResultDetail;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

define('GROUP_1', 'GROUP_1');
define('GROUP_2', 'GROUP_2');
define('GROUP_3', 'GROUP_3');
define('GROUP_4', 'GROUP_4');
define('GROUP_5', 'GROUP_5');
define('GROUP_6', 'GROUP_6');
define('GROUP_7', 'GROUP_7');
define('GROUP_8', 'GROUP_8');

define('ARROW_UP', '↑');
define('ARROW_DOWN', '↓');
define('ARROW_RIGHT', '→');

class CalculationController extends Controller
{

    public function exportraw(Request $req)
    {
        //delete 
        $files = storage_path('app/userdata/');
        $this->deleteDirectory($files); // delete file

        $zip = new \ZipArchive();
        $zip_file = 'Summary_Raw_Result.zip';
        $zip->open($zip_file, \ZipArchive::CREATE  | \ZipArchive::OVERWRITE);


        $data = $req->data;
        $auth = $req->auth;
        foreach ($data as $key => $user) {
            $results = Result::where('user_id', $user['emp_id_invited'])->get()->toArray();
            foreach ($results as $key => $value) {
                $file_name = $user['name'] . ' - No. ' . $value['number_of_times'] . ' .xlsx';
                Excel::store(new UsersRawResultExport($user, $value['id'], $auth), $file_name);
                $zip->addFile(storage_path('app/' .  $file_name),  $file_name);
            }
        }
        $zip->close();

        return response()->download($zip_file);
    }



    public function summaryExcel(Request $req)
    {
        $data = $req->data;
        /*    $user_id_input = $req->user_id; */
        $resultCount = $req->num;

        /*     $user_array = explode(',', $user_id_input); */
        $stylesHeader = [
            'font' => [
                'bold' => true,
                'size' => 13,
                'color' => ['argb' => "FFFFFF"]
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_LEFT,
                'vertical' => Alignment::VERTICAL_CENTER,
                'wrapText' => false
            ],
            "fill" => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => [
                    'argb' => '1f497d',
                ],
            ]
        ];

        $stylesContentName = [
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                'wrapText' => true
            ],
            'borders' => [
                'outline' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => 'd1d1d1'],
                ],
            ],
        ];
        $stylesContentID = [
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                'wrapText' => true
            ],
            'borders' => [
                'bottom' => [
                    'borderStyle' => Border::BORDER_MEDIUM,
                    'color' => ['rgb' => '808080'],
                ],
                'right' => [
                    'borderStyle' => Border::BORDER_MEDIUM,
                    'color' => ['rgb' => '808080'],
                ],
                'top' => [
                    'borderStyle' => Border::BORDER_MEDIUM,
                    'color' => ['rgb' => '808080'],
                ],
            ],
        ];

        $stylesContent = [
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_RIGHT,
                'vertical' => Alignment::VERTICAL_CENTER,
                'wrapText' => true
            ],
            "fill" => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => [
                    'argb' => 'cfe2f3',
                ],
            ],
            'borders' => [
                'outline' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => 'd1d1d1'],
                ],
            ],

        ];

        $stylesContent1_1 = [
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                'wrapText' => true
            ],
            'borders' => [
                'bottom' => [
                    'borderStyle' => Border::BORDER_MEDIUM,
                    'color' => ['rgb' => '808080'],
                ],
                'right' => [
                    'borderStyle' => Border::BORDER_DASHDOT,
                    'color' => ['rgb' => '808080'],
                ],
                'top' => [
                    'borderStyle' => Border::BORDER_MEDIUM,
                    'color' => ['rgb' => '808080'],
                ],
                'left' => [
                    'borderStyle' => Border::BORDER_MEDIUM,
                    'color' => ['rgb' => '808080'],
                ],
            ],

        ];
        $stylesContent1_2 = [
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                'wrapText' => true
            ],
            'borders' => [
                'bottom' => [
                    'borderStyle' => Border::BORDER_MEDIUM,
                    'color' => ['rgb' => '808080'],
                ],
                'right' => [
                    'borderStyle' => Border::BORDER_DASHDOT,
                    'color' => ['rgb' => '808080'],
                ],
                'top' => [
                    'borderStyle' => Border::BORDER_MEDIUM,
                    'color' => ['rgb' => '808080'],
                ],
                'left' => [
                    'borderStyle' => Border::BORDER_DASHDOT,
                    'color' => ['rgb' => '808080'],
                ],
            ],
        ];
        $stylesContent1_3 = [
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                'wrapText' => true
            ],
            'borders' => [
                'bottom' => [
                    'borderStyle' => Border::BORDER_MEDIUM,
                    'color' => ['rgb' => '808080'],
                ],
                'right' => [
                    'borderStyle' => Border::BORDER_MEDIUM,
                    'color' => ['rgb' => '808080'],
                ],
                'top' => [
                    'borderStyle' => Border::BORDER_MEDIUM,
                    'color' => ['rgb' => '808080'],
                ],
                'left' => [
                    'borderStyle' => Border::BORDER_DASHDOT,
                    'color' => ['rgb' => '808080'],
                ],
            ],
        ];
        $stylesContent2_1 = [
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                'wrapText' => true
            ],
            'borders' => [
                'bottom' => [
                    'borderStyle' => Border::BORDER_MEDIUM,
                    'color' => ['rgb' => '808080'],
                ],
                'right' => [
                    'borderStyle' => Border::BORDER_DASHDOT,
                    'color' => ['rgb' => '808080'],
                ],
                'top' => [
                    'borderStyle' => Border::BORDER_DASHDOT,
                    'color' => ['rgb' => '808080'],
                ],
                'left' => [
                    'borderStyle' => Border::BORDER_MEDIUM,
                    'color' => ['rgb' => '808080'],
                ],
            ],
        ];
        $stylesContent2_2 = [
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                'wrapText' => true
            ],
            'borders' => [
                'bottom' => [
                    'borderStyle' => Border::BORDER_MEDIUM,
                    'color' => ['rgb' => '808080'],
                ],
                'right' => [
                    'borderStyle' => Border::BORDER_DASHDOT,
                    'color' => ['rgb' => '808080'],
                ],
                'top' => [
                    'borderStyle' => Border::BORDER_DASHDOT,
                    'color' => ['rgb' => '808080'],
                ],
                'left' => [
                    'borderStyle' => Border::BORDER_DASHDOT,
                    'color' => ['rgb' => '808080'],
                ],
            ],
        ];
        $stylesContent2_3 = [
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                'wrapText' => true
            ],
            'borders' => [
                'bottom' => [
                    'borderStyle' => Border::BORDER_MEDIUM,
                    'color' => ['rgb' => '808080'],
                ],
                'right' => [
                    'borderStyle' => Border::BORDER_MEDIUM,
                    'color' => ['rgb' => '808080'],
                ],
                'top' => [
                    'borderStyle' => Border::BORDER_DASHDOT,
                    'color' => ['rgb' => '808080'],
                ],
                'left' => [
                    'borderStyle' => Border::BORDER_DASHDOT,
                    'color' => ['rgb' => '808080'],
                ],
            ],
        ];
        if ($resultCount == 1) {
            $spreadsheet = new Spreadsheet();
            $spreadsheet->setActiveSheetIndex(0);
            $sheet = $spreadsheet->getActiveSheet();

            //set header
            $sheet->getColumnDimension('A')->setWidth(30);
            $sheet->getColumnDimension('B')->setWidth(15);
            $sheet->getColumnDimension('C')->setWidth(15);
            $sheet->getColumnDimension('D')->setWidth(15);
            $sheet->getColumnDimension('E')->setWidth(15);
            $sheet->getColumnDimension('F')->setWidth(15);
            $sheet->getColumnDimension('G')->setWidth(15);
            $sheet->getColumnDimension('H')->setWidth(15);
            $sheet->getColumnDimension('I')->setWidth(15);
            $sheet->getColumnDimension('J')->setWidth(15);

            $sheet->getRowDimension('1')->setRowHeight(25);

            $sheet->setCellValue('A1', '')->getStyle('A1');
            $sheet->setCellValue('B1', '総合点')->getStyle('B1')->applyFromArray($stylesHeader);
            $sheet->setCellValue('C1', '"①自己評価意識	① Self-evaluation consciousness	① Self-evaluation consciousness（Self-evaluation consciousness）"')->getStyle('C1')->applyFromArray($stylesHeader);
            $sheet->setCellValue('D1', '②組織内位置認識② Position recognition in the organization（Position recognition in the organization）')->getStyle('D1')->applyFromArray($stylesHeader);
            $sheet->setCellValue('E1', '"③結果明確	③ Clear result（Clear result）"')->getStyle('E1')->applyFromArray($stylesHeader);
            $sheet->setCellValue('F1', '④成果視点（Achievement perspective/result-oriented）')->getStyle('F1')->applyFromArray($stylesHeader);
            $sheet->setCellValue('G1', '⑤免責意識（Consciousness of disclaimer')->getStyle('G1')->applyFromArray($stylesHeader);
            $sheet->setCellValue('H1', '⑥変化意識（Consciousness of change）')->getStyle('H1')->applyFromArray($stylesHeader);
            $sheet->setCellValue('I1', '"⑦行動優先意識	⑦ Consciousness of Action priority（Consciousness of Action priority）"')->getStyle('I1')->applyFromArray($stylesHeader);
            $sheet->setCellValue('J1', '⑧時感覚（Sense of time）')->getStyle('J1')->applyFromArray($stylesHeader);

            $summary = [];
            foreach ($data as $key => $value) {

                $first = Result::where('user_id', $value['emp_id_invited'])->where('number_of_times', 1)->first();
                if ($first == null) continue;

                $detail_first = ResultDetail::where("result_id", $first->id)->orderBy('question_group_id')->get()->toArray();
                $result_first = $this->calcSummary($detail_first);

                array_push($summary, [
                    $value['name'], $result_first[0], $result_first[1], $result_first[2], $result_first[3], $result_first[4], $result_first[5], $result_first[6], $result_first[7], $result_first[8]
                ]);
            }
            //calculate total row
            $totalOfAvg = 0;
            $totalOfGroup_1 = 0;
            $totalOfGroup_2 = 0;
            $totalOfGroup_3 = 0;
            $totalOfGroup_4 = 0;
            $totalOfGroup_5 = 0;
            $totalOfGroup_6 = 0;
            $totalOfGroup_7 = 0;
            $totalOfGroup_8 = 0;

            foreach ($summary as $key => $value) {
                $totalOfAvg = $totalOfAvg + $value[1];
                $totalOfGroup_1 = $totalOfGroup_1 + $value[2];
                $totalOfGroup_2 = $totalOfGroup_2 + $value[3];
                $totalOfGroup_3 = $totalOfGroup_3 + $value[4];
                $totalOfGroup_4 = $totalOfGroup_4 + $value[5];
                $totalOfGroup_5 = $totalOfGroup_5 + $value[6];
                $totalOfGroup_6 = $totalOfGroup_6 + $value[7];
                $totalOfGroup_7 = $totalOfGroup_7 + $value[8];
                $totalOfGroup_8 = $totalOfGroup_8 + $value[9];
            }
            $total_avg = [
                "Average",
                round($totalOfAvg / count($summary), 1),
                round($totalOfGroup_1 / count($summary), 1),
                round($totalOfGroup_2 / count($summary), 1),
                round($totalOfGroup_3 / count($summary), 1),
                round($totalOfGroup_4 / count($summary), 1),
                round($totalOfGroup_5 / count($summary), 1),
                round($totalOfGroup_6 / count($summary), 1),
                round($totalOfGroup_7 / count($summary), 1),
                round($totalOfGroup_8 / count($summary), 1),
            ];
            array_push($summary, $total_avg);
            // insert vietnamese avg
            $group_1_vn_avg  = Setting::where("key", 'group_1_vn_avg')->first();
            $group_2_vn_avg  = Setting::where("key", 'group_2_vn_avg')->first();
            $group_3_vn_avg  = Setting::where("key", 'group_3_vn_avg')->first();
            $group_4_vn_avg  = Setting::where("key", 'group_4_vn_avg')->first();
            $group_5_vn_avg  = Setting::where("key", 'group_5_vn_avg')->first();
            $group_6_vn_avg  = Setting::where("key", 'group_6_vn_avg')->first();
            $group_7_vn_avg  = Setting::where("key", 'group_7_vn_avg')->first();
            $group_8_vn_avg  = Setting::where("key", 'group_8_vn_avg')->first();
            $total_vn_avg  = Setting::where("key", 'total_vn_avg')->first();

            $total_avg = [
                "Vietnamese Average",
                round($total_vn_avg->value, 1),
                round($group_1_vn_avg->value, 1),
                round($group_2_vn_avg->value, 1),
                round($group_3_vn_avg->value, 1),
                round($group_4_vn_avg->value, 1),
                round($group_5_vn_avg->value, 1),
                round($group_6_vn_avg->value, 1),
                round($group_7_vn_avg->value, 1),
                round($group_8_vn_avg->value, 1),
            ];
            array_push($summary, $total_avg);

            usort($summary, function ($a, $b) {
                return $b[1] - $a[1];
            });

            // make excel
            $row_start = 2;
            $vn_index = 0;
            $avg_index = 0;
            foreach ($summary as $key => $value) {
                if ($value[0] == "Vietnamese Average") {
                    $vn_index = $key;
                    break;
                }
            }

            foreach ($summary as $key => $value) {
                if ($value[0] ==  "Average") {
                    $avg_index = $key;
                    break;
                }
            }


            foreach ($summary as $key => $value) {
                $sheet->getRowDimension($row_start)->setRowHeight(20);
                //set content
                $sheet->setCellValue('A' . $row_start, $value[0])->getStyle('A' . $row_start)->applyFromArray($this->getBackgroundOfName($key, array($vn_index, $avg_index)));
                $sheet->setCellValue('B' . $row_start, $value[1])->getStyle('B' . $row_start)->applyFromArray($this->mergeArrayBackgroundByIndex($stylesContentName, $key, $vn_index, $avg_index));
                $sheet->setCellValue('C' . $row_start, $value[2])->getStyle('C' . $row_start)->applyFromArray($this->mergeArrayBackgroundByValue($stylesContentName, $value[2], $summary[$vn_index][2], $summary[$avg_index][2], $key, $vn_index, $avg_index));
                $sheet->setCellValue('D' . $row_start, $value[3])->getStyle('D' . $row_start)->applyFromArray($this->mergeArrayBackgroundByValue($stylesContentName, $value[3], $summary[$vn_index][3], $summary[$avg_index][3], $key, $vn_index, $avg_index));
                $sheet->setCellValue('E' . $row_start, $value[4])->getStyle('E' . $row_start)->applyFromArray($this->mergeArrayBackgroundByValue($stylesContentName, $value[4], $summary[$vn_index][4], $summary[$avg_index][4], $key, $vn_index, $avg_index));
                $sheet->setCellValue('F' . $row_start, $value[5])->getStyle('F' . $row_start)->applyFromArray($this->mergeArrayBackgroundByValue($stylesContentName, $value[5], $summary[$vn_index][5], $summary[$avg_index][5], $key, $vn_index, $avg_index));
                $sheet->setCellValue('G' . $row_start, $value[6])->getStyle('G' . $row_start)->applyFromArray($this->mergeArrayBackgroundByValue($stylesContentName, $value[6], $summary[$vn_index][6], $summary[$avg_index][6], $key, $vn_index, $avg_index));
                $sheet->setCellValue('H' . $row_start, $value[7])->getStyle('H' . $row_start)->applyFromArray($this->mergeArrayBackgroundByValue($stylesContentName, $value[7], $summary[$vn_index][7], $summary[$avg_index][7], $key, $vn_index, $avg_index));
                $sheet->setCellValue('I' . $row_start, $value[8])->getStyle('I' . $row_start)->applyFromArray($this->mergeArrayBackgroundByValue($stylesContentName, $value[8], $summary[$vn_index][8], $summary[$avg_index][8], $key, $vn_index, $avg_index));
                $sheet->setCellValue('J' . $row_start, $value[9])->getStyle('J' . $row_start)->applyFromArray($this->mergeArrayBackgroundByValue($stylesContentName, $value[9], $summary[$vn_index][9], $summary[$avg_index][9], $key, $vn_index, $avg_index));

                $row_start = $row_start + 1;
            }
            /*    dd($summary); */
            $writer = new Xlsx($spreadsheet);
            $writer->save('Summary_result_No_1.xlsx');
            return response()->json([
                'status' => "OK"
            ]);
        }
        if ($resultCount == 2) {
            $spreadsheet = new Spreadsheet();
            $spreadsheet->setActiveSheetIndex(0);
            $sheet = $spreadsheet->getActiveSheet();
            //set header
            $sheet->getColumnDimension('A')->setWidth(25);

            $sheet->setCellValue('A1', '')->getStyle('A1');
            $sheet->setCellValue('B1', '総合点')->getStyle('B1')->applyFromArray($stylesHeader);
            $sheet->mergeCells('B1:D1');
            $sheet->getStyle('B1')->applyFromArray($stylesHeader);
            $sheet->getStyle('C1')->applyFromArray($stylesHeader);
            $sheet->getStyle('D1')->applyFromArray($stylesHeader);

            $sheet->setCellValue('E1', '"①自己評価意識	① Self-evaluation consciousness	① Self-evaluation consciousness（Self-evaluation consciousness）"')->getStyle('E1')->applyFromArray($stylesHeader);
            $sheet->mergeCells('E1:G1');
            $sheet->getStyle('E1')->applyFromArray($stylesHeader);
            $sheet->getStyle('F1')->applyFromArray($stylesHeader);
            $sheet->getStyle('G1')->applyFromArray($stylesHeader);

            $sheet->setCellValue('H1', '②組織内位置認識② Position recognition in the organization（Position recognition in the organization）')->getStyle('H1')->applyFromArray($stylesHeader);
            $sheet->mergeCells('H1:J1');
            $sheet->getStyle('H1')->applyFromArray($stylesHeader);
            $sheet->getStyle('I1')->applyFromArray($stylesHeader);
            $sheet->getStyle('J1')->applyFromArray($stylesHeader);


            $sheet->setCellValue('K1', '"③結果明確	③ Clear result（Clear result）"')->getStyle('K1')->applyFromArray($stylesHeader);
            $sheet->mergeCells('K1:M1');
            $sheet->getStyle('K1')->applyFromArray($stylesHeader);
            $sheet->getStyle('L1')->applyFromArray($stylesHeader);
            $sheet->getStyle('M1')->applyFromArray($stylesHeader);

            $sheet->setCellValue('N1', '④成果視点（Achievement perspective/result-oriented）')->getStyle('N1')->applyFromArray($stylesHeader);
            $sheet->mergeCells('N1:P1');
            $sheet->getStyle('N1')->applyFromArray($stylesHeader);
            $sheet->getStyle('O1')->applyFromArray($stylesHeader);
            $sheet->getStyle('P1')->applyFromArray($stylesHeader);

            $sheet->setCellValue('Q1', '⑤免責意識（Consciousness of disclaimer')->getStyle('Q1')->applyFromArray($stylesHeader);
            $sheet->mergeCells('Q1:S1');
            $sheet->getStyle('Q1')->applyFromArray($stylesHeader);
            $sheet->getStyle('R1')->applyFromArray($stylesHeader);
            $sheet->getStyle('S1')->applyFromArray($stylesHeader);

            $sheet->setCellValue('T1', '⑥変化意識（Consciousness of change）')->getStyle('T1')->applyFromArray($stylesHeader);
            $sheet->mergeCells('T1:V1');
            $sheet->getStyle('T1')->applyFromArray($stylesHeader);
            $sheet->getStyle('U1')->applyFromArray($stylesHeader);
            $sheet->getStyle('V1')->applyFromArray($stylesHeader);


            $sheet->setCellValue('W1', '"⑦行動優先意識	⑦ Consciousness of Action priority（Consciousness of Action priority）"')->getStyle('W1')->applyFromArray($stylesHeader);
            $sheet->mergeCells('W1:Y1');
            $sheet->getStyle('W1')->applyFromArray($stylesHeader);
            $sheet->getStyle('X1')->applyFromArray($stylesHeader);
            $sheet->getStyle('Y1')->applyFromArray($stylesHeader);

            $sheet->setCellValue('Z1', '⑧時感覚（Sense of time）')->getStyle('Z1')->applyFromArray($stylesHeader);
            $sheet->mergeCells('Z1:AB1');
            $sheet->getStyle('Z1')->applyFromArray($stylesHeader);
            $sheet->getStyle('AA1')->applyFromArray($stylesHeader);
            $sheet->getStyle('AB1')->applyFromArray($stylesHeader);

            $row_start = 2;
            foreach ($data as $key => $value) {
                $first = Result::where('user_id', $value['emp_id_invited'])->where('number_of_times', 1)->first();
                $second = Result::where('user_id', $value['emp_id_invited'])->where('number_of_times', 2)->first();
                if ($first == null || $second == null) continue;

                $detail_first = ResultDetail::where("result_id", $first->id)->orderBy('question_group_id')->get()->toArray();
                $result_first = $this->calcSummary($detail_first);

                $detail_second = ResultDetail::where("result_id", $second->id)->orderBy('question_group_id')->get()->toArray();
                $result_second = $this->calcSummary($detail_second);

                //set content
                $sheet->setCellValue('A' . $row_start, $value['name'])->getStyle('A' . $row_start)->applyFromArray($stylesContentID);

                //total
                $sheet->setCellValue('B' . $row_start, $result_first[0])->getStyle('B2')->applyFromArray($stylesContent1_1);
                $sheet->setCellValue('C' . $row_start, $this->getArrowByScore($result_first[0],  $result_second[0]))->getStyle('C2')->applyFromArray($stylesContent1_2);
                $sheet->setCellValue('D' . $row_start, $result_second[0])->getStyle('D2')->applyFromArray($stylesContent1_3);

                // GROUP 1

                $sheet->setCellValue('E' . $row_start, $result_first[1])->getStyle('E' . $row_start)->applyFromArray($this->mergeArrayBackground($stylesContent1_1, $this->getArrowByScore($result_first[1], $result_second[1])));
                $sheet->setCellValue('F' . $row_start, $this->getArrowByScore($result_first[1], $result_second[1]))->getStyle('F' . $row_start)->applyFromArray($this->mergeArrayBackground($stylesContent1_2, $this->getArrowByScore($result_first[1], $result_second[1])));
                $sheet->setCellValue('G' . $row_start,  $result_second[1])->getStyle('G' . $row_start)->applyFromArray($this->mergeArrayBackground($stylesContent1_3, $this->getArrowByScore($result_first[1], $result_second[1])));

                // GROUP 2
                $sheet->setCellValue('H' . $row_start, $result_first[2])->getStyle('H' . $row_start)->applyFromArray($this->mergeArrayBackground($stylesContent1_1, $this->getArrowByScore($result_first[2], $result_second[2])));
                $sheet->setCellValue('I' . $row_start, $this->getArrowByScore($result_first[2], $result_second[2]))->getStyle('I' . $row_start)->applyFromArray($this->mergeArrayBackground($stylesContent1_2, $this->getArrowByScore($result_first[2], $result_second[2])));
                $sheet->setCellValue('J' . $row_start,  $result_second[2])->getStyle('J' . $row_start)->applyFromArray($this->mergeArrayBackground($stylesContent1_3, $this->getArrowByScore($result_first[2], $result_second[2])));

                // GROUP 3

                $sheet->setCellValue('K' . $row_start, $result_first[3])->getStyle('K' . $row_start)->applyFromArray($this->mergeArrayBackground($stylesContent1_1, $this->getArrowByScore($result_first[3], $result_second[3])));
                $sheet->setCellValue('L' . $row_start, $this->getArrowByScore($result_first[3], $result_second[3]))->getStyle('L' . $row_start)->applyFromArray($this->mergeArrayBackground($stylesContent1_2, $this->getArrowByScore($result_first[3], $result_second[3])));
                $sheet->setCellValue('M' . $row_start,  $result_second[3])->getStyle('M' . $row_start)->applyFromArray($this->mergeArrayBackground($stylesContent1_3, $this->getArrowByScore($result_first[3], $result_second[3])));
                // GROUP 4

                $sheet->setCellValue('N' . $row_start, $result_first[4])->getStyle('N' . $row_start)->applyFromArray($this->mergeArrayBackground($stylesContent1_1, $this->getArrowByScore($result_first[4], $result_second[4])));
                $sheet->setCellValue('O' . $row_start, $this->getArrowByScore($result_first[4], $result_second[4]))->getStyle('O' . $row_start)->applyFromArray($this->mergeArrayBackground($stylesContent1_2, $this->getArrowByScore($result_first[4], $result_second[4])));
                $sheet->setCellValue('P' . $row_start,  $result_second[4])->getStyle('P' . $row_start)->applyFromArray($this->mergeArrayBackground($stylesContent1_3, $this->getArrowByScore($result_first[4], $result_second[4])));

                // GROUP 5
                $sheet->setCellValue('Q' . $row_start, $result_first[5])->getStyle('Q' . $row_start)->applyFromArray($this->mergeArrayBackground($stylesContent1_1, $this->getArrowByScore($result_first[5], $result_second[5])));
                $sheet->setCellValue('R' . $row_start, $this->getArrowByScore($result_first[5], $result_second[5]))->getStyle('R' . $row_start)->applyFromArray($this->mergeArrayBackground($stylesContent1_2, $this->getArrowByScore($result_first[5], $result_second[5])));
                $sheet->setCellValue('S' . $row_start,  $result_second[5])->getStyle('S' . $row_start)->applyFromArray($this->mergeArrayBackground($stylesContent1_3, $this->getArrowByScore($result_first[5], $result_second[5])));
                // GROUP 6
                $sheet->setCellValue('T' . $row_start, $result_first[6])->getStyle('T' . $row_start)->applyFromArray($this->mergeArrayBackground($stylesContent1_1, $this->getArrowByScore($result_first[6], $result_second[6])));
                $sheet->setCellValue('U' . $row_start, $this->getArrowByScore($result_first[6], $result_second[6]))->getStyle('U' . $row_start)->applyFromArray($this->mergeArrayBackground($stylesContent1_2, $this->getArrowByScore($result_first[6], $result_second[6])));
                $sheet->setCellValue('V' . $row_start,  $result_second[6])->getStyle('V' . $row_start)->applyFromArray($this->mergeArrayBackground($stylesContent1_3, $this->getArrowByScore($result_first[6], $result_second[6])));

                // GROUP 7
                $sheet->setCellValue('W' . $row_start, $result_first[7])->getStyle('W' . $row_start)->applyFromArray($this->mergeArrayBackground($stylesContent1_1, $this->getArrowByScore($result_first[7], $result_second[7])));
                $sheet->setCellValue('X' . $row_start, $this->getArrowByScore($result_first[7], $result_second[7]))->getStyle('X' . $row_start)->applyFromArray($this->mergeArrayBackground($stylesContent1_2, $this->getArrowByScore($result_first[7], $result_second[7])));
                $sheet->setCellValue('Y' . $row_start,  $result_second[7])->getStyle('Y' . $row_start)->applyFromArray($this->mergeArrayBackground($stylesContent1_3, $this->getArrowByScore($result_first[7], $result_second[7])));

                // GROUP 8
                $sheet->setCellValue('Z' . $row_start, $result_first[8])->getStyle('Z' . $row_start)->applyFromArray($this->mergeArrayBackground($stylesContent1_1, $this->getArrowByScore($result_first[8], $result_second[8])));
                $sheet->setCellValue('AA' . $row_start, $this->getArrowByScore($result_first[8], $result_second[8]))->getStyle('AA' . $row_start)->applyFromArray($this->mergeArrayBackground($stylesContent1_2, $this->getArrowByScore($result_first[8], $result_second[8])));
                $sheet->setCellValue('AB' . $row_start,  $result_second[8])->getStyle('AB' . $row_start)->applyFromArray($this->mergeArrayBackground($stylesContent1_3, $this->getArrowByScore($result_first[8], $result_second[8])));
            }
            $writer = new Xlsx($spreadsheet);
            $writer->save('Summary_result_No_1_2.xlsx');
            return response()->json([
                'status' => "OK"
            ]);
        }
    }
    public function calcSummary($data)
    {
        $group_1 = array_filter($data,  function ($e) {
            return $e['question_group_id'] == 1;
        });
        $group_2 = array_filter($data,  function ($e) {
            return $e['question_group_id'] == 2;
        });
        $group_3 = array_filter($data,  function ($e) {
            return $e['question_group_id'] == 3;
        });
        $group_4 = array_filter($data,  function ($e) {
            return $e['question_group_id'] == 4;
        });
        $group_5 = array_filter($data,  function ($e) {
            return $e['question_group_id'] == 5;
        });
        $group_6 = array_filter($data,  function ($e) {
            return $e['question_group_id'] == 6;
        });
        $group_7 = array_filter($data,  function ($e) {
            return $e['question_group_id'] == 7;
        });
        $group_8 = array_filter($data,  function ($e) {
            return $e['question_group_id'] == 8;
        });

        $group_1_score  = $this->calAVG($group_1, GROUP_1);
        $group_2_score  = $this->calAVG($group_2, GROUP_2);
        $group_3_score  = $this->calAVG($group_3, GROUP_3);
        $group_4_score  = $this->calAVG($group_4, GROUP_4);
        $group_5_score  = $this->calAVG($group_5, GROUP_5);
        $group_6_score  = $this->calAVG($group_6, GROUP_6);
        $group_7_score  = $this->calAVG($group_7, GROUP_7);
        $group_8_score  = $this->calAVG($group_8, GROUP_8);

        $total_avg = round(array_sum(array(
            $group_1_score,
            $group_2_score,
            $group_3_score,
            $group_4_score,
            $group_5_score,
            $group_6_score,
            $group_7_score,
            $group_8_score,
        )) / 8, 1);

        return array(
            $total_avg,
            $group_1_score,
            $group_2_score,
            $group_3_score,
            $group_4_score,
            $group_5_score,
            $group_6_score,
            $group_7_score,
            $group_8_score,
        );
    }


    public function calAVG($data, $group)
    {
        $MAX_POINT = 0;
        switch ($group) {
            case GROUP_1:
                $MAX_POINT = 25;
                break;
            case GROUP_2:
                $MAX_POINT = 5;
                break;
            case GROUP_3:
                $MAX_POINT = 33.3;
                break;
            case GROUP_4:
                $MAX_POINT = 7.1;
                break;
            case GROUP_5:
                $MAX_POINT = 20;
                break;
            case GROUP_6:
                $MAX_POINT = 14.3;
                break;
            case GROUP_7:
                $MAX_POINT = 12.5;
                break;
            case GROUP_8:
                $MAX_POINT = 10;
                break;
            default:
                # code...
                break;
        }

        $Point_per_item = $MAX_POINT / 6;
        $score = 0;
        foreach ($data as $key => $value) {
            $score = $score + $value['level_id'] * $Point_per_item;
        }
        if ($score >= 100) {
            $score = 100;
        }

        return round($score, 1);
    }

    public function getBackgroundOfName($currentIndex, $array)
    {
        $styles = [
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => [
                    'argb' => 'fff2cc',
                ],
            ],
            'font' => [
                'bold' => true,
            ],
            'borders' => [
                'outline' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => 'd1d1d1'],
                ],
            ],
        ];
        if (in_array($currentIndex, $array)) {
            return $styles;
        }
        return [];
    }

    public function mergeArrayBackgroundByIndex($origin, $current_index, $vn_index, $avg_index)
    {
        $stylesBlue = [
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => [
                    'argb' => 'cfe2f3',
                ],
            ]
        ];
        $stylesPink = [
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => [
                    'argb' => 'f4cccc',
                ],
            ]
        ];
        $stylesYellow = [
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => [
                    'argb' => 'fff2cc',
                ],
            ]
        ];

        if ($current_index < $avg_index && $current_index !== $vn_index) {
            return array_merge($origin, $stylesBlue);
        }
        if ($current_index > $avg_index && $current_index !== $vn_index) {
            return array_merge($origin, $stylesPink);
        }
        if ($current_index == $avg_index || $current_index == $vn_index) {
            return array_merge($origin, $stylesYellow);
        }
        return $origin;
    }
    public function mergeArrayBackgroundByValue($origin, $current_value, $vn_value, $avg_value, $current_index, $vn_index, $avg_index)
    {
        $stylesBlue = [
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => [
                    'argb' => 'cfe2f3',
                ],
            ]
        ];
        $stylesPink = [
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => [
                    'argb' => 'f4cccc',
                ],
            ]
        ];
        $stylesYellow = [
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => [
                    'argb' => 'fff2cc',
                ],
            ]
        ];
        if ($current_value > $avg_value && $current_value !== $vn_value) {
            return array_merge($origin, $stylesBlue);
        }
        if ($current_value < $avg_value && $current_value !== $vn_value) {
            return array_merge($origin, $stylesPink);
        }
        if ($current_value == $avg_value && $current_index !== $avg_index) {
            return array_merge($origin, $stylesBlue);
        }
        if ($current_value == $avg_value  || $current_value == $vn_value) {
            return array_merge($origin, $stylesYellow);
        }
        return $origin;
    }

    function getArrowByScore($first, $second)
    {
        if ($first > $second) return  ARROW_DOWN;
        if ($first == $second) return  ARROW_RIGHT;
        if ($first < $second) return  ARROW_UP;
    }

    public function mergeArrayBackground($origin, $condition)
    {
        $stylesIncrease = [
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => [
                    'argb' => '7FFFD4',
                ],
            ]
        ];
        $stylesDecrease = [
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => [
                    'argb' => 'FFFF00',
                ],
            ]
        ];

        if ($condition == ARROW_UP) {
            return array_merge($origin, $stylesIncrease);
        }
        if ($condition == ARROW_DOWN) {
            return array_merge($origin, $stylesDecrease);
        }
        return $origin;
    }

    function deleteDirectory($dir)
    {
        if (!file_exists($dir)) {
            return true;
        }

        if (!is_dir($dir)) {
            return unlink($dir);
        }

        foreach (scandir($dir) as $item) {
            if ($item == '.' || $item == '..') {
                continue;
            }

            if (!$this->deleteDirectory($dir . DIRECTORY_SEPARATOR . $item)) {
                return false;
            }
        }

        return rmdir($dir);
    }
}
