import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { Page } from '../App';
const logoImg = '/files_6010405-2026-04-14T11-02-56-013Z-image.png';

interface HeaderProps {
  page: Page;
  setPage: (p: Page) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export default function Header({ page, setPage, isLoggedIn, onLogout }: HeaderProps) {
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
    <header className="sticky top-0 z-50" style={{ background: 'rgba(0,40,10,0.72)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-3 focus:outline-none h-full"
          >
            <img
              src={logoImg}
              alt="Larg Gold Logo"
              className="h-full w-auto object-contain py-1"
            />
            <div
              className="font-black text-2xl tracking-wide font-montserrat"
              style={{ color: '#fcc201' }}
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
                    ? { color: '#fcc201', borderColor: '#fcc201' }
                    : { color: 'rgba(255,255,255,0.85)', borderColor: 'transparent' }
                }
              >
                {label}
              </button>
            ))}
            {isLoggedIn ? (
              <button
                onClick={() => { onLogout(); setMenuOpen(false); }}
                className="border-2 px-6 py-2 text-sm font-semibold transition-colors rounded-sm font-montserrat"
                style={{ borderColor: '#E30613', color: '#E30613' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.background = '#E30613'; (e.target as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.background = 'transparent'; (e.target as HTMLElement).style.color = '#E30613'; }}
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate('login')}
                className="border-2 px-6 py-2 text-sm font-semibold transition-colors rounded-sm font-montserrat"
                style={{ borderColor: '#fcc201', color: '#fcc201' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.background = '#fcc201'; (e.target as HTMLElement).style.color = '#111'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.background = 'transparent'; (e.target as HTMLElement).style.color = '#fcc201'; }}
              >
                Login
              </button>
            )}
          </nav>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ color: 'white' }}>
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
                style={{ color: page === p ? '#fcc201' : 'rgba(255,255,255,0.85)' }}
              >
                {label}
              </button>
            ))}
            {isLoggedIn ? (
              <button onClick={() => { onLogout(); setMenuOpen(false); }} className="border-2 px-6 py-2 text-sm font-semibold w-fit font-montserrat" style={{ borderColor: '#E30613', color: '#E30613' }}>Logout</button>
            ) : (
              <button onClick={() => navigate('login')} className="border-2 px-6 py-2 text-sm font-semibold w-fit font-montserrat" style={{ borderColor: '#fcc201', color: '#fcc201' }}>Login</button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
