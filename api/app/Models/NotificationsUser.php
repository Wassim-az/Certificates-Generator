<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class NotificationsUser extends Pivot
{
    protected $table = 'notification_user';

    protected $fillable = [
        'notification_id',
        'user_id',
        'is_read',
        'read_at',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'read_at' => 'datetime',
    ];

    /**
     * Relation vers la notification
     */
    public function notification()
    {
        return $this->belongsTo(Notification::class, 'notification_id');
    }

    /**
     * Relation vers l'utilisateur
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
