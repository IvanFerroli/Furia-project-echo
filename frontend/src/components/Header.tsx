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
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-6 py-2">
        {/* Left menu */}
        <div className="flex gap-6 text-xs md:text-sm">
          <a href="#" className="font-semibold hover:opacity-70">SHOP ALL</a>
          <a href="#" className="font-semibold hover:opacity-70">COLLECTIONS</a>
          <a href="#" className="font-semibold hover:opacity-70">OUTLET</a>
        </div>

        {/* Center logo */}
        <div className="flex justify-center">
          <img src="/furia-logo.svg" alt="FURIA Logo" className="h-6 md:h-8" />
        </div>

        {/* Right icons */}
        <div className="flex gap-4 items-center">
          <FaSearch size={18} className="cursor-pointer hover:opacity-70" />
          <FaUser size={18} className="cursor-pointer hover:opacity-70" />
          <a href="https://furia.gg" target="_blank" rel="noopener noreferrer">
            <FaShoppingBag size={18} className="cursor-pointer hover:opacity-70" />
          </a>
        </div>
      </div>
    </header>
  );
}
