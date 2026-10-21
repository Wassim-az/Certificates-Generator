<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    /**
     * Simple login without session or token
     */
    public function login(Request $request)
    {
        // Valider les données
        $request->validate([
            'login' => 'required|string',
            'password' => 'required|string',
        ]);

        // Rechercher l'utilisateur avec le champ "login"
        $user = User::where('login', $request->login)->first();

        // Vérifier si l'utilisateur existe et si le mot de passe est correct
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Login ou mot de passe incorrect.'
            ], 401);
        }
        $user->load(('role'));

        // Retourner les infos de l'utilisateur
        return response()->json([
            'message' => 'Connexion réussie.',
            'user' => $user
        ]);
    }
}
