<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\User;

class StoreDemandeAttestationRequest extends FormRequest
{
    public function authorize()
    {
        return true; // ou ta logique d'auth si tu veux
    }

    public function rules()
    {
        return [
            'user_id' => 'required|exists:users,id',
            'type_attestation' => 'required|string|in:travail,stage,projet,demande_conge',
            'commentaire' => 'nullable|string',
            'date_debut' => 'nullable|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $user = User::find($this->user_id);
            if (!$user) {
                $validator->errors()->add('user_id', 'Utilisateur invalide.');
                return;
            }
            // Règles métier : stagiaire interdit attestation travail
            if ($user->role->nom === 'stagiaire' && $this->type_attestation === 'travail') {
                $validator->errors()->add('type', 'Un stagiaire ne peut pas demander une attestation de travail.');
            }

            // employé interdit attestation stage
            if ($user->role->nom === 'employe' && $this->type_attestation === 'stage') {
                $validator->errors()->add('type', 'Un employé ne peut pas demander une attestation de stage.');
            }
        });
    }
}
