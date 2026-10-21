<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAuditLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'action' => 'required|string',
            'date_action' => 'required|date',
            'utilisateur' => 'required|string',
            'description' => 'required|string',
            'user_id' => 'required|exists:users,id',
        ];
    }
}
