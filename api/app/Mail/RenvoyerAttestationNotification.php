<?php
namespace App\Mail;

use App\Models\DemandeAttestation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RenvoyerAttestationNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $demande;
    public $filePath;

    public function __construct(DemandeAttestation $demande, $filePath)
    {
        $this->demande = $demande;
        $this->filePath = $filePath;
    }

    public function build()
    {
        return $this->subject("Voici votre attestation")
                    ->view('emails.demande.renvoi')
                    ->attach(storage_path('app/public/' . $this->filePath));
    }
}
