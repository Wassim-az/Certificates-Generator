import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function EmployesList() {
    const [employes, setEmployes] = useState([]);
    const [filteredEmployes, setFilteredEmployes] = useState([]);
    const [selectedEmploye, setSelectedEmploye] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployes();
    }, []);

    const fetchEmployes = () => {
        axios.get('http://127.0.0.1:8000/api/users')
            .then(response => {
                setEmployes(response.data);
                setFilteredEmployes(response.data);
            })
            .catch(error => {
                console.error('Erreur lors du chargement des employés', error);
            });
    };

    useEffect(() => {
        const results = employes.filter(emp =>
            `${emp.nom} ${emp.prenom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.Telephone.includes(searchTerm)
        );
        setFilteredEmployes(results);
    }, [searchTerm, employes]);

    const handleAjouter = () => {
        navigate('/admin/employes/ajouter');
    };

    const handleSelectEmploye = (emp) => {
        setSelectedEmploye(emp);
    };

    const handleCloseDetails = () => {
        setSelectedEmploye(null);
    };

    const handleModifier = (id) => {
        navigate(`/admin/employes/modifier/${id}`);
    };

    const handleSupprimer = (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
            axios.delete(`http://127.0.0.1:8000/api/users/${id}`)
                .then(() => {
                    alert("Employé supprimé avec succès.");
                    fetchEmployes(); // Rafraîchir la liste
                    handleCloseDetails();
                })
                .catch(error => {
                    console.error('Erreur lors de la suppression', error);
                    alert('Erreur lors de la suppression.');
                });
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => {
                        localStorage.removeItem('user_id'); // ou 'user' selon ce que tu stockes
                        navigate('/login');
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition"
                    >
                        Se déconnecter
                    </button>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Liste des Employés</h2>
                        <p className="text-gray-600">{filteredEmployes.length} employé(s)</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative md:mx-auto md:w-96">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Rechercher un employé..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={handleAjouter}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition flex items-center justify-center whitespace-nowrap"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Ajouter
                        </button>
                    </div>
                </div>

                {filteredEmployes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEmployes.map(emp => (
                            <div
                                key={emp.id}
                                onClick={() => handleSelectEmploye(emp)}
                                className="cursor-pointer bg-gray-800 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-[1.02]"
                            >
                                <h3 className="text-xl font-semibold mb-2">{emp.nom} {emp.prenom}</h3>
                                <p className="text-blue-300 text-sm mb-3">{emp.role?.nom}</p>
                                <div className="space-y-2 text-gray-300">
                                    <p className="flex items-center text-sm">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        {emp.email}
                                    </p>
                                    <p className="flex items-center text-sm">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        {emp.Telephone}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-8 rounded-xl shadow-md text-center">
                        <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun résultat trouvé</h3>
                        <p className="mt-2 text-gray-600">Aucun employé ne correspond à votre recherche "{searchTerm}"</p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Réinitialiser la recherche
                        </button>
                    </div>
                )}

                {/* Modal détaillé avec actions */}
                {selectedEmploye && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                        <div className="bg-gray-800 text-white p-8 rounded-xl shadow-2xl max-w-2xl w-full relative border border-gray-700">
                            <button
                                onClick={handleCloseDetails}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
                            >
                                &times;
                            </button>
                            <h2 className="text-2xl font-bold mb-6">Détails de {selectedEmploye.nom} {selectedEmploye.prenom}</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Informations Personnelles</h3>
                                    <div className="space-y-4">
                                        <p><span className="text-xs text-gray-400">CIN:</span> {selectedEmploye.CIN}</p>
                                        <p><span className="text-xs text-gray-400">Date Naissance:</span> {selectedEmploye.Date_Naiisance}</p>
                                        <p><span className="text-xs text-gray-400">Sexe:</span> {selectedEmploye.sexe}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Coordonnées Professionnelles</h3>
                                    <div className="space-y-4">
                                        <p><span className="text-xs text-gray-400">Email:</span> {selectedEmploye.email}</p>
                                        <p><span className="text-xs text-gray-400">Téléphone:</span> {selectedEmploye.Telephone}</p>
                                        <p><span className="text-xs text-gray-400">Département:</span> {selectedEmploye.departement_user}</p>
                                        <p><span className="text-xs text-gray-400">Rôle:</span> {selectedEmploye.role?.nom}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 mt-8">
                                <button
                                    onClick={() => handleModifier(selectedEmploye.id)}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg"
                                >
                                    Modifier
                                </button>
                                <button
                                    onClick={() => handleSupprimer(selectedEmploye.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
