<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    // Table associée (optionnel si le nom est "roles")
    protected $table = 'roles';

    // Champs modifiables en masse
    protected $fillable = [
        'nom',
    ];
    public function users()
{
    return $this->hasMany(User::class);
}

}
