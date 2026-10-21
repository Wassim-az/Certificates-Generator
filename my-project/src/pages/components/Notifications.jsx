import { useState, useEffect } from "react";
import axios from "axios";

export default function FullWidthNotifications() {
  const userId = localStorage.getItem("user_id");
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/notifications/${userId}`);
      setNotifications(res.data);
      console.log("data", res.data);
    } catch (error) {
      console.error("Erreur chargement notifications :", error);
    } finally {
      setIsLoading(false);
    }
  };


  const markAllAsRead = async () => {
  try {
      await axios.patch(`http://127.0.0.1:8000/api/notifications/${userId}/mark-all-as-read`);
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error("Erreur lors du marquage en lu :", error);
    }
  };


  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/notifications/${notificationId}/mark-as-read`);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? {...n, is_read: true} : n
      ));
    } catch (error) {
      console.error("Erreur lecture notification :", error);
    }
  };

  const filteredNotifications = showUnreadOnly
    ? notifications.filter(n => !n.is_read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="w-full">
      {/* En-tête avec titre, compteur et bouton de filtre */}
      <div className="flex justify-between items-center mb-4">
  <div className="flex items-center space-x-3">
    <h2 className="text-xl font-bold">Notifications</h2>
    {unreadCount > 0 && (
      <span className="bg-red-500 text-white text-sm rounded-full px-3 py-1">
        {unreadCount} non lues
      </span>
    )}
  </div>

  <div className="flex gap-2">
    <button
      onClick={() => setShowUnreadOnly(!showUnreadOnly)}
      className={`px-4 py-2 text-sm rounded-md ${
        showUnreadOnly
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {showUnreadOnly ? 'Afficher toutes' : 'Afficher non lues'}
    </button>

    <button
      onClick={markAllAsRead}
      className="px-4 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-700"
    >
      Tout lire
    </button>
  </div>
  </div>

      {/* Liste des notifications */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {showUnreadOnly ? 'Aucune notification non lue' : 'Aucune notification disponible'}
        </div>
      ) : (
        <ul className="space-y-2">
          {filteredNotifications.map((n) => (
            <li
              key={n.id}
              className={`p-4 w-full cursor-pointer transition-colors ${
                !n.is_read ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'
              }`}
              onClick={() => markAsRead(n.id)}
            >
              <div className="flex justify-between items-start">
                <p className={`${n.is_read ? 'text-gray-600' : 'font-medium text-gray-900'}`}>
                  {n.notification?.message}
                </p>
                {!n.is_read && (
                  <span className="h-2 w-2 rounded-full bg-blue-500 mt-1.5"></span>
                )}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {new Date(n.notification?.date_envoi).toLocaleString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
    
  );
}