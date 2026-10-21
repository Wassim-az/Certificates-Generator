import { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function ValidateurLayout() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/validateur/valider', label: 'Valider Attestations' },
    { path: '/validateur/validees', label: 'Attestations Validées' },
    { path: '/validateur/notifications', label: 'Notifications' },
    { path: '/validateur/profil', label: 'Mon Profil' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');
    
    if (!token || !userId) {
      navigate('/login');
      return;
    }

    axios.get(`http://127.0.0.1:8000/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUser(res.data))
    .catch(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      navigate('/login');
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    navigate('/login');
  };

  if (!user) {
    return <div className="text-white">Chargement...</div>;
  }

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      {/* Menu latéral fixe */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <img
            src={`http://127.0.0.1:8000/storage/${user.photo}`}
            alt="Photo Profil"
            className="w-20 h-20 rounded-full mx-auto mb-4"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-profile.png';
            }}
          />
          <h1 className="text-xl font-bold text-center">{user.nom} {user.prenom}</h1>
          <p className="text-center text-gray-400 text-sm">{user.role?.nom}</p>
        </div>

        <nav className="flex-grow mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block w-full text-left px-6 py-3 hover:bg-gray-700 transition ${
                location.pathname === item.path ? 'bg-blue-600 font-semibold' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="sticky bottom-0 p-4 bg-gray-700 border-t border-gray-600">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Contenu principal avec marge à gauche pour éviter que ça chevauche le menu */}
      <main className="flex-grow p-8 ml-64">
        <Outlet />
      </main>
    </div>
  );
}