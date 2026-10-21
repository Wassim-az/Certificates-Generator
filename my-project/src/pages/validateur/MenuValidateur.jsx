import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Notifications from "../components/Notifications";

export default function MenuValidateur() {
  const [activeMenu, setActiveMenu] = useState('valider');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [attestations, setAttestations] = useState([]);
  const [historique, setHistorique] = useState([]);
  const [motifRejet, setMotifRejet] = useState({});
  const [refusEnCours, setRefusEnCours] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const menuItems = [
    { key: 'valider', label: 'Valider Attestations' },
    { key: 'validees', label: 'Attestations Validées' },
    { key: 'notifications', label: 'Notifications' },
    { key: 'profil', label: 'Mon Profil' },
  ];

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      navigate('/login');
      return;
    }

    axios.get(`http://127.0.0.1:8000/api/users/${userId}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => navigate('/login'));
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

      if (activeMenu === 'valider') {
    axios.get('http://127.0.0.1:8000/api/attestations/en-attente')
      .then(res => {
        // Vérifiez la structure de la réponse
        console.log('Réponse API:', res);
        
        // Si la réponse a une propriété data qui contient le tableau
        const data = res.data.data || res.data;
        setAttestations(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error(err);
        setAttestations([]); // Initialise avec un tableau vide en cas d'erreur
      });
  }

    if (activeMenu === 'validees') {
      axios.get(`http://127.0.0.1:8000/api/attestations/historique/${user.id}`)
        .then((res) => {
      const data = res.data.data || res.data; // compatibilité avec les API Laravel Resource
      setHistorique(Array.isArray(data) ? data : []);
        })
        .catch(console.error);
    }

    if (activeMenu === 'notifications') {
      axios.get(`http://127.0.0.1:8000/api/notifications/${user.id}`)
        .then(res => {
          setNotifications(res.data);
          setUnreadCount(res.data.filter(n => !n.is_read).length);
        })
        .catch(console.error);
    }
  }, [activeMenu, user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    navigate('/login');
  };

    const actionAttestation = async (attestationId, action) => {
      try {
        // 1. Récupérer user_id depuis localStorage
        const validateurId = localStorage.getItem('user_id');
        
        if (!validateurId) {
          alert('Vous devez être connecté pour effectuer cette action');
          return;
        }

        // 2. Préparer l'URL et les données
        const url = `http://127.0.0.1:8000/api/demandes/${attestationId}/${action === 'valider' ? 'valider' : 'refuser'}`;
        
        const data = {
          validateur_id: validateurId, // Envoyer l'ID du validateur
          ...(action === 'refuser' && { motif_rejet: motifRejet[attestationId] || '' })
        };

        // 3. Envoyer la requête
        const response = await axios.post(url, data, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        // 4. Traiter la réponse
        if (response.data.success) {
          setAttestations(prev => prev.filter(att => att.id !== attestationId));
          setRefusEnCours(null);
          alert('Action effectuée avec succès!');
        }
      } catch (error) {
        console.error("Erreur:", error.response?.data || error.message);
        alert(`Erreur: ${error.response?.data?.message || 'Action échouée'}`);
      }
    };

  const validerRefus = (attestationId) => {
    actionAttestation(attestationId, 'refuser');
  };

  const markAsRead = (notificationId) => {
    axios.patch(`http://127.0.0.1:8000/api/notifications/${notificationId}/mark-as-read`)
      .then(() => {
        setNotifications(prev => 
          prev.map(n => 
            n.id === notificationId 
              ? {...n, is_read: true, read_at: new Date().toISOString()} 
              : n
          )
        );
        setUnreadCount(prev => prev - 1);
      })
      .catch(console.error);
  };

  const getStatutLabel = (statut) => {
    switch (statut) {
      case '0':
        return 'En attente';
      case '1':
        return 'Acceptée';
      case '2':
        return 'Refusée';
      default:
        return 'Inconnu';
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'valider':
        return (
          <div className="bg-gray-800 p-6 rounded-lg shadow mx-auto max-w-4xl">
            <h2 className="text-xl font-bold mb-6">Attestations à valider</h2>
            {attestations.length === 0 ? (
              <p className="text-gray-400">Aucune attestation en attente.</p>
            ) : (
              attestations.map(att => (
                <div key={att.id} className="bg-gray-700 p-4 mb-4 rounded shadow">
                  <p><strong>Type :</strong> {att.type_attestation}</p>
                  <p><strong>Employé :</strong> {att.demandeur?.nom} {att.demandeur?.prenom}</p>
                  <p><strong>Commentaire :</strong> {att.commentaire ? att.commentaire : 'Pas de commentaire.'}</p>

                  {refusEnCours === att.id ? (
                    <>
                      <textarea
                        placeholder="Motif de rejet (optionnel)"
                        value={motifRejet[att.id] || ''}
                        onChange={(e) => setMotifRejet(m => ({ ...m, [att.id]: e.target.value }))}
                        className="w-full mt-2 p-2 text-black rounded"
                      />
                      <div className="mt-2 space-x-2">
                        <button
                          onClick={() => validerRefus(att.id)}
                          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                        >
                          Valider le refus
                        </button>
                        <button
                          onClick={() => setRefusEnCours(null)}
                          className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded"
                        >
                          Annuler
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="mt-2 space-x-2">
                      <button
                        onClick={() => actionAttestation(att.id, 'valider')}
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                      >
                        Accepter
                      </button>
                      <button
                        onClick={() => setRefusEnCours(att.id)}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                      >
                        Refuser
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        );

      case 'validees':
        return (
          <div className="bg-gray-800 p-6 rounded-lg shadow mx-auto max-w-4xl">
            <h2 className="text-xl font-bold mb-6">Attestations validées</h2>
            {historique.length === 0 ? (
              <p className="text-gray-400">Aucune validation effectuée.</p>
            ) : (
              historique.map(att => (
                <div key={att.id} className="bg-gray-700 p-4 mb-4 rounded shadow">
                  <p><strong>Type :</strong> {att.type_attestation}</p>
                  <p><strong>Employé :</strong> {att.demandeur?.nom} {att.demandeur?.prenom}</p>
                  <p>
                    <strong>Décision :</strong>{' '}
                    <span className={
                      att.statut === '1'
                        ? 'text-green-400'
                        : att.statut === '2'
                          ? 'text-red-400'
                          : 'text-yellow-400'
                    }>
                      {getStatutLabel(att.statut)}
                    </span>
                  </p>
                  {att.motif_rejet && (
                    <p><strong>Motif :</strong> {att.motif_rejet}</p>
                  )}
                </div>
              ))
            )}
          </div>
        );

      case 'notifications':
        return (
          <Notifications userId={user.id} />
        );

      case 'profil':
        return (
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <div className="flex-shrink-0">
                <img
                  src={`http://127.0.0.1:8000/storage/${user?.photo}`}
                  alt="Photo Profil"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{user?.nom} {user?.prenom}</h2>
                    <p className="text-blue-400">{user?.role?.nom}</p>
                    <p className="text-gray-400">{user?.departement_user}</p>
                  </div>
                  <button
                    onClick={() => navigate(`modifier/${user?.id}`)}
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
                    <div><p className="text-sm text-gray-400">Email</p><p>{user?.email}</p></div>
                    <div><p className="text-sm text-gray-400">Téléphone</p><p>{user?.Telephone}</p></div>
                    <div><p className="text-sm text-gray-400">CIN</p><p>{user?.CIN}</p></div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-blue-400 border-b border-gray-700 pb-2">Autres informations</h3>
                    <div><p className="text-sm text-gray-400">Date de naissance</p><p>{user?.Date_Naiisance}</p></div>
                    <div><p className="text-sm text-gray-400">Sexe</p><p>{user?.sexe}</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        

      
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return <div className="text-white">Chargement...</div>;
  }

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <aside className="w-64 bg-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <img
            src={`http://127.0.0.1:8000/storage/${user?.photo}`}
            alt="Profil"
            className="w-20 h-20 rounded-full mx-auto mb-4"
          />
          <h1 className="text-xl font-bold text-center">{user.nom} {user.prenom}</h1>
          <p className="text-center text-gray-400 text-sm">{user.role?.nom}</p>
        </div>

        <nav className="flex-grow mt-4">
          {menuItems.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveMenu(key)}
              className={`flex justify-between items-center w-full text-left px-6 py-3 hover:bg-gray-700 transition ${activeMenu === key ? 'bg-blue-600 font-semibold' : ''}`}
            >
              <span>{label}</span>
              {key === 'notifications' && unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Se déconnecter
          </button>
        </div>
      </aside>

      <main className="flex-grow p-8">
        {renderContent()}
      </main>
    </div>
  );
}