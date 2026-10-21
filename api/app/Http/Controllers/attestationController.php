<?php
namespace App\Http\Controllers;

use App\Models\Attestation;
use App\Http\Requests\StoreAttestationRequest;
use App\Http\Requests\UpdateAttestationRequest;
use App\Models\DemandeAttestation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\DemandeStatusNotification;
use Illuminate\Support\Facades\Log;

class AttestationController extends Controller
{
    public function index()
    {
        return response()->json(Attestation::all());
    }

    public function store(StoreAttestationRequest $request)
    {
        $attestation = Attestation::create($request->validated());

        return response()->json(['message' => 'Attestation créée', 'attestation' => $attestation]);
    }

    public function show(Attestation $attestation)
    {
        return response()->json($attestation);
    }

    public function update(UpdateAttestationRequest $request, Attestation $attestation)
    {
        $attestation->update($request->validated());

        return response()->json(['message' => 'Attestation mise à jour', 'attestation' => $attestation]);
    }

    public function destroy(Attestation $attestation)
    {
        $attestation->delete();

        return response()->json(['message' => 'Attestation supprimée']);
    }

    public function renvoyer($id, Request $request)
{
     try {
        $demande = DemandeAttestation::with('demandeur')->findOrFail($id);
        
        $request->validate([
            'file' => 'required|file|mimes:pdf,docx|max:2048'
        ]);

        // Stocker le fichier
        $path = $request->file('file')->store('public/attestations');
        $publicPath = str_replace('public/', '', $path);

        // Mettre à jour ou créer l'attestation
        $attestation = Attestation::updateOrCreate(
            ['demande_id' => $id],
            [
                'date_generation' => now(),
                'lien_pdf' => $publicPath,
            ]
        );

        // Mettre à jour la demande
        $demande->update([
            'statut' => 1,
            'decision' => 'validée',
            'date_validation' => now(),
        ]);

        // Envoyer le mail avec le lien
        Mail::to($demande->demandeur->email)
            ->send(new DemandeStatusNotification($demande, $demande->demandeur));

        return response()->json([
            'success' => true,
            'message' => 'Attestation renvoyée et mail envoyé',
            'path' => asset('storage/'.$publicPath)
        ]);

    } catch (\Exception $e) {
        Log::error("Erreur renvoi attestation: ".$e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors du renvoi',
            'error' => $e->getMessage()
        ], 500);
    }
}
}
