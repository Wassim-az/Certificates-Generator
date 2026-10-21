import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HistoriqueValidationsPage = () => {
  const [historique, setHistorique] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const navigate = useNavigate();

  // Fonction pour formater la date (YYYY-MM-DD)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
  };

  // Fonction pour calculer la durée en jours
  const calculerDuree = (dateDebut, dateFin) => {
    if (!dateDebut || !dateFin) return 0;
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    return Math.round((fin - debut) / (1000 * 60 * 60 * 24)) + 1;
  };

  const getStatutLabel = (statut) => {
    switch (statut) {
      case '0':
      case 0:
        return 'En attente';
      case '1':
      case 1:
        return 'Acceptée';
      case '2':
      case 2:
        return 'Refusée';
      default:
        return 'Inconnu';
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchHistorique = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/attestations/historique/${userId}`);
        const data = response.data.data || response.data;
        const list = Array.isArray(data) ? data : [];
        
        list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        setHistorique(list);

        const employesStagiaires = list
          .map(att => att.demandeur)
          .filter(u => u && (u.role_id === 1 || u.role_id === 3))
          .filter((v, i, self) => self.findIndex(u => u.id === v.id) === i);

        setUsers(employesStagiaires);

      } catch (error) {
        console.error('Erreur lors du chargement de l\'historique:', error);
        setHistorique([]);
        setUsers([]);
      }
    };

    fetchHistorique();
  }, [navigate]);

  // Filtrage
  const filteredHistorique = historique.filter(att => {
    const matchUser = selectedUser ? att.demandeur_id == selectedUser : true;
    const matchType = selectedType ? att.type_attestation === selectedType : true;
    const matchStatus = selectedStatus ? 
      (selectedStatus === 'accepte' ? att.statut == '1' : att.statut == '2') : true;
    return matchUser && matchType && matchStatus;
  });

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow mx-auto max-w-5xl">
      <h2 className="text-xl font-bold mb-6">Historique des validations</h2>

      {/* Filtres */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block mb-2 text-gray-300">Filtrer par utilisateur :</label>
          <select
            value={selectedUser}
            onChange={e => setSelectedUser(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white"
          >
            <option value="">Tous</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.nom} {user.prenom} ({user.role_id === 1 ? 'Employé' : 'Stagiaire'})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-gray-300">Filtrer par type :</label>
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white"
          >
            <option value="">Tous</option>
            <option value="travail">Attestation de travail</option>
            <option value="stage">Attestation de stage</option>
            <option value="projet">Attestation de projet</option>
            <option value="demande_conge">Demande de congé</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-gray-300">Filtrer par statut :</label>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white"
          >
            <option value="">Tous</option>
            <option value="accepte">Acceptée</option>
            <option value="refuse">Refusée</option>
          </select>
        </div>
      </div>

      {/* Liste */}
      {filteredHistorique.length === 0 ? (
        <p className="text-gray-400">Aucune validation trouvée.</p>
      ) : (
        <div className="space-y-4">
          {filteredHistorique.map(att => (
            <div key={att.id} className="bg-gray-700 p-4 rounded-lg shadow">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <div>
                  <p className="font-semibold">Type</p>
                  <p>
                    {att.type_attestation === 'travail' && 'Attestation de travail'}
                    {att.type_attestation === 'stage' && 'Attestation de stage'}
                    {att.type_attestation === 'projet' && 'Attestation de projet'}
                    {att.type_attestation === 'demande_conge' && 'Demande de congé'}
                  </p>
                </div>
                
                <div>
                  <p className="font-semibold">Employé</p>
                  <p>{att.demandeur?.nom} {att.demandeur?.prenom}</p>
                </div>
                
                <div>
                  <p className="font-semibold">Date de demande</p>
                  <p>{formatDate(att.created_at)}</p>
                </div>
              </div>

              {/* Section commune pour toutes les demandes */}
              <div className="bg-gray-600 p-3 rounded mb-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(att.date_debut && att.date_fin) && (
                    <div>
                      <p className="font-semibold">Période</p>
                      <p>{formatDate(att.date_debut)} au {formatDate(att.date_fin)}</p>
                    </div>
                  )}
                  
                  {(att.date_debut && att.date_fin) && (
                    <div>
                      <p className="font-semibold">Durée</p>
                      <p>{calculerDuree(att.date_debut, att.date_fin)} jours</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="font-semibold">Statut</p>
                    <span className={
                      att.statut == '1' ? 'text-green-400' :
                      att.statut == '2' ? 'text-red-400' :
                      'text-yellow-400'
                    }>
                      {getStatutLabel(att.statut)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Informations communes */}
              <div className="mt-2">
                {att.commentaire && (
                  <div>
                    <p className="font-semibold">Commentaire</p>
                    <p className="text-gray-300">{att.commentaire}</p>
                  </div>
                )}
                
                {att.motif_rejet && (
                  <div className="mt-1">
                    <p className="font-semibold text-red-400">Motif de rejet</p>
                    <p className="text-red-300">{att.motif_rejet}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoriqueValidationsPage;