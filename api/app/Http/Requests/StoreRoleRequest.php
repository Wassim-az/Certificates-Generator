<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRoleRequest extends FormRequest
{
    public function authorize()
    {
        return true; // ou gérer la logique d'autorisation
    }

    public function rules()
    {
        return [
            'nom' => 'required|string|max:255|unique:roles,nom',
        ];
    }
}
