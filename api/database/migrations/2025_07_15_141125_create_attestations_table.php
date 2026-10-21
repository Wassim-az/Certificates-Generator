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
                Schema::create('attestations', function (Blueprint $table) {
            $table->id();
            $table->date('date_generation');
            $table->string('lien_pdf');
            $table->unsignedBigInteger('demande_id');

            $table->foreign('demande_id')->references('id')->on('demande_attestations')->onDelete('cascade');
            $table->timestamps();
        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attestations');
    }
};
