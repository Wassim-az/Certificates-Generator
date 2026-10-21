<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attestation extends Model
{
    use HasFactory;
    protected $table = 'attestations';

    protected $fillable = [
        'date_generation',
        'lien_pdf',
        'demande_id'
    ];

    public function user()
{
    return $this->belongsTo(User::class);
}

public function demande()
{
    return $this->belongsTo(DemandeAttestation::class);
}
public function demandeur()
{
    return $this->belongsTo(User::class, 'demandeur_id');
}


}
