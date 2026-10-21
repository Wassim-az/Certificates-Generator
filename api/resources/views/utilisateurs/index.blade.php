<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h2>User</h2>
    <div>
        <table>
            <tr>
                <td>ID</td>
                <td>Nom</td>
                <td>Numero</td>
                <td></td>
                <td></td>
            </tr>
            @foreach ($utilisateurs as $utilisateur )
             <tr>
                <td>{{ $utilisateur->id }}</td>
                <td>{{ $utilisateur->nom }}</td>
                <td>{{ $utilisateur->numero }}</td>
                <td>
                   <a href="{{ route('utilisateur.modifier', ['utilisateur' => $utilisateur->id]) }}">Modifier</a>

                </td>
                <td>
                    <form method="post" action="{{ route('utilisateur.supprimer', ['utilisateur' => $utilisateur]) }}">
                        @csrf
                        @method('delete')
                        <input type="submit" value="supprimer">

                    </form>
                </td>
             </tr>
            @endforeach
        </table>
    </div>
</body>
</html>