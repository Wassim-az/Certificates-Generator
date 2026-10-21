import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ValidationAttestationsPage = () => {
  const [attestations, setAttestations] = useState([]);
  const [joursRestants, setJoursRestants] = useState({});
  const [refusEnCours, setRefusEnCours] = useState(null);
  const [motifRejet, setMotifRejet] = useState({});
  const [attestationsAcceptees, setAttestationsAcceptees] = useState({});
  const [fileToResend, setFileToResend] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
  };

  // Fonction pour télécharger le fichier
  const handleDownload = async (attestation) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/attestation/${attestation.id}/download`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attestation_${attestation.id}.docx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement du fichier');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/attestations/en-attente');
        const data = response.data.data || response.data;
        const attestationsData = Array.isArray(data) ? data : [];
        setAttestations(attestationsData);

        const congeRequests = attestationsData.filter(a => a.type_attestation === 'demande_conge');
        const joursRestantsData = {};
        
        for (const att of congeRequests) {
          try {
            const res = await axios.get(`http://127.0.0.1:8000/api/jours-restants/${att.user_id}`);
            joursRestantsData[att.user_id] = res.data.jours_restants?.total_jours_restant ?? 0;
          } catch (error) {
            console.error(`Erreur chargement jours restants pour user ${att.user_id}:`, error);
            joursRestantsData[att.user_id] = 0;
          }
        }
        
        setJoursRestants(joursRestantsData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setAttestations([]);
      }
    };

    fetchData();
  }, []);

  const calculerDuree = (dateDebut, dateFin) => {
    if (!dateDebut || !dateFin) return 0;
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    return Math.round((fin - debut) / (1000 * 60 * 60 * 24)) + 1;
  };

  const actionAttestation = async (attestationId, action) => {
    try {
      const validateurId = localStorage.getItem('user_id');
      
      if (!validateurId) {
        alert('Vous devez être connecté pour effectuer cette action');
        navigate('/login');
        return;
      }

      const url = `http://127.0.0.1:8000/api/demandes/${attestationId}/${action === 'valider' ? 'valider' : 'refuser'}`;
      
      const data = {
        validateur_id: validateurId,
        ...(action === 'refuser' && { motif_rejet: motifRejet[attestationId] || '' })
      };

      const response = await axios.post(url, data);
      
      if (response.data.success) {
        if (action === 'valider') {
          // Télécharger automatiquement l'attestation
          const attestation = attestations.find(att => att.id === attestationId);
          await handleDownload(attestation);
          
          // Marquer comme acceptée (sans la supprimer de la liste)
          setAttestationsAcceptees(prev => ({ ...prev, [attestationId]: true }));
        } else {
          // Pour le refus, supprimer de la liste
          setAttestations(prev => prev.filter(att => att.id !== attestationId));
        }
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

  const handleFileChange = (e) => {
    setFileToResend(e.target.files[0]);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const renvoyerAttestation = async (attestationId) => {
  if (!fileToResend) {
    alert('Veuillez sélectionner un fichier à renvoyer');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('file', fileToResend);

    const response = await axios.post(
      `http://127.0.0.1:8000/api/demandes/${attestationId}/renvoyer`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data.success) {
      alert('Fichier renvoyé et mail envoyé avec succès');
      setFileToResend(null);
      setAttestations(prev => prev.filter(att => att.id !== attestationId));
    }
  } catch (error) {
    console.error("Erreur:", error.response?.data || error.message);
    alert(error.response?.data?.message || 'Erreur lors du renvoi');
  }
};

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow mx-auto max-w-4xl">
      <h2 className="text-xl font-bold mb-6">Demandes à valider</h2>
      {attestations.length === 0 ? (
        <p className="text-gray-400">Aucune demande en attente.</p>
      ) : (
        attestations.map(att => (
          <div key={att.id} className="bg-gray-700 p-4 mb-4 rounded shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
              <div>
                <p><strong>Type :</strong> {att.type_attestation}</p>
                <p><strong>Employé :</strong> {att.demandeur?.nom} {att.demandeur?.prenom}</p>
              </div>
              <div>
                <p><strong>Date demande :</strong> {formatDate(att.created_at)}</p>
              </div>
            </div>
            
            {att.type_attestation === 'demande_conge' && (
              <div className="my-2 p-2 bg-gray-600 rounded">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <p><strong>Période :</strong> {formatDate(att.date_debut)} au {formatDate(att.date_fin)}</p>
                  <p><strong>Durée :</strong> {calculerDuree(att.date_debut, att.date_fin)} jours</p>
                  <p><strong>Jours restants :</strong> {joursRestants[att.user_id] ?? 'N/A'}</p>
                </div>
              </div>
            )}
            
            <p><strong>Commentaire :</strong> {att.commentaire || 'Aucun commentaire'}</p>

            {refusEnCours === att.id ? (
              <>
                <textarea
                  placeholder="Motif de rejet (obligatoire)"
                  value={motifRejet[att.id] || ''}
                  onChange={(e) => setMotifRejet(m => ({ ...m, [att.id]: e.target.value }))}
                  className="w-full mt-2 p-2 text-black rounded"
                  required
                />
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => validerRefus(att.id)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                    disabled={!motifRejet[att.id]}
                  >
                    Confirmer le refus
                  </button>
                  <button
                    onClick={() => setRefusEnCours(null)}
                    className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded"
                  >
                    Annuler
                  </button>
                </div>
              </>
            ) : attestationsAcceptees[att.id] ? (
              <div className="mt-2 space-x-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept=".docx,.pdf"
      />
      <button
        onClick={triggerFileInput}
        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded mr-2"
      >
        Choisir fichier
      </button>
      {fileToResend && (
        <>
          <span className="text-gray-300">{fileToResend.name}</span>
          <button
            onClick={() => renvoyerAttestation(att.id)}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded ml-2"
          >
            Confirmer renvoi
          </button>
        </>
      )}
    </div>
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
                {/* <button
                  onClick={() => handleDownload(att)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                >
                  Télécharger
                </button> */}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ValidationAttestationsPage;