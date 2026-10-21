<?php
namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Http\Requests\StoreAuditLogRequest;
use App\Http\Requests\UpdateAuditLogRequest;

class auditController extends Controller
{
    public function index()
    {
        return response()->json(AuditLog::with('user')->get());
    }

    public function store(StoreAuditLogRequest $request)
    {
        $log = AuditLog::create($request->validated());

        return response()->json(['message' => 'Log créé', 'log' => $log]);
    }

    public function show(AuditLog $auditLog)
    {
        return response()->json($auditLog->load('user'));
    }

    public function update(UpdateAuditLogRequest $request, AuditLog $auditLog)
    {
        $auditLog->update($request->validated());

        return response()->json(['message' => 'Log mis à jour', 'log' => $auditLog]);
    }

    public function destroy(AuditLog $auditLog)
    {
        $auditLog->delete();

        return response()->json(['message' => 'Log supprimé']);
    }
}
