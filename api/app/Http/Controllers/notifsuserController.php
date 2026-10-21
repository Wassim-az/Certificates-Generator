<?php
namespace App\Http\Controllers;

use App\Models\NotificationUser;
use App\Http\Requests\StoreNotificationUserRequest;
use App\Http\Requests\UpdateNotificationUserRequest;
use App\Models\NotificationsUser;

class notifsuserController extends Controller
{
    public function index()
    {
        return response()->json(NotificationsUser::with(['user', 'notification'])->get());
    }

    public function store(StoreNotificationUserRequest $request)
    {
        $notificationUser = NotificationsUser::create($request->validated());

        return response()->json(['message' => 'Notification attribuée à l\'utilisateur', 'data' => $notificationUser]);
    }

    public function show(NotificationsUser $notificationUser)
    {
        return response()->json($notificationUser->load(['user', 'notification']));
    }

    public function update(UpdateNotificationUserRequest $request, NotificationsUser $notificationUser)
    {
        $notificationUser->update($request->validated());

        return response()->json(['message' => 'Notification utilisateur mise à jour', 'data' => $notificationUser]);
    }

    public function destroy(NotificationsUser $notificationUser)
    {
        $notificationUser->delete();

        return response()->json(['message' => 'Notification utilisateur supprimée']);
    }
}
