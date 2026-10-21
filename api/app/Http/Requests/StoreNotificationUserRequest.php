<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreNotificationUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'notification_id' => 'required|exists:notifications,id',
            'user_id' => 'required|exists:users,id',
            'is_read' => 'sometimes|boolean',
            'read_at' => 'nullable|date',
        ];
    }
}
