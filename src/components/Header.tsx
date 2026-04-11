import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { Page } from '../App';

interface HeaderProps {
  page: Page;
  setPage: (p: Page) => void;
}

export default function Header({ page, setPage }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (p: Page) => {
    setPage(p);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks: { label: string; page: Page }[] = [
    { label: 'Live Rates', page: 'home' },
    { label: 'About Us', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-0 focus:outline-none"
          >
            <div
              className="font-black text-2xl px-4 py-2 tracking-wide rounded-sm font-montserrat"
              style={{ backgroundColor: '#fcc201', color: '#1a1a1a' }}
            >
              LARG GOLD
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ label, page: p }) => (
              <button
                key={p}
                onClick={() => navigate(p)}
                className="font-medium text-sm transition-colors font-montserrat pb-1 border-b-2"
                style={
                  page === p
                    ? { color: '#E30613', borderColor: '#E30613' }
                    : { color: '#374151', borderColor: 'transparent' }
                }
              >
                {label}
              </button>
            ))}
            <button
              className="border-2 border-gray-800 text-gray-800 px-6 py-2 text-sm font-semibold hover:bg-gray-800 hover:text-white transition-colors rounded-sm font-montserrat"
            >
              Login
            </button>
          </nav>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-4">
            {navLinks.map(({ label, page: p }) => (
              <button
                key={p}
                onClick={() => navigate(p)}
                className="text-left font-medium text-sm font-montserrat"
                style={{ color: page === p ? '#E30613' : '#374151' }}
              >
                {label}
              </button>
            ))}
            <button className="border-2 border-gray-800 text-gray-800 px-6 py-2 text-sm font-semibold w-fit font-montserrat">Login</button>
          </div>
        )}
      </div>
    </header>
  );
}
