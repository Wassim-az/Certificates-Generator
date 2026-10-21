<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class DemandeAttestation extends Model
{
    use HasFactory;

    protected $table = 'demande_attestations'; // Assurez-vous que le nom de la table est correct

    protected $fillable = [
        'demandeur_id',
        'validateur_id',
        'type_attestation',
        'commentaire',
        'date_demande',
        'statut',
        'decision',
        'motif_rejet',
        'date_debut',
        'date_fin',
        'date_validation',
    ];

    protected $casts = [
        'date_demande' => 'datetime',
        'date_debut' => 'date',
        'date_fin' => 'date',
        'date_validation' => 'datetime',
    ];

    // Relation avec le demandeur (User)
    public function demandeur()
    {
        return $this->belongsTo(User::class, 'demandeur_id');
    }

    // Relation avec le validateur (User)
    public function validateur()
    {
        return $this->belongsTo(User::class, 'validateur_id');
    }
    public function attestation()
{
    return $this->belongsTo(Attestation::class);
}

    // Accesseur pour le statut en texte
    public function getStatutTextAttribute()
    {
        switch ($this->statut) {
            case 0:
                return 'En attente';
            case 1:
                return 'Validée';
            case 2:
                return 'Refusée';
            default:
                return 'Inconnu';
        }
    }

    public function getDureeJoursAttribute()
    {
        if ($this->date_debut && $this->date_fin) {
            return Carbon::parse($this->date_debut)->diffInDays(Carbon::parse($this->date_fin)) + 1;
        }
        return 0;
    }

    // Scope pour les demandes en attente
    public function scopeEnAttente($query)
    {
        return $query->where('statut', 0);
    }

    // Scope pour les demandes validées
    public function scopeValidees($query)
    {
        return $query->where('statut', 1);
    }

    // Scope pour les demandes refusées
    public function scopeRefusees($query)
    {
        return $query->where('statut', 2);
    }
}