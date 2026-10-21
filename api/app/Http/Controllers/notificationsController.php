<?php
namespace App\Http\Controllers;

use App\Models\Notification;
use App\Http\Requests\StoreNotificationRequest;
use App\Http\Requests\UpdateNotificationRequest;

class notificationsController extends Controller
{
    public function index()
    {
        return response()->json(Notification::with('demande')->get());
    }

    
    public function store(StoreNotificationRequest $request)
    {
        $notification = Notification::create($request->validated());

        return response()->json(['message' => 'Notification créée', 'notification' => $notification]);
    }

    public function show(Notification $notification)
    {
        return response()->json($notification->load('demande'));
    }

    public function update(UpdateNotificationRequest $request, Notification $notification)
    {
        $notification->update($request->validated());

        return response()->json(['message' => 'Notification mise à jour', 'notification' => $notification]);
    }

    public function destroy(Notification $notification)
    {
        $notification->delete();

        return response()->json(['message' => 'Notification supprimée']);
    }
    public function markAllAsRead($userId)
    {
        try {
            \App\Models\NotificationsUser::where('user_id', $userId)
                ->where('is_read', false)
                ->update(['is_read' => true]);

            return response()->json(['success' => true, 'message' => 'Toutes les notifications ont été marquées comme lues.']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur : ' . $e->getMessage()], 500);
        }
    }

}
