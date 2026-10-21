<?php
namespace App\Http\Controllers;

use App\Models\DemandeAttestation;
use App\Http\Requests\StoreDemandeAttestationRequest;
use App\Http\Requests\UpdateDemandeAttestationRequest;
use Illuminate\Http\Request;
use App\Models\Notification;
use App\Models\Attestation;
use App\Models\NotificationsUser;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use App\Mail\DemandeStatusNotification;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Mail\RenvoyerAttestationNotification; // Nouveau Mailable

class demandeController extends Controller
{
    public function index()
    {
        try {
            $demandes = DemandeAttestation::with(['demandeur', 'validateur'])->get();
            return response()->json([
                'success' => true,
                'data' => $demandes
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des demandes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(StoreDemandeAttestationRequest $request)
    {
        try {
            // Création de la demande avec statut initial à 0
            $demande = DemandeAttestation::create([
                'demandeur_id' => $request->user_id,
                'type_attestation' => $request->type_attestation,
                'commentaire' => $request->commentaire,
                'date_demande' => now(),
                'statut' => 0, // 0 = en attente
                'date_debut' => $request->date_debut,
                'date_fin' => $request->date_fin,
            ]);

            // Charger les relations après création
            $demande->load(['demandeur', 'validateur']);

            // Création de la notification principale
            $notification = Notification::create([
                'type_notification' => 'demande_attestation',
                'date_envoi' => now(),
                'message' => "Nouvelle demande d'attestation (" . $demande->type_attestation . ") de " . $demande->demandeur->nom,
                'statut' => 'non lu',
                'demande_id' => $demande->id,
            ]);

            // Récupération des validateurs
            $validateurs = User::whereHas('role', function ($query) {
                $query->where('nom', 'validateur');
            })->get();

            // Création des notifications_user
            foreach ($validateurs as $validateur) {
                NotificationsUser::create([
                    'notification_id' => $notification->id,
                    'user_id' => $validateur->id,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Demande envoyée et notifications envoyées à tous les validateurs',
                'data' => $demande
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la demande',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            // Rechercher la demande par ID avec les relations
            $demandeAttestation = DemandeAttestation::with(['demandeur', 'validateur'])->find($id);

            if (!$demandeAttestation) {
                return response()->json([
                    'success' => false,
                    'message' => 'Demande d\'attestation non trouvée'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $demandeAttestation
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de la demande',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(UpdateDemandeAttestationRequest $request, $id)
    {
        try {
            $demandeAttestation = DemandeAttestation::find($id);

            if (!$demandeAttestation) {
                return response()->json([
                    'success' => false,
                    'message' => 'Demande d\'attestation non trouvée'
                ], 404);
            }

            $demandeAttestation->update($request->validated());
            $demandeAttestation->load(['demandeur', 'validateur']);

            return response()->json([
                'success' => true,
                'message' => 'Demande d\'attestation mise à jour',
                'data' => $demandeAttestation
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour de la demande',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function demandesAValider()
    {
        try {
            $demandes = DemandeAttestation::where('statut', 0)
                        ->with(['demandeur', 'validateur'])
                        ->orderBy('date_demande', 'desc')
                        ->get();

            return response()->json([
                'success' => true,
                'data' => $demandes->toArray() // Convertir explicitement en tableau
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des demandes à valider',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function attestationsHistoriques($validateur_id)
    {
        try {
            $attestations = DemandeAttestation::where('validateur_id', $validateur_id)
                            ->whereIn('statut', [1,2]) // 1 = validée, 2 = refusée
                            ->orderBy('date_demande', 'desc')
                            ->with('demandeur')
                            ->get();

            return response()->json([
                'success' => true,
                'data' => $attestations
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de l\'historique',
                'error' => $e->getMessage()
            ], 500);
        }
    }

   // Dans votre contrôleur Laravel
    public function mesAttestations($userId)
    {
        $attestations = DemandeAttestation::where('demandeur_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $attestations
        ]);
    }

    public function destroy($id)
    {
        try {
            $demandeAttestation = DemandeAttestation::find($id);

            if (!$demandeAttestation) {
                return response()->json([
                    'success' => false,
                    'message' => 'Demande d\'attestation non trouvée'
                ], 404);
            }

            $demandeAttestation->delete();

            return response()->json([
                'success' => true,
                'message' => 'Demande d\'attestation supprimée'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de la demande',
                'error' => $e->getMessage()
            ], 500);
        }
    }

   // Méthode pour valider une demande
public function valider(Request $request, $id)
{
    try {
        $demande = DemandeAttestation::with(['demandeur', 'attestation'])->findOrFail($id);

        $validateurId = $request->input('validateur_id');
        if (!$validateurId) {
            return response()->json(['success' => false, 'message' => 'ID du validateur manquant'], 400);
        }

        // Créez l'attestation PDF
        $attestation = Attestation::create([
            'date_generation' => now(),
            'lien_pdf' => $this->genererAttestation($demande), // la fonction ci-dessous
            'demande_id' => $demande->id,
        ]);

        // Mettre à jour la demande
        $demande->update([
            'statut' => 1,
            'validateur_id' => $validateurId,
            'decision' => 'validée',
            'date_validation' => now(),
            'attestation_id' => $attestation->id,
        ]);

        // Envoi du mail
        Mail::to($demande->demandeur->email)
            ->send(new DemandeStatusNotification($demande, $demande->demandeur));

        return response()->json([
            'success' => true,
            'message' => 'Demande validée avec succès'
        ]);

    } catch (\Exception $e) {
        Log::error("Erreur validation: ".$e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la validation',
            'error' => $e->getMessage()
        ], 500);
    }
}






    // Méthode pour refuser une demande
    public function refuser(Request $request, $id)
    {
        try {
            $request->validate([
                'motif_rejet' => 'nullable|string|max:500',
                'validateur_id' => 'required|integer'
            ]);

            $demande = DemandeAttestation::find($id);

            if (!$demande) {
                return response()->json([
                    'success' => false,
                    'message' => 'Demande non trouvée'
                ], 404);
            }

            $demande->update([
                'statut' => 2, // 2 = refusée
                'validateur_id' => $request->validateur_id,
                'decision' => 'refusée',
                'motif_rejet' => $request->motif_rejet,
                'date_validation' => now(),
            ]);

            $demande->load(['demandeur', 'validateur']);

            // Création de la notification pour le demandeur
            $notification = Notification::create([
                'type_notification' => 'demande_refusee',
                'date_envoi' => now(),
                'message' => "Votre demande d'attestation (" . $demande->type_attestation . ") a été refusée. Motif: " . $request->motif_rejet,
                'statut' => 'non lu',
                'demande_id' => $demande->id,
            ]);

            // Notification pour le demandeur
            NotificationsUser::create([
                'notification_id' => $notification->id,
                'user_id' => $demande->demandeur_id,
            ]);
            Mail::to($demande->demandeur->email)->send(
            new DemandeStatusNotification($demande, $demande->demandeur)
        );
            return response()->json([
                'success' => true,
                'message' => 'Demande refusée',
                'data' => $demande
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du refus',
                'error' => $e->getMessage()
            ], 500);
        }
    }

private function genererAttestation($demande)
{
    $user = $demande->demandeur;

    $filename = 'attestation_'.$demande->id.'_'.time().'.pdf';
    $path = 'attestations/'.$filename;

    if (!Storage::disk('public')->exists('attestations')) {
        Storage::disk('public')->makeDirectory('attestations');
    }

    $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('emails.demande.status', [
        'demande' => $demande,
        'user' => $user
    ]);

    Storage::disk('public')->put($path, $pdf->output());

    return $path;
}




public function downloadAttestation($id)
{
    $demande = DemandeAttestation::with(['demandeur', 'validateur'])->findOrFail($id);

    $stagiaire = $demande->demandeur;
    $responsable = $demande->validateur ?? $stagiaire; // Ou un responsable par défaut
    $ville = "Casablanca";

    $phpWord = new PhpWord();
    $section = $phpWord->addSection();
    $section->addText("ATTESTATION DE STAGE", ['bold' => true, 'size' => 16], ['align' => 'center']);
    $section->addTextBreak(2);

    $section->addText("Je soussigné(e), {$responsable->nom} {$responsable->prenom}, atteste que :");
    $section->addText("L'étudiant(e) : {$stagiaire->nom} {$stagiaire->prenom}");
    $section->addText("Service : {$stagiaire->departement_user}");
    $section->addText(
        "A effectué un stage du " . optional($demande->date_debut)->format('d/m/Y') .
        " au " . optional($demande->date_fin)->format('d/m/Y')
    );
    $section->addText("Durée : {$demande->duree_jours} jours");
    $section->addTextBreak();
    $section->addText("Fait à {$ville}, le " . now()->format('d/m/Y'));
    $section->addTextBreak(3);
    $section->addText("Signature : ________________________");

    $fileName = "attestation_{$demande->id}.docx";
    $tempPath = storage_path($fileName);

    $writer = IOFactory::createWriter($phpWord, 'Word2007');
    $writer->save($tempPath);

    return response()->download($tempPath)->deleteFileAfterSend(true);
}




public function renvoyerAttestation(Request $request, $id)
{
    $request->validate([
        'file' => 'required|file|mimes:pdf,doc,docx|max:10240', // max 10MB
    ]);

    $demande = DemandeAttestation::with('demandeur')->findOrFail($id);

    $file = $request->file('file');
    $filename = 'renvoi_attestation_'.$demande->id.'_'.time().'.'.$file->getClientOriginalExtension();
    $path = $file->storeAs('attestations', $filename, 'public');

    // Envoyer l'email avec le fichier en pièce jointe
    Mail::to($demande->demandeur->email)->send(new RenvoyerAttestationNotification($demande, $path));

    return response()->json([
        'success' => true,
        'message' => 'Fichier renvoyé et email envoyé avec succès'
    ]);
}



}
    