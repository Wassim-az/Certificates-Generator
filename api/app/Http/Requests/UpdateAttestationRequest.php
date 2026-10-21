<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAttestationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date_generation' => 'required|date',
            'lien_pdf' => 'required|string',
            'demande_id' => 'required|exists:demande_attestations,id',
        ];
    }
}
