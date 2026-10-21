<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Log;


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
    'CIN',
    'nom',
    'prenom',
    'Date_Naiisance',
    'Telephone',
    'sexe',
    'date_embauche',
    'photo',
    'role_id',
    'departement_user',
    'email',
    'login',
    'password',
];

public function role()
{
    return $this->belongsTo(Role::class);
}

public function attestations()
{
    return $this->hasManyThrough(
        Attestation::class,
        DemandeAttestation::class,
        'demandeur_id', // Clé étrangère dans demande_attestations
        'demande_id', // Clé étrangère dans attestations
        'id', // Local key sur User
        'id' // Local key sur DemandeAttestation
    );
}


public function demandes()
{
    return $this->hasMany(DemandeAttestation::class);
}

public function notifications()
{
    return $this->hasManyThrough(Notification::class, NotificationsUser::class, 'user_id', 'id', 'id', 'notification_id');
}

public function notificationsUser()
{
    return $this->hasMany(NotificationsUser::class);
}

public function joursCongesRestants()
{
    try {
        if (!$this->created_at) {
            throw new \Exception("La date de création de l'utilisateur est manquante");
        }

        $anneeDebut = $this->created_at->year;
        $anneeCourante = now()->year;
        $joursParAn = 25;

        // 📌 Cette année uniquement
        $joursPrisCetteAnnee = $this->demandesAttestations()
            ->where('statut', 1) // validées
            ->where('type_attestation', 'demande_conge')
            ->whereYear('date_debut', $anneeCourante)
            ->get()
            ->sum(function ($demande) {
                return $demande->duree_jours ?? 0;
            });

        $joursRestantsCetteAnnee = max($joursParAn - $joursPrisCetteAnnee, 0);

        // 📌 Années précédentes → report
        $joursReportes = 0;
        for ($annee = $anneeCourante - 1; $annee >= $anneeDebut; $annee--) {
            $joursPris = $this->demandesAttestations()
                ->where('statut', 1)
                ->where('type_attestation', 'demande_conge')
                ->whereYear('date_debut', $annee)
                ->get()
                ->sum(function ($demande) {
                    return $demande->duree_jours ?? 0;
                });

            $joursRestants = max($joursParAn - $joursPris, 0);
            $joursReportes += $joursRestants;
        }

        return [
            'jours_restant_cette_annee' => $joursRestantsCetteAnnee,
            'jours_reportes' => $joursReportes,
            'total_jours_restant' => $joursRestantsCetteAnnee + $joursReportes
        ];

    } catch (\Exception $e) {
        Log::error("Erreur dans joursCongesRestants: " . $e->getMessage());
        return [
            'jours_restant_cette_annee' => 0,
            'jours_reportes' => 0,
            'total_jours_restant' => 0
        ];
    }
}





    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}
