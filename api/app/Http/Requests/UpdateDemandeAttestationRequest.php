<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDemandeAttestationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date_demande' => 'nullable|date',
            'statut' => 'nullable|integer|in:0,1,2',
            'motif_rejet' => 'nullable|string',
            'type_attestation' => 'nullable|string',
            'decision' => 'nullable|string|in:validée,rejetée,déléguée',
            'date_validation' => 'nullable|date',
            'commentaire' => 'nullable|string',
            'date_deleguation' => 'nullable|date',
            'validateur_id' => 'nullable|exists:users,id',
            'demandeur_id' => 'nullable|exists:users,id',
        ];
    }
}
