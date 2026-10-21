<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateNotificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type_notification' => 'required|string',
            'date_envoi' => 'required|date',
            'statut' => 'required|string|in:envoyée,lue,archivée',
            'message' => 'required|string',
            'demande_id' => 'required|exists:demande_attestations,id',
        ];
    }
}
