import { useEffect, useState } from 'react';
import { FaShoppingBag, FaUser, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth(); // returns null if not logged in

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        justifyContent: 'center', // center logo
        alignItems: 'center',
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        position: 'relative', // for absolute positioning
      }}>
        {/* Center logo */}
        <div>
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
          <FaSearch size={16} color="black" style={{ cursor: 'pointer' }} />
          <FaUser
            size={16}
            color="black"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(user ? '/perfil' : '/entrar')}
          />
          <a href="https://furia.gg" target="_blank" rel="noopener noreferrer">
            <FaShoppingBag size={16} color="black" style={{ cursor: 'pointer' }} />
          </a>
        </div>
      </div>
    </header>
  );
}
