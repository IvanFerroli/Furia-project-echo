import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/entrar');
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <img
        src={user.photoURL || '/furia-logo.svg'}
        alt="Avatar"
        className="w-24 h-24 rounded-full mb-4"
      />
      <h2 className="text-xl font-bold mb-2">{user.displayName || 'Furioso(a)'}</h2>
      <p className="text-sm text-gray-600 mb-4">{user.email}</p>
      <button
        onClick={handleLogout}
        className="bg-black text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-800"
      >
        Sair da conta
      </button>
    </div>
  );
}
