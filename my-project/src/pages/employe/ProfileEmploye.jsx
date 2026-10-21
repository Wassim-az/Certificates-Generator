import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ProfileEmploye() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

const userId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const response = await axios.get(`http://127.0.0.1:8000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUser(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement de l'utilisateur", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
}, []);

  const handleModifierProfil = () => {
    navigate(`/employe/profil/modifier/${userId}`);
  };

  if (loading) {
    return <div className="text-white text-center py-8">Chargement du profil...</div>;
  }

  if (!user) {
    return <div className="text-white text-center py-8">Erreur de chargement du profil</div>;
  }

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <ProfileHeader 
        user={user} 
        onEdit={handleModifierProfil} 
      />
      <ProfileDetails user={user} />
    </div>
  );
}

function ProfileHeader({ user, onEdit }) {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
      <div className="flex-shrink-0">
        <img
          src={`http://127.0.0.1:8000/storage/${user.photo}`}
          alt="Photo Profil"
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
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
            onClick={onEdit}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileDetails({ user }) {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <ProfileSection 
        title="Informations personnelles"
        items={[
          { label: 'Email', value: user.email },
          { label: 'Téléphone', value: user.Telephone },
          { label: 'CIN', value: user.CIN }
        ]}
      />
      
      <ProfileSection 
        title="Autres informations"
        items={[
          { label: 'Date de naissance', value: user.Date_Naiisance },
          { label: 'Sexe', value: user.sexe }
        ]}
      />
    </div>
  );
}

function ProfileSection({ title, items }) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-blue-400 border-b border-gray-700 pb-2">{title}</h3>
      {items.map((item, index) => (
        <div key={index}>
          <p className="text-sm text-gray-400">{item.label}</p>
          <p>{item.value || 'Non spécifié'}</p>
        </div>
      ))}
    </div>
  );
} 