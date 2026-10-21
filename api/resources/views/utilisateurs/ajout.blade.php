<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ajout d'utilisateur</title>
</head>
<body>
    <h1>Ajout d'utilisateur</h1>

    <form method="post" action="{{ route('utilisateur.liste') }}">
        @csrf
        <div>
            <input type="text" name="nom" placeholder="Nom">
        </div>
        <div>
            <input type="text" name="numero" placeholder="Numéro">
        </div>
        <div>
            <input type="submit" value="Ajouter nouveau utilisateur">
        </div>
    </form>
</body>
</html>
