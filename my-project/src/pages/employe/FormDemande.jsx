import { useState, useEffect } from 'react';
import axios from 'axios';

export default function FormulaireDemande() {
  const [type_attestation, setType] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [motif, setMotif] = useState('');
  const [loading, setLoading] = useState(false);
  const [erreurs, setErreurs] = useState({
    dates: '',
    periode: '',
    jours: ''
  });

  const [joursRestants, setJoursRestants] = useState(0);
  const [joursDemandes, setJoursDemandes] = useState(0);

  const userId = localStorage.getItem('user_id');

  // Charger les jours restants
  useEffect(() => {
    if (userId) {
      axios.get(`http://127.0.0.1:8000/api/jours-restants/${userId}`)
        .then(res => setJoursRestants(res.data.jours_restants))
        .catch(() => setJoursRestants(0));
    }
  }, [userId]);

  // Valider les dates
  useEffect(() => {
    const nouvellesErreurs = {...erreurs};
    
    if (dateDebut && (type_attestation === 'stage' || type_attestation === 'projet' || type_attestation === 'demande_conge')) {
      // Validation spécifique pour les congés
      if (type_attestation === 'demande_conge') {
        const aujourdhui = new Date();
        aujourdhui.setHours(0, 0, 0, 0);
        const debut = new Date(dateDebut);
        
        if (debut < aujourdhui) {
          nouvellesErreurs.dates = "La date de début ne peut pas être antérieure à aujourd'hui";
        } else {
          nouvellesErreurs.dates = '';
        }
      }

      // Validation période pour tous (date fin > date début)
      if (dateFin) {
        const debut = new Date(dateDebut);
        const fin = new Date(dateFin);
        
        if (fin < debut) {
          nouvellesErreurs.periode = "La date de fin doit être postérieure à la date de début";
        } else {
          nouvellesErreurs.periode = '';
          
          // Calcul des jours uniquement pour les congés
          if (type_attestation === 'demande_conge') {
            const diff = Math.floor((fin - debut) / (1000 * 60 * 60 * 24)) + 1;
            setJoursDemandes(diff > 0 ? diff : 0);

            if (diff > joursRestants) {
              nouvellesErreurs.jours = `Vous demandez ${diff} jours mais il ne vous reste que ${joursRestants} jours`;
            } else {
              nouvellesErreurs.jours = '';
            }
          }
        }
      }
    }

    setErreurs(nouvellesErreurs);
  }, [dateDebut, dateFin, joursRestants, type_attestation]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Vérifier les erreurs avant soumission
    if (Object.values(erreurs).some(err => err !== '')) {
      alert("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    setLoading(true);

    const requestData = {
      user_id: userId,
      type_attestation,
      commentaire,
      ...((type_attestation === 'stage' || 
          type_attestation === 'projet' || 
          type_attestation === 'demande_conge') && {
        date_debut: dateDebut,
        date_fin: dateFin
      }),
      ...(type_attestation === 'demande_conge' && { motif })
    };

    const endpoint = type_attestation === 'demande_conge' 
      ? 'http://127.0.0.1:8000/api/demande-conge' 
      : 'http://127.0.0.1:8000/api/demande-attestation';

    axios.post(endpoint, requestData)
      .then(() => {
        alert(`Demande ${type_attestation === 'demande_conge' ? 'de congé' : 'd\'attestation'} envoyée !`);
        resetForm();
      })
      .catch(err => {
        alert("Erreur : " + (err.response?.data?.message || err.message));
      })
      .finally(() => setLoading(false));
  };

  const resetForm = () => {
    setType('');
    setCommentaire('');
    setDateDebut('');
    setDateFin('');
    setMotif('');
    setJoursDemandes(0);
    setErreurs({
      dates: '',
      periode: '',
      jours: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Faire une demande</h2>

      <div className="mb-4">
        <label className="block mb-1">Type de demande</label>
        <select
          value={type_attestation}
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

      {/* Champs dates pour stage, projet et congé */}
      {(type_attestation === 'stage' || type_attestation === 'projet' || type_attestation === 'demande_conge') && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <div>
              <label className="block mb-1">Date de début</label>
              <input
                type="date"
                value={dateDebut}
                onChange={e => setDateDebut(e.target.value)}
                min={type_attestation === 'demande_conge' ? new Date().toISOString().split('T')[0] : undefined}
                className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:border-blue-500"
                required
              />
              {type_attestation === 'demande_conge' && erreurs.dates && (
                <p className="text-red-500 text-sm mt-1">{erreurs.dates}</p>
              )}
            </div>
            <div>
              <label className="block mb-1">Date de fin</label>
              <input
                type="date"
                value={dateFin}
                onChange={e => setDateFin(e.target.value)}
                min={dateDebut || (type_attestation === 'demande_conge' ? new Date().toISOString().split('T')[0] : undefined)}
                className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:border-blue-500"
                required
              />
              {erreurs.periode && <p className="text-red-500 text-sm mt-1">{erreurs.periode}</p>}
            </div>
          </div>

          {type_attestation === 'demande_conge' && (
            <div className="mb-2">
              <p className="text-sm text-gray-300">
  Jours restants : <strong>{joursRestants?.total_jours_restant ?? 'N/A'}</strong>
</p>

              <p className="text-sm text-gray-300">
                Jours demandés : <strong>{joursDemandes}</strong>
              </p>
              {erreurs.jours && <p className="text-red-500 text-sm mt-1">{erreurs.jours}</p>}
            </div>
          )}
        </>
      )}

      {/* Champ motif uniquement pour les congés */}
      {type_attestation === 'demande_conge' && (
        <div className="mb-4">
          <label className="block mb-1">Motif (optionnel)</label>
          <textarea
            value={motif}
            onChange={e => setMotif(e.target.value)}
            rows="3"
            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:border-blue-500"
            placeholder="Ex : vacances, problème familial..."
          />
        </div>
      )}

      {/* Champ commentaire pour tous sauf congé */}
      {type_attestation !== 'demande_conge' && (
        <div className="mb-4">
          <label className="block mb-1">Commentaire (optionnel)</label>
          <textarea
            value={commentaire}
            onChange={e => setCommentaire(e.target.value)}
            rows="3"
            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:border-blue-500"
            placeholder={
              type_attestation === 'travail' ? "Informations complémentaires..." :
              type_attestation === 'stage' ? "Détails du stage..." :
              "Détails du projet..."
            }
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading || (type_attestation === 'demande_conge' && Object.values(erreurs).some(err => err !== ''))}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-gray-500"
      >
        {loading ? "Envoi en cours..." : "Envoyer la demande"}
      </button>
    </form>
  );
}