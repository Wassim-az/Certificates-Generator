import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import engineerImage from '../../images/ajout-pic.jpeg';

export default function ModifierEmploye() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    CIN: '',
    nom: '',
    prenom: '',
    login: '',
    Date_Naiisance: '',
    Telephone: '',
    sexe: '',
    email: '',
    photo: null,
    date_embauche: '',
  });



  const [preview, setPreview] = useState(null);
  const [photoActuelle, setPhotoActuelle] = useState(null);
  const sexes = ['homme', 'femme'];



  useEffect(() => {
  const userId = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');

  if (userId && token) {
    axios.get(`http://127.0.0.1:8000/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setUser(res.data))
    .catch(err => {
      console.error("Erreur lors du chargement du user", err);
    });
  }
}, []);




  // Charger les données à modifier
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/users/${id}`)
      .then(response => {
        const data = response.data;
        setFormData({
          CIN: data.CIN || '',
          nom: data.nom || '',
          prenom: data.prenom || '',
          login: data.login || '',
          Date_Naiisance: data.Date_Naiisance || '',
          Telephone: data.Telephone || '',
          sexe: data.sexe || '',
          email: data.email || '',
          photo: null,
          date_embauche: data.date_embauche || '',
        });
        setPhotoActuelle(data.photo || null);
      })
      .catch(() => {
        alert('Employé non trouvé');
        navigate('/employe');
      });
  }, [id, navigate]);

  // Aperçu photo
  useEffect(() => {
    if (formData.photo) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(formData.photo);
    } else {
      setPreview(null);
    }
  }, [formData.photo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      setFormData(prev => ({ ...prev, photo: file }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      if (key !== 'photo') data.append(key, formData[key]);
    }
    if (formData.photo && formData.photo instanceof File) {
      data.append('photo', formData.photo);
    }

    axios.post(`http://127.0.0.1:8000/api/users/${id}?_method=PUT`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(() => {
        alert('Informations modifiées avec succès');
        navigate('/employe');
      })
      .catch(error => {
        alert('Erreur : ' + (error.response?.data?.message || 'Une erreur est survenue'));
      });
  };









  if (!user) return <div className="text-white">Chargement...</div>;









        return (
          <div className="flex">
            {/* Image à gauche du formulaire */}
            <div className="hidden md:block w-1/3 pr-8">
              <img 
                src={engineerImage} 
                alt="Illustration" 
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>
            
            {/* Formulaire à droite */}
            <form onSubmit={handleSubmit} className="w-full md:w-2/3 bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-6 text-center">Modifier le profil</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'CIN', name: 'CIN', type: 'text' },
                  { label: 'Nom', name: 'nom', type: 'text' },
                  { label: 'Prénom', name: 'prenom', type: 'text' },
                  { label: 'Login', name: 'login', type: 'text' },
                  { label: 'Date de naissance', name: 'Date_Naiisance', type: 'date' },
                  { label: 'Téléphone', name: 'Telephone', type: 'text' },
                  { label: 'Email', name: 'email', type: 'email' },
                ].map(({ label, name, type }) => (
                  <div key={name} className="mb-4">
                    <label className="block text-sm font-medium mb-1">{label}</label>
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 focus:border-blue-500"
                      required
                    />
                  </div>
                ))}

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Date d'embauche</label>
                  <input
                    type="date"
                    name="date_embauche"
                    value={formData.date_embauche}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-600 text-gray-400"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Sexe</label>
                  <select
                    name="sexe"
                    value={formData.sexe}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 focus:border-blue-500"
                    required
                  >
                    <option value="">Sélectionner</option>
                    {sexes.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2 mb-4">
                  <label className="block text-sm font-medium mb-1">Photo</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-600 rounded p-4 text-center hover:bg-gray-700 transition">
                        <p className="text-sm">Cliquez pour changer la photo</p>
                        <input 
                          type="file" 
                          name="photo" 
                          onChange={handleFileChange} 
                          accept="image/*" 
                          className="hidden" 
                        />
                      </div>
                    </label>
                    {(preview || photoActuelle) && (
                      <div className="w-20 h-20">
                        <img 
                          src={preview || `http://127.0.0.1:8000/storage/${photoActuelle}`} 
                          alt="Photo actuelle" 
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => navigate('/employe')}
                  className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-700 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        );


}