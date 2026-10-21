<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Statut de votre demande</title>
</head>
<body>
    <p>Bonjour {{ $user->nom }},</p>

    <p>Votre demande d'attestation ({{ $demande->type_attestation }}) a été <strong>{{ $demande->decision }}</strong>.</p>

    @if($demande->attestation && $demande->attestation->lien_pdf)
        <p>
        Vous pouvez télécharger votre attestation ici : 
        <a href="{{ asset('storage/'.$demande->attestation->lien_pdf) }}">Lien vers l'attestation</a>
        </p>
    @else
        <p>Votre attestation est en cours de génération. Vous recevrez un nouveau mail lorsqu'elle sera disponible.</p>
    @endif

    <p>
        <a href="http://localhost:3000/mes-attestations">Voir ma demande</a>
    </p>

    <p>Merci,<br>L'équipe RH</p>
</body>
</html>
