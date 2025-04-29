import { useEffect, useState } from 'react';
import { FaShoppingBag, FaUser, FaSearch } from 'react-icons/fa';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

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
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
      }}>
        {/* Left menu */}
        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontWeight: 600 }}>
          <a href="#" style={{ textDecoration: 'none', color: 'black' }}>SHOP ALL</a>
          <a href="#" style={{ textDecoration: 'none', color: 'black' }}>COLLECTIONS</a>
          <a href="#" style={{ textDecoration: 'none', color: 'black' }}>OUTLET</a>
        </div>

        {/* Center logo */}
        <div>
          <img src="/furia-logo.svg" alt="FURIA Logo" style={{ height: '28px' }} />
        </div>

        {/* Right icons */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <FaSearch size={16} color="black" style={{ cursor: 'pointer' }} />
          <FaUser size={16} color="black" style={{ cursor: 'pointer' }} />
          <a href="https://furia.gg" target="_blank" rel="noopener noreferrer">
            <FaShoppingBag size={16} color="black" style={{ cursor: 'pointer' }} />
          </a>
        </div>
      </div>
    </header>
  );
}
