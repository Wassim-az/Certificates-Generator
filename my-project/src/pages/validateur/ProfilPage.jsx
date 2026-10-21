// src/pages/validateur/ProfilPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfilPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Charger les données du profil
  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  if (!user) {
    return <div className="text-white">Chargement du profil...</div>;
  }

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        <div className="flex-shrink-0">
          <img
            src={`http://127.0.0.1:8000/storage/${user.photo}`}
            alt="Photo Profil"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = '/default-profile.png';
            }}
          />
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{user.nom} {user.prenom}</h2>
              <p className="text-blue-400">{user.role?.nom}</p>
              <p className="text-gray-400">{user.departement_user}</p>
            </div>
            
            <button
              onClick={() => navigate(`modifier/${user.id}`)}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Modifier
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-blue-400 border-b border-gray-700 pb-2">Informations personnelles</h3>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p>{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Téléphone</p>
                <p>{user.Telephone || 'Non renseigné'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">CIN</p>
                <p>{user.CIN || 'Non renseigné'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-blue-400 border-b border-gray-700 pb-2">Autres informations</h3>
              <div>
                <p className="text-sm text-gray-400">Date de naissance</p>
                <p>{user.Date_Naiisance || 'Non renseignée'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Sexe</p>
                <p>{user.sexe || 'Non renseigné'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilPage;