import { useAuth } from '../../contexts/AuthContext'
import { useNavigate, NavLink, Outlet } from 'react-router-dom'
import { auth } from '../../services/firebase'

export default function ProfileLayout() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await auth.signOut()
    navigate('/entrar')
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p style={{ fontFamily: '"Helvetica World", Arial, Helvetica, sans-serif' }}>
          Carregando perfil...
        </p>
      </div>
    )
  }

  const menuItems = [
    { path: 'info', label: 'Informações' },
    { path: 'awards', label: 'Premiações' },
    { path: 'metricas', label: 'Métricas' }
  ]

  if (isAdmin) {
    menuItems.push({ path: 'dashboard', label: 'Dashboard de Usuários' })
  }

  return (
    <div
      className="min-h-[calc(100vh-76px)] flex bg-gradient-to-br from-zinc-50 to-white"
      style={{ fontFamily: '"Helvetica World", Arial, Helvetica, sans-serif' }}
    >
      {/* Side Menu */}
      <aside
        className="w-[280px] pt-[5px] p-6 flex flex-col gap-6 rounded-md"
        style={{
          backgroundColor: '#f9f9f9',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)'
        }}
      >
        <div className="flex flex-col items-center mb-6 text-center">
          <img
            src={user.photoURL || '/furia-logos.png'}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/furia-logos.png'
            }}
            alt="Avatar"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid black',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
            }}
          />

          <h2 className="text-xl font-bold text-zinc-800 mt-3">
            {user.displayName || 'Furioso(a)'}
          </h2>
          <p className="text-xs text-zinc-500">{user.email}</p>
        </div>

        <div className="flex flex-col gap-3">
          {menuItems.map((item) => (
            <NavLink key={item.path} to={item.path} className="block w-full">
              {({ isActive }) => (
                <button
                  type="button"
                  className={`w-full text-left px-4 py-2 text-sm font-semibold transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-95 ${isActive ? 'scale-[1.01]' : ''
                    }`}
                  style={{
                    backgroundColor: isActive ? '#1f1f1f' : '#f2f2f2',
                    color: isActive ? '#ffffff' : '#1f1f1f',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                    border: 'none',
                    outline: 'none',
                    borderRadius: '6px',
                    transition: 'all 0.2s ease-in-out',
                    fontFamily: '"Helvetica World", Arial, Helvetica, sans-serif'
                  }}
                  onMouseOver={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = '#ebebeb'
                    }
                  }}
                  onMouseOut={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = '#f2f2f2'
                    }
                  }}
                >
                  {item.label}
                </button>
              )}
            </NavLink>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 transition-all hover:shadow-lg">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
