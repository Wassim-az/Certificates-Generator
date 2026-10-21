<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('user')->id ?? null;; // Si route model binding sinon 'id'

        return [
            'CIN' => ['nullable', 'string', 'max:10', 'regex:/^[A-Z]{1,2}[0-9]{4,6}$/', 'unique:users,cin'],
            'nom' => ['nullable', 'string', 'max:255', 'regex:/^[\pL\s\-]+$/u'],
            'prenom' => ['nullable', 'string', 'max:255', 'regex:/^[\pL\s\-]+$/u'],
            'login' => 'nullable|string|max:255|unique:users,login',
            'Date_Naiisance' => 'nullable|date|before:today',
            'Telephone' => ['nullable', 'string', 'regex:/^(?:\+212|0)[5-7][0-9]{8}$/', 'unique:users,telephone'],
            'sexe' => 'nullable|in:homme,femme',
            'date_embauche' => 'nullable|date|after:Date_Naiisance',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Ou 'image' si upload de fichier
            'role_id' => 'nullable|exists:roles,id',
            'departement_user' => 'nullable|string',
            'email' => 'nullable|email|unique:users,email',
            'password' => ['nullable', 'string', 'min:6',],
        ];
    }
    public function messages()
    {
        return [
            'CIN.unique' => 'Ce CIN est déjà utilisé.',
            'CIN.regex' => 'Le CIN doit être au format marocain (ex: AB123456).',
            'nom.regex' => 'Le nom ne doit contenir que des lettres.',
            'prenom.regex' => 'Le prénom ne doit contenir que des lettres.',
            'login.unique' => 'Ce login est déjà pris.',
            'telephone.unique' => 'Ce numéro de téléphone est déjà utilisé.',
            'telephone.regex' => 'Le numéro de téléphone doit être un numéro marocain valide.',
            'email.unique' => 'Cet email est déjà utilisé.',
            'Date_Naiisance.before' => 'La date de naissance doit être antérieure à aujourd\'hui.',
            'date_embauche.after' => 'La date d\'embauche doit être postérieure à la date de naissance.',
        ];
    }
}
