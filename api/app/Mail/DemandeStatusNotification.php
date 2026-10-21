<?php
namespace App\Mail;

use App\Models\DemandeAttestation;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class DemandeStatusNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $demande;
    public $user;

    public function __construct(DemandeAttestation $demande, User $user)
    {
        $this->demande = $demande;
        $this->user = $user;
    }

    public function build()
    {
        return $this->subject("Statut de votre demande")
                    ->view('emails.demande.status') // Blade classique
                    ->with([
                        'demande' => $this->demande,
                        'user' => $this->user
                    ]);
    }
}
