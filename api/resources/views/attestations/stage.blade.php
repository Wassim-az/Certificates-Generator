<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Attestation de Stage</title>
    <style>
        body {
            font-family: "Times New Roman", serif;
            margin: 50px;
            line-height: 1.6;
        }
        h1 {
            text-align: center;
            text-transform: uppercase;
            text-decoration: underline;
            margin-bottom: 40px;
        }
        p {
            text-align: justify;
        }
        .signature {
            margin-top: 60px;
        }
    </style>
</head>
<body>

    <h1>ATTESTATION DE STAGE</h1>

    <p>
        Je soussigné(e), 
        <strong>{{ $responsable->nom }} {{ $responsable->prenom }}</strong>, 
        <strong>{{ $responsable->role->nom ?? 'Responsable RH' }}</strong>, atteste que :
    </p>

    <p>
        L'étudiant(e) : 
        <strong>{{ $stagiaire->nom }} {{ $stagiaire->prenom }}</strong><br>
        Établissement : 
        <strong>{{ $stagiaire->etablissement ?? 'Nom de l\'école' }}</strong><br>
        A effectué un stage du 
        <strong>{{ $demande->date_debut->format('d/m/Y') }}</strong> 
        au 
        <strong>{{ $demande->date_fin->format('d/m/Y') }}</strong> 
        au sein de notre entreprise.
    </p>

    <p>
        Durée : 
        <strong>{{ $demande->duree_jours }} jours</strong><br>
        Service : 
        <strong>{{ $stagiaire->departement_user }}</strong><br>
        <!-- Encadrant : 
        <strong>{{ $stagiaire->encadrant ?? 'Nom du tuteur' }}</strong> -->
    </p>

    <p>
        Fait à 
        <strong>Casablanca</strong>, 
        le 
        <strong>{{ now()->format('d/m/Y') }}</strong>
    </p>

    <div class="signature">
        Signature :<br><br><br>
        _________________________<br>
        {{ $responsable->nom }} {{ $responsable->prenom }}
    </div>

</body>
</html>
