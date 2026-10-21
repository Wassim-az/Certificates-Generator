<?php
namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('role')->get();
        return response()->json($users);
    }

    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        // dd($data);
        $data['password'] = Hash::make($data['password']);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('photos', 'public'); // photos = sous-dossier
            $data['photo'] = $path;
        }

        $user = User::create($data);

        return response()->json(['message' => 'Utilisateur créé', 'user' => $user]);
    }

    public function show($id)
    {
        $user = User::with(['role'])->find($id);

        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        return $user;
    }
    


    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }
        if ($request->hasFile('photo')) {
            // Stocker le fichier dans storage/app/public/photos
            $path = $request->file('photo')->store('photos', 'public');
            $data['photo'] = $path; // Enregistre uniquement le chemin relatif dans la DB
        }

        $user->update($data);

        return response()->json(['message' => 'Utilisateur mis à jour', 'user' => $user]);
    }

    public function destroy(User $user)
    {
        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé']);
    }
    public function getJoursRestants($id)
    {
        $user = User::findOrFail($id);
        return response()->json([
            'jours_restants' => $user->joursCongesRestants()
        ]);
    }

}
