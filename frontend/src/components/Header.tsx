import { FaShoppingBag, FaUser, FaSearch } from 'react-icons/fa';

export default function Header() {
  return (
    <header className="w-full flex justify-between items-center p-4 border-b border-gray-200">
      <div className="flex gap-6">
        <a href="#" className="text-sm font-semibold">SHOP ALL</a>
        <a href="#" className="text-sm font-semibold">COLLECTIONS</a>
        <a href="#" className="text-sm font-semibold">OUTLET</a>
      </div>
      <div>
        <img src="/furia-logo.svg" alt="Furia Logo" className="h-8" />
      </div>
      <div className="flex gap-4 items-center">
        <FaSearch size={18} className="cursor-pointer" />
        <FaUser size={18} className="cursor-pointer" />
        <a href="https://furia.gg" target="_blank" rel="noopener noreferrer">
          <FaShoppingBag size={18} className="cursor-pointer" />
        </a>
      </div>
    </header>
  );
}
