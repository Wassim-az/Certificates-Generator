<?php
namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;

class RoleController extends Controller
{
    // Liste tous les rôles
    public function index()
    {
        $roles = Role::all();
        return response()->json([
            'message' => 'Connexion réussie.',
            'role' => $roles
        ]);    }

    // Affiche le formulaire de création
    public function create()
    {
        return view('roles.create');
    }

    // Enregistre un nouveau rôle
    public function store(StoreRoleRequest $request)
{
    $role = Role::create($request->validated());
    return response()->json($role, 201);
}


    // Affiche un rôle spécifique
    public function show(Role $role)
    {
        return view('roles.show', compact('role'));
    }

    // Formulaire pour modifier un rôle
    public function edit(Role $role)
    {
        return view('roles.edit', compact('role'));
    }

    // Met à jour un rôle existant
    public function update(UpdateRoleRequest $request, Role $role)
    {
        $role->update($request->validated());
        return redirect()->route('roles.index')->with('success', 'Rôle mis à jour avec succès.');
    }

    // Supprime un rôle
    public function destroy(Role $role)
    {
        $role->delete();
        return redirect()->route('roles.index')->with('success', 'Rôle supprimé avec succès.');
    }
}
