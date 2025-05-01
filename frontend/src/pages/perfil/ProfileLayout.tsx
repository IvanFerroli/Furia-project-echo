import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { auth } from '../../services/firebase';

export default function ProfileLayout() {
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
    <div className="min-h-screen flex bg-gray-100">
      {/* Side Menu */}
      <aside className="w-[260px] bg-white shadow-md p-6 flex flex-col gap-4">
        <div className="flex flex-col items-center mb-6">
          <img
            src={user.photoURL || '/furia-logo.svg'}
            alt="Avatar"
            className="w-20 h-20 rounded-full mb-2 object-cover"
          />
          <h2 className="text-lg font-semibold text-center">{user.displayName || 'Furioso(a)'}</h2>
          <p className="text-xs text-gray-500 text-center">{user.email}</p>
        </div>

        <nav className="flex flex-col gap-2">
          <NavLink
            to="info"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md text-sm font-medium ${
                isActive ? 'bg-black text-white' : 'text-gray-800 hover:bg-gray-200'
              }`
            }
          >
            Informações
          </NavLink>
          <NavLink
            to="awards"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md text-sm font-medium ${
                isActive ? 'bg-black text-white' : 'text-gray-800 hover:bg-gray-200'
              }`
            }
          >
            Premiações
          </NavLink>
          <NavLink
            to="metricas"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md text-sm font-medium ${
                isActive ? 'bg-black text-white' : 'text-gray-800 hover:bg-gray-200'
              }`
            }
          >
            Métricas
          </NavLink>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-600 text-white text-sm px-4 py-2 rounded-md hover:bg-red-700"
        >
          Sair da conta
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
