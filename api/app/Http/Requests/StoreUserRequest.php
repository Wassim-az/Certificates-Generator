<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Autorise la requête (tu peux ajouter des règles ici si besoin)
    }

    public function rules(): array
    {
        return [
            'CIN' => ['required', 'string', 'max:10', 'regex:/^[A-Z]{1,2}[0-9]{4,6}$/', 'unique:users,cin'],
            'nom' => ['required', 'string', 'max:255', 'regex:/^[\pL\s\-]+$/u'],
            'prenom' => ['required', 'string', 'max:255', 'regex:/^[\pL\s\-]+$/u'],
            'login' => 'required|string|max:255|unique:users,login',
            'Date_Naiisance' => 'required|date|before:today',
            'Telephone' => ['required', 'string', 'regex:/^(?:\+212|0)[5-7][0-9]{8}$/', 'unique:users,telephone'],
            'sexe' => 'required|in:homme,femme',
            'date_embauche' => 'required|date|after:Date_Naiisance',
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Ou 'image' si upload de fichier
            'role_id' => 'required|exists:roles,id',
            'departement_user' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', 'string', 'min:6', ],
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
