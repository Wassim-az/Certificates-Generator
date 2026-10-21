import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import engineerImage from '../../images/ajout-pic.jpeg';

export default function ModifierEmploye() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        CIN: '',
        nom: '',
        prenom: '',
        login: '',
        Date_Naiisance: '',
        Telephone: '',
        sexe: '',
        date_embauche: '',
        departement_user: '',
        email: '',
        password: '',
        role_id: '',
        photo: null
    });

    const [preview, setPreview] = useState(null);
    const [roles, setRoles] = useState([]);
    const [photoActuelle, setPhotoActuelle] = useState(null);

    const sexes = ['homme', 'femme'];
    const departements = ['RH', 'IT', 'Finance', 'Production'];

    useEffect(() => {
        // Charger les rôles
        axios.get('http://127.0.0.1:8000/api/roles')
            .then(response => {
                setRoles(response.data.role);
            })
            .catch(error => {
                console.error('Erreur lors du chargement des rôles', error);
                alert('Impossible de charger les rôles');
            });

        // Charger les infos de l'employé
        axios.get(`http://127.0.0.1:8000/api/users/${id}`)
            .then(response => {
                const data = response.data;
                setFormData({
                    CIN: data.CIN,
                    nom: data.nom,
                    prenom: data.prenom,
                    login: data.login,
                    Date_Naiisance: data.Date_Naiisance,
                    Telephone: data.Telephone,
                    sexe: data.sexe,
                    date_embauche: data.date_embauche,
                    departement_user: data.departement_user,
                    email: data.email,
                    password: '', // Laisser vide pour ne pas changer le mot de passe
                    role_id: data.role_id,
                    photo: null
                });
                setPhotoActuelle(data.photo); // pour afficher l'image actuelle
            })
            .catch(error => {
                console.error('Erreur lors du chargement de l\'employé', error);
                alert('Employé non trouvé');
                navigate('/admin/employes');
            });
    }, [id, navigate]);

    useEffect(() => {
        if (formData.photo) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(formData.photo);
        } else {
            setPreview(null);
        }
    }, [formData.photo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.match('image.*')) {
            setFormData({
                ...formData,
                photo: file
            });
        }
    };

    const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    // Ajouter les autres champs
    for (const key in formData) {
        // Ne pas ajouter la photo ici, on le fait à part
        if (key !== 'photo') {
            if (key === 'password' && formData[key] === '') continue; // ne pas envoyer mdp vide
            data.append(key, formData[key]);
        }
    }

    // Ajouter la photo seulement si c'est un fichier (quand tu as changé la photo)
    if (formData.photo && formData.photo instanceof File) {
        data.append('photo', formData.photo);
    }

    axios.post(`http://127.0.0.1:8000/api/users/${id}?_method=PUT`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(() => {
        alert('Employé modifié avec succès');
        navigate('/admin/employes');
    })
    .catch(error => {
        console.error('Erreur lors de la modification', error);
        alert('Erreur : ' + (error.response?.data?.message || 'Une erreur est survenue'));
    });
    };


    return (
        <div className="min-h-screen flex bg-gray-900">
            {/* Partie gauche - Image */}
            <div className="hidden lg:block w-1/2 bg-gray-800 flex items-center justify-center p-12">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <img 
                        src={engineerImage} 
                        alt="Ingénieur logiciel" 
                        className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-gray-900/20"></div>
                    <div className="absolute bottom-8 left-8 right-8">
                        <h3 className="text-2xl font-bold text-white mb-2">Modifiez vos collaborateurs</h3>
                        <p className="text-gray-300">Mettre à jour les informations d'un membre</p>
                    </div>
                </div>
            </div>

            {/* Partie droite - Formulaire */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-lg space-y-6 border border-gray-700">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-white">Modifier Employé</h2>
                        <p className="text-gray-400 mt-2">Mettez à jour les informations</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[ 
                            { label: 'CIN', name: 'CIN', type: 'text' },
                            { label: 'Nom', name: 'nom', type: 'text' },
                            { label: 'Prénom', name: 'prenom', type: 'text' },
                            { label: 'Login', name: 'login', type: 'text' },
                            { label: 'Date de naissance', name: 'Date_Naiisance', type: 'date' },
                            { label: 'Téléphone', name: 'Telephone', type: 'text' },
                            { label: 'Email', name: 'email', type: 'email' },
                            { label: 'Mot de passe (laisser vide si inchangé)', name: 'password', type: 'password' }
                        ].map(({ label, name, type }) => (
                            <div key={name} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">{label}</label>
                                <input
                                    type={type}
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                    required={name !== 'password'}
                                />
                            </div>
                        ))}

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">Sexe</label>
                            <select
                                name="sexe"
                                value={formData.sexe}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                required
                            >
                                <option value="">Choisir le sexe</option>
                                {sexes.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">Date d'embauche</label>
                            <input
                                type="date"
                                name="date_embauche"
                                value={formData.date_embauche}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">Département</label>
                            <select
                                name="departement_user"
                                value={formData.departement_user}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                required
                            >
                                <option value="">Choisir un département</option>
                                {departements.map(dep => (
                                    <option key={dep} value={dep}>{dep}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">Rôle</label>
                            <select
                                name="role_id"
                                value={formData.role_id}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                required
                            >
                                <option value="">Choisir un rôle</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.id}>{role.nom}</option>
                                ))}
                            </select>
                        </div>

                        {/* Photo */}
                        <div className="col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-gray-300">Photo</label>
                            <div className="flex items-center space-x-4">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-8 h-8 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-400">Cliquez pour changer la photo</p>
                                    </div>
                                    <input 
                                        type="file" 
                                        name="photo" 
                                        onChange={handleFileChange} 
                                        accept="image/*" 
                                        className="hidden" 
                                    />
                                </label>
                                {(preview || photoActuelle) && (
                                    <div className="flex-shrink-0">
                                        <img 
                                            src={preview || `http://127.0.0.1:8000/storage/${photoActuelle}`} 
                                            alt="Photo actuelle" 
                                            className="h-32 w-32 rounded-lg object-cover border border-gray-600"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/employes')}
                            className="px-6 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Modifier
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
