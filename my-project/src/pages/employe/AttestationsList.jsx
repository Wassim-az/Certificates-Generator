import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AttestationsList() {
  const [attestations, setAttestations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [joursRestants, setJoursRestants] = useState(0);

  const userId = localStorage.getItem('user_id');

  // Fonction pour formater la date en YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
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
  async function fetchData() {
    try {
      const resAtt = await axios.get(`http://127.0.0.1:8000/api/demandes/mes_attestation/${userId}`);
      const dataAtt = Array.isArray(resAtt.data) ? resAtt.data : resAtt.data.data ?? [];
      setAttestations(dataAtt);

      const resJours = await axios.get(`http://127.0.0.1:8000/api/jours-restants/${userId}`);
      console.log("jours-restants API response:", resJours.data);
      setJoursRestants(resJours.data ?? { 
        jours_restant_cette_annee: 0, 
        jours_reportes: 0, 
        total_jours_restant: 0 
      });

    } catch (error) {
      console.error("Erreur lors du chargement", error);
      setAttestations([]);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, [userId]);

  const filteredAttestations = filterType
    ? attestations.filter(att => att.type_attestation.toLowerCase() === filterType.toLowerCase())
    : attestations;

  const totalDemandes = filteredAttestations.length;
  const totalAcceptees = filteredAttestations.filter(a => a.statut == '1').length;
  const totalRefusees = filteredAttestations.filter(a => a.statut == '2').length;

  if (loading) {
    return <div className="text-white text-center py-8">Chargement en cours...</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow mx-auto max-w-4xl">
      <h2 className="text-xl font-bold mb-6">Mes demandes</h2>

      <div className="mb-6">
        <label className="block mb-2 text-gray-300 font-medium">Filtrer par type :</label>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="w-full md:w-1/2 px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:border-blue-500"
        >
          <option value="">Tous les types</option>
          <option value="travail">Attestation de travail</option>
          <option value="stage">Attestation de stage</option>
          <option value="projet">Attestation de projet</option>
          <option value="demande_conge">Demande de congé</option>
        </select>
      </div>

      {filterType && (
        <div className="bg-gray-700 p-4 rounded-lg mb-6">
          <p><strong>Total demandées :</strong> {totalDemandes}</p>
          <p><strong>Acceptées :</strong> {totalAcceptees}</p>
          <p><strong>Refusées :</strong> {totalRefusees}</p>
          {filterType && filterType.toLowerCase() === 'demande_conge' && joursRestants && joursRestants.jours_restants && (
            <>
              <p><strong>Jours restants cette année :</strong> {joursRestants.jours_restants.jours_restant_cette_annee ?? 'N/A'}</p>
              <p><strong>Jours reportés :</strong> {joursRestants.jours_restants.jours_reportes ?? 'N/A'}</p>
              <p><strong>Total jours restants :</strong> {joursRestants.jours_restants.total_jours_restant ?? 'N/A'}</p>
            </>
          )}

        </div>
      )}

      {filteredAttestations.length === 0 ? (
        <p className="text-gray-400 text-center py-4">Aucune demande trouvée.</p>
      ) : (
        <div className="space-y-4">
          {filteredAttestations.map(att => (
            <AttestationCard
              key={att.id}
              attestation={att}
              getStatutLabel={getStatutLabel}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AttestationCard({ attestation, getStatutLabel, formatDate }) {
  return (
    <div className="bg-gray-700 p-4 rounded-lg shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg">
            {attestation.type_attestation === 'travail' && 'Attestation de travail'}
            {attestation.type_attestation === 'stage' && 'Attestation de stage'}
            {attestation.type_attestation === 'projet' && 'Attestation de projet'}
            {attestation.type_attestation === 'demande_conge' && 'Demande de congé'}
          </h3>
          <p className="text-sm text-gray-400">
            Demandée le {formatDate(attestation.created_at)}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          attestation.statut == '1' ? 'bg-green-900 text-green-300' :
          attestation.statut == '2' ? 'bg-red-900 text-red-300' :
          'bg-yellow-900 text-yellow-300'
        }`}>
          {getStatutLabel(attestation.statut)}
        </span>
      </div>

      {attestation.commentaire && (
        <p className="mt-2 text-gray-300">
          <strong>Commentaire:</strong> {attestation.commentaire}
        </p>
      )}

      {attestation.motif_rejet && (
        <p className="mt-2 text-red-300">
          <strong>Motif de rejet:</strong> {attestation.motif_rejet}
        </p>
      )}

      {(attestation.type_attestation === 'demande_conge' || 
        attestation.type_attestation === 'stage' || 
        attestation.type_attestation === 'projet') && (
        <div className="mt-2 grid grid-cols-2 gap-2">
          {attestation.date_debut && (
            <p><strong>Date début:</strong> {formatDate(attestation.date_debut)}</p>
          )}
          {attestation.date_fin && (
            <p><strong>Date fin:</strong> {formatDate(attestation.date_fin)}</p>
          )}
        </div>
      )}
    </div>
  );
}