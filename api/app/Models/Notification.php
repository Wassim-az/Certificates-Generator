<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;
    protected $table = 'notifications';

    protected $fillable = [
        'type_notification',
        'date_envoi',
        'statut',
        'message',
        'demande_id'
    ];

    public function demande()
    {
        return $this->belongsTo(DemandeAttestation::class, 'demande_id');
    }
    public function destinataires()
{
    return $this->hasMany(NotificationsUser::class);
}


    


}
