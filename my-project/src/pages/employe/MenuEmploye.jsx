import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Notifications from "../components/Notifications";

export default function MenuEmploye() {
  const [activeMenu, setActiveMenu] = useState('demander');
  const [user, setUser] = useState(null);
  const [attestations, setAttestations] = useState([]);
  const navigate = useNavigate();

  // const menuItems = [
  //   { key: 'demander', label: 'Demander une attestation' },
  //   { key: 'attestations', label: 'Mes attestations' },
  //   { key: 'notifications', label: 'Notifications' },
  //   { key: 'profil', label: 'Mon profil' },
  // ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');
    axios.get(`http://127.0.0.1:8000/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setUser(res.data))
    .catch(err => console.error("Erreur lors du chargement de l'utilisateur", err));
  }, []);

  useEffect(() => {
  const userId = localStorage.getItem('user_id');
  if (userId) {
    axios.get(`http://127.0.0.1:8000/api/demandes/mes_attestation/${userId}`)
      .then(res => {
        // Assurez-vous que la réponse contient bien un tableau d'attestations
        const data = res.data.data || res.data;
        setAttestations(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("Erreur lors du chargement des attestations", err);
        setAttestations([]); // Initialise avec un tableau vide en cas d'erreur
      });
  }
}, []);

  const handleModifierProfil = () => {
    navigate(`/employe/menu-employe/modifier/${user.id}`);
  };

  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('user_id');
  //   navigate('/login');
  // };

  const [type, setType] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [motif, setMotif] = useState('');
  const [loading, setLoading] = useState(false);
  

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

const handleSubmitDemande = (e) => {
  e.preventDefault();

  const userId = localStorage.getItem('user_id');
  setLoading(true);

  if (type === 'demande_conge') {
    if (!dateDebut || !dateFin) {
      alert("Veuillez remplir les dates de congé.");
      setLoading(false);
      return;
    }

    axios.post('http://127.0.0.1:8000/api/demande-attestation', {
      user_id: userId,
      type_attestation: type,          // <-- ici !
      date_debut: dateDebut,     // tu avais date_debut, corrige pour correspondre à la règle Laravel
      date_fin: dateFin,         // idem
      commentaire: motif               // utiliser "commentaire" au lieu de "motif"
    })
    .then(() => {
      alert('Demande de congé envoyée !');
      resetForm();
    })
    .catch(err => {
      alert("Erreur : " + (err.response?.data?.message || ''));
    })
    .finally(() => setLoading(false));

  } else {
    axios.post('http://127.0.0.1:8000/api/demande-attestation', {
      user_id: userId,
      type_attestation: type,         // <-- ici aussi
      commentaire
    })
    .then(() => {
      alert('Demande d\'attestation envoyée !');
      resetForm();
    })
    .catch(err => {
      alert("Erreur : " + (err.response?.data?.message || ''));
    })
    .finally(() => setLoading(false));
  }
};

  const resetForm = () => {
    setType('');
    setCommentaire('');
    setDateDebut('');
    setDateFin('');
    setMotif('');
  };

  if (!user) {
    return <div className="text-white">Chargement...</div>;
  }

  const renderContent = () => {
    switch (activeMenu) {
      case 'demander':
        return (
          <form onSubmit={handleSubmitDemande} className="bg-gray-800 p-6 rounded-lg shadow max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-4">Faire une demande</h2>

            <div className="mb-4">
              <label className="block mb-1">Type de demande</label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:border-blue-500"
                required
              >
                <option value="">-- Choisir --</option>
                <option value="travail">Attestation de travail</option>
                <option value="stage">Attestation de stage</option>
                <option value="projet">Attestation de projet</option>
                <option value="demande_conge">Demande de congé</option>
              </select>
            </div>

            {type === 'demande_conge' ? (
              <>
                <div className="mb-4">
                  <label className="block mb-1">Date de début</label>
                  <input
                    type="date"
                    value={dateDebut}
                    onChange={e => setDateDebut(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:border-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1">Date de fin</label>
                  <input
                    type="date"
                    value={dateFin}
                    onChange={e => setDateFin(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:border-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1">Motif (optionnel)</label>
                  <textarea
                    value={motif}
                    onChange={e => setMotif(e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:border-blue-500"
                    placeholder="Ex : vacances, problème familial..."
                  ></textarea>
                </div>
              </>
            ) : (
              <div className="mb-4">
                <label className="block mb-1">Commentaire (optionnel)</label>
                <textarea
                  value={commentaire}
                  onChange={e => setCommentaire(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:border-blue-500"
                  placeholder="Ex : période souhaitée, projet concerné…"
                ></textarea>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {loading ? "Envoi en cours..." : "Envoyer la demande"}
            </button>
          </form>
        );

     case 'attestations':
      return (
        <div className="bg-gray-800 p-6 rounded-lg shadow mx-auto max-w-4xl">
          <h2 className="text-xl font-bold mb-6">Mes attestations</h2>
          
          {attestations.length === 0 ? (
            <p className="text-gray-400">Aucune attestation trouvée.</p>
          ) : (
            <div className="space-y-4">
              {attestations.map(att => (
                <div key={att.id} className="bg-gray-700 p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">
                        {att.type_attestation === 'travail' && 'Attestation de travail'}
                        {att.type_attestation === 'stage' && 'Attestation de stage'}
                        {att.type_attestation === 'demande_conge' && 'Demande de congé'}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Demandée le {new Date(att.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      att.statut === '1' ? 'bg-green-900 text-green-300' :
                      att.statut === '2' ? 'bg-red-900 text-red-300' :
                      'bg-yellow-900 text-yellow-300'
                    }`}>
                      {getStatutLabel(att.statut)}
                    </span>
                  </div>

                  {att.commentaire && (
                    <p className="mt-2 text-gray-300">
                      <strong>Commentaire:</strong> {att.commentaire}
                    </p>
                  )}

                  {att.motif_rejet && (
                    <p className="mt-2 text-red-300">
                      <strong>Motif de rejet:</strong> {att.motif_rejet}
                    </p>
                  )}

                  {att.type_attestation === 'demande_conge' && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <p><strong>Date début:</strong> {att.date_debut}</p>
                      <p><strong>Date fin:</strong> {att.date_fin}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
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
                    onClick={handleModifierProfil}
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
                    <div><p className="text-sm text-gray-400">Email</p><p>{user.email}</p></div>
                    <div><p className="text-sm text-gray-400">Téléphone</p><p>{user.Telephone}</p></div>
                    <div><p className="text-sm text-gray-400">CIN</p><p>{user.CIN}</p></div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-blue-400 border-b border-gray-700 pb-2">Autres informations</h3>
                    <div><p className="text-sm text-gray-400">Date de naissance</p><p>{user.Date_Naiisance}</p></div>
                    <div><p className="text-sm text-gray-400">Sexe</p><p>{user.sexe}</p></div>
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

//   return (
//     <div className="min-h-screen flex bg-gray-900 text-white">
//       <aside className="w-64 bg-gray-800 flex flex-col">
//         <div className="p-6 border-b border-gray-700">
//           <img
//             src={`http://127.0.0.1:8000/storage/${user.photo}`}
//             alt="Photo Profil"
//             className="w-20 h-20 rounded-full mx-auto mb-4"
//           />
//           <h1 className="text-xl font-bold text-center">{user.nom} {user.prenom}</h1>
//           <p className="text-center text-gray-400 text-sm">{user.role?.nom}</p>
//         </div>

//         <nav className="flex-grow mt-4">
//           {menuItems.map(({ key, label }) => (
//             <button
//               key={key}
//               onClick={() => setActiveMenu(key)}
//               className={`block w-full text-left px-6 py-3 hover:bg-gray-700 transition ${activeMenu === key ? 'bg-blue-600 font-semibold' : ''}`}
//             >
//               {label}
//             </button>
//           ))}
//         </nav>

// <div className="sticky bottom-0 p-4 bg-white border-t">
//   <button
//     onClick={handleLogout}
//     className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
//   >
//     Se déconnecter
//   </button>
// </div>
//       </aside>

//       <main className="flex-grow p-8">
//         {renderContent()}
//       </main>
//     </div>
//   );
}