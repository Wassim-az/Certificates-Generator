import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import engineerImage from '../images/login-pic.jpeg';


export default function Connexion() {
    const [login, setLogin] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [erreur, setErreur] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login', {
                login: login,
                password: motDePasse
            });
            

            const user = response.data.user;

            // Vérifie si l'utilisateur est administrateur
            if (user.role.nom === 'administrateur') {
                    // Stocke le token
                localStorage.setItem('token', response.data.token);

                // Stocke l'id de l'utilisateur connecté
                localStorage.setItem('user_id', user.id);
                navigate('/admin/employes');
            } else if (user.role.nom === 'stagiaire' || user.role.nom === 'employe') {
                    // Stocke le token
                localStorage.setItem('token', response.data.token);

                // Stocke l'id de l'utilisateur connecté
                localStorage.setItem('user_id', user.id);
                navigate('/employe'); // Menu employé/stagiaire
            } else if (user.role.nom === 'validateur') {
                // Stocke le token
                localStorage.setItem('token', response.data.token);

                // Stocke l'id de l'utilisateur connecté
                localStorage.setItem('user_id', user.id);
                navigate('/validateur'); // Par défaut (ou tu peux gérer d'autres rôles ici si besoin)
            }

        } catch (err) {
            if (err.response && err.response.status === 401) {
                setErreur(err.response.data.message);
            } else {
                setErreur('Une erreur est survenue. Veuillez réessayer.');
            }
        }
            const response = await axios.post('http://127.0.0.1:8000/api/login', {
            login: login,  // ou 'login' selon ton backend
            password: motDePasse
            });

            const user = response.data.user;

            
    };



    return (
        <div className="min-h-screen flex bg-gray-900">
            {/* Partie gauche - Formulaire */}
            <div className="w-1/2 flex items-center justify-center p-12">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Content de vous revoir</h2>
                        <p className="text-gray-400">Connectez-vous pour accéder à votre tableau de bord</p>
                    </div>

                    {erreur && (
                        <div className="mb-6 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
                            {erreur}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Login</label>
                            <input
                                type="text"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                                required
                                placeholder="login"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Mot de passe</label>
                            <input
                                type="password"
                                value={motDePasse}
                                onChange={(e) => setMotDePasse(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                        >
                            Se connecter
                        </button>
                    </form>
                </div>
            </div>

            {/* Partie droite - Image */}
            <div className="w-1/2 bg-gray-800 flex items-center justify-center p-12">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <img 
                        src={engineerImage} 
                        alt="Ingénieur logiciel au travail" 
                        className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-gray-900/20"></div>
                    <div className="absolute bottom-8 left-8 right-8">
                        <h3 className="text-2xl font-bold text-white mb-2">Gérez vos demandes d'attestations</h3>
                        <p className="text-gray-300">Créer, valider et suivre vos attestations</p>
                    </div>
                </div>
            </div>
        </div>
    );
}