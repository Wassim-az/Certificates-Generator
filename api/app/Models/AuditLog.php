<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use HasFactory;
    protected $table = 'audit_logs';

    protected $fillable = [
        'action',
        'date_action',
        'utilisateur',
        'description',
        'administrateur_id'
    ];
    public function user()
{
    return $this->belongsTo(User::class);
}


    

}
