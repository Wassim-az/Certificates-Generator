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
        Schema::create('audit_logs', function (Blueprint $table) {
    $table->id('id_audit_log');
    $table->string('action');
    $table->dateTime('date_action');
    $table->string('utilisateur');
    $table->text('description');
    $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
    $table->timestamps();
});


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
