<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    public function result()
    {
        return $this->belongsTo(ResultDetail::class, 'group', 'unique_group');
    }
}
