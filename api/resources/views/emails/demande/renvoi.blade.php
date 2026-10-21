<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Votre attestation</title>
</head>
<body>
    <p>Bonjour {{ $demande->demandeur->nom }},</p>

    <p>Voici votre attestation que vous avez demandée. Vous la trouverez en pièce jointe.</p>

    <p>Merci,<br>L'équipe RH</p>
</body>
</html>
