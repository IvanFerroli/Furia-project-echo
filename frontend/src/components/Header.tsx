import { useEffect, useState } from 'react';
import { ShoppingBag, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../services/firebase';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      setShowMenu(false);
      navigate('/entrar');
    });
  };

  const handleLoginClick = () => {
    if (!user) navigate('/entrar');
  };

  return (
    <header
      style={{
        height: '76px',
        backgroundColor: 'white',
        zIndex: 99,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: scrolled ? '0 4px 10px rgba(0, 0, 0, 0.1)' : 'none',
        transition: 'box-shadow 0.3s ease-in-out',
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        position: 'relative',
      }}>
        {/* Center logo com navegação */}
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img src="/furia-logo.svg" alt="FURIA Logo" style={{ height: '28px' }} />
        </div>

        {/* Right icons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          position: 'absolute',
          right: 0,
        }}>

          {/* Avatar com hover menu mais suave */}
          <div
            style={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
          >
            <div onClick={handleLoginClick}>
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Avatar"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/furia-logos.png';
                  }}
                  style={{
                    height: '26px',
                    width: '26px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    objectFit: 'cover',
                    border: '1px solid black',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    marginBottom: '4px',
                  }}

                />
              ) : (

                <User
                  size={24} // Aumentei aqui
                  strokeWidth={1.5}
                  style={{
                    color: 'black',
                    cursor: 'pointer',
                  }}
                />



              )}
            </div>

            {/* Menu com margem negativa pra colar no ícone */}
            {user && showMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: 0,
                  left: -60, // 👈 joga pra fora da caixa
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  zIndex: 999,
                  padding: '8px',
                  width: '140px', // 👈 aumentou pra direita
                  marginTop: '-2px',
                  paddingBottom: '12px', // 👈 mais tolerância no mouseLeave
                }}
              >
                <button
                  onClick={() => navigate('/perfil')}
                  style={{
                    width: '100%',
                    padding: '6px',
                    fontSize: '13px',
                    textAlign: 'left',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Meu perfil
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '6px',
                    fontSize: '13px',
                    textAlign: 'left',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Sair
                </button>
              </div>
            )}

          </div>


          <div>
            <a href="https://furia.gg" target="_blank" rel="noopener noreferrer">
              <ShoppingBag
                size={24}
                strokeWidth={1.5}
                style={{
                  color: 'black',
                  cursor: 'pointer',
                }}
              />


            </a>
          </div>
        </div>
      </div>
    </header>
  );

}
