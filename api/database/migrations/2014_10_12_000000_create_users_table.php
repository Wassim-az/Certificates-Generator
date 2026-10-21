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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('CIN')->unique();
            $table->string('nom');
            $table->string('prenom');
            $table->string('login');
            $table->date('Date_Naiisance');
            $table->string('Telephone');
            $table->string('sexe');
            $table->date('date_embauche');
            $table->string('photo');
            $table->foreignId('role_id')->constrained('roles')->onDelete('cascade');
            $table->string('departement_user');
            $table->string('email')->unique();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
