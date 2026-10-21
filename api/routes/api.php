<?php
use App\Http\Controllers\AttestationController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\demandeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\notificationsController;
use App\Models\NotificationsUser;
use App\Models\DemandeAttestation;
use App\Services\MailService;

use App\Models\User;

// ✅ Routes publiques — PAS besoin de token
Route::post('/users', function () {
    return response()->json(['message' => 'Route POST /users accessible']);
});

Route::post('/login', [LoginController::class, 'login']);
Route::post('/demande-attestation', [demandeController::class, 'store']); // <- rendue publique
Route::get('/mes-attestations', [demandeController::class, 'mesAttestations']); // <- rendue publique si besoin
Route::get('/notifications/{user_id}', function ($user_id) {
    return NotificationsUser::with('notification')
        ->where('user_id', $user_id)
        ->latest()
        ->get();
});

// ✅ Routes protégées — BESOIN d’un token (auth:sanctum)

    Route::post('/logout', [LoginController::class, 'logout']);

    // Utilisateurs
    Route::apiResource('users', UserController::class);
    Route::get('/jours-restants/{id}', [UserController::class, 'getJoursRestants']);
    Route::get('/users/{id}', function($id) {
        $user = User::with(['attestations', 'notifications', 'role'])->find($id);
        return $user ?: response()->json(['message' => 'Utilisateur non trouvé'], 404);
    });

    // Rôles
    Route::apiResource('roles', RoleController::class);

    // Notifications protégées
    Route::patch('/notifications/{id}/mark-as-read', function ($id) {
        $notif = NotificationsUser::findOrFail($id);
        $notif->update(['is_read' => true, 'read_at' => now()]);
        return response()->json(['message' => 'Notification marquée comme lue.']);
    });
    Route::patch('/notifications/{userId}/mark-all-as-read', [notificationsController::class, 'markAllAsRead']);


    // Demandes d’attestation
    Route::prefix('demandes')->group(function () {
        Route::get('/', [demandeController::class, 'index']);
        Route::get('/{id}', [demandeController::class, 'show']);
        Route::put('/{id}', [demandeController::class, 'update']);
        Route::delete('/{id}', [demandeController::class, 'destroy']);
        Route::post('/{id}/valider', [demandeController::class, 'valider']);
        Route::post('/{id}/refuser', [demandeController::class, 'refuser']);
        Route::get('/a-valider/liste', [demandeController::class, 'demandesAValider']);
        Route::get('/historique/{validateur_id}', [demandeController::class, 'attestationsHistoriques']);
        Route::get('/mes_attestation/{user_id}', [demandeController::class, 'mesAttestations']);
    });


    Route::get('/attestations/en-attente', [demandeController::class, 'demandesAValider']);
    Route::get('/attestations/historique/{validateur_id}', [demandeController::class, 'attestationsHistoriques']);

    // Dans votre fichier de routes (Laravel par exemple)
    Route::get('/templates/{type}', function ($type) {
        $validTypes = ['stage', 'projet', 'travail', 'conge'];
        
        if (!in_array($type, $validTypes)) {
            return response()->json(['error' => 'Type invalide'], 404);
        }
        
        $path = storage_path("app/templates/{$type}.docx");  
        
        if (!file_exists($path)) {
            return response()->json(['error' => 'Modèle non trouvé'], 404);
        }
        
        return response()->download($path, "attestation_{$type}.docx");
    });

    Route::get('/attestation/{id}/download', [demandeController::class, 'downloadAttestation']);
    Route::post('/attestation/{id}/renvoyer', [attestationController::class, 'renvoyer']);
    // routes/api.php
Route::post('/demandes/{id}/renvoyer', [demandeController::class, 'renvoyerAttestation']);
Route::post('demandes/{id}/renvoyer', [demandeController::class, 'renvoyerAttestation']);
