<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modification d'utilisateur</title>
</head>
<body>
    <h1>Modification d'utilisateur</h1>

    <form method="post" action="{{ route('utilisateur.update', $utilisateur->id) }}">
        @csrf
        @method('PUT')

        <div>
            <input type="text" name="nom" placeholder="Nom" value="{{ $utilisateur->nom }}">
        </div>
        <div>
            <input type="text" name="numero" placeholder="Numéro" value="{{ $utilisateur->numero }}">
        </div>
        <div>
            <input type="submit" value="Modifier utilisateur">
        </div>
    </form>
</body>
</html>
