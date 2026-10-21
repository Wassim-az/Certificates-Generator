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
        Schema::create('demande_attestations', function (Blueprint $table) {
    $table->id();
    $table->date('date_demande');
    $table->string('statut');
    $table->text('motif_rejet')->nullable();
    $table->string('type_attestation');
    $table->string('decision')->nullable();
    $table->date('date_validation')->nullable();
    $table->text('commentaire')->nullable();
    $table->date('date_deleguation')->nullable();
    
    $table->foreignId('validateur_id')->nullable()->constrained('users')->onDelete('cascade');
    $table->foreignId('demandeur_id')->constrained('users')->onDelete('cascade');

    $table->timestamps();
});


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('demande_attestations');
    }
};
