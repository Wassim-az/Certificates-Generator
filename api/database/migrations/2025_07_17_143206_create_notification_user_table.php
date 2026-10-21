<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notification_user', function (Blueprint $table) {
            $table->id();

            // Les clés étrangères
            $table->foreignId('notification_id')->constrained('notifications')->onDelete('cascade');

            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Champs supplémentaires
            $table->boolean('is_read')->default(false); // lu ou pas
            $table->timestamp('read_at')->nullable();    // date de lecture si tu veux

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification_user');
    }
};
