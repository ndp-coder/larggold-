import { useState, useRef, useEffect } from 'react';
import { Menu, X, LogOut, MapPin, Phone, Mail, Building2 } from 'lucide-react';
import type { Page } from '../App';

const logoImg = '/files_6010405-2026-04-14T11-02-56-013Z-image.png';

export interface UserProfile {
  firm_name: string;
  mobile: string;
  location: string;
  email: string;
}

interface HeaderProps {
  page: Page;
  setPage: (p: Page) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  profile?: UserProfile | null;
}

export default function Header({ page, setPage, isLoggedIn, onLogout, profile }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navigate = (p: Page) => {
    setPage(p);
    setMenuOpen(false);
    setProfileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks: { label: string; page: Page }[] = [
    { label: 'Live Rates', page: 'home' },
    { label: 'About Us', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  const initials = profile?.firm_name
    ? profile.firm_name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : 'U';

  return (
    <header className="sticky top-0 z-50" style={{ background: 'rgba(0,40,10,0.72)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => navigate('home')} className="flex items-center gap-3 focus:outline-none">
            <div className="h-14 w-14 flex-shrink-0 rounded-full overflow-hidden" style={{ border: '2px solid rgba(252,194,1,0.5)' }}>
              <img src={logoImg} alt="Larg Gold Logo" className="h-full w-full object-cover" />
            </div>
            <div className="font-black text-xl sm:text-2xl tracking-wide font-montserrat" style={{ color: '#fcc201' }}>
              LARG GOLD
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ label, page: p }) => (
              <button
                key={p}
                onClick={() => navigate(p)}
                className="font-medium text-sm transition-colors font-montserrat pb-1 border-b-2"
                style={page === p ? { color: '#fcc201', borderColor: '#fcc201' } : { color: 'rgba(255,255,255,0.85)', borderColor: 'transparent' }}
              >
                {label}
              </button>
            ))}

            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(v => !v)}
                  className="flex items-center justify-center rounded-full focus:outline-none transition-all"
                  style={{ border: `2px solid ${profileOpen ? '#fcc201' : 'rgba(252,194,1,0.4)'}` }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm font-montserrat"
                    style={{ background: 'linear-gradient(135deg, #fcc201, #e6a800)', color: '#1a1a1a' }}
                  >
                    {initials}
                  </div>
                </button>

                {profileOpen && (
                  <div
                    className="absolute right-0 mt-3 w-72 rounded-2xl shadow-2xl overflow-hidden"
                    style={{ background: 'rgba(8,8,8,0.98)', border: '1px solid rgba(252,194,1,0.2)' }}
                  >
                    <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-base font-montserrat flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, #fcc201, #e6a800)', color: '#1a1a1a' }}
                        >
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm font-montserrat text-white leading-tight truncate">{profile?.firm_name || '—'}</p>
                          <p className="text-xs mt-0.5 font-opensans" style={{ color: 'rgba(252,194,1,0.7)' }}>Account</p>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 py-4 flex flex-col gap-3.5">
                      {profile?.firm_name && (
                        <div className="flex items-start gap-3">
                          <Building2 size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#fcc201' }} />
                          <span className="text-sm font-opensans text-white leading-snug">{profile.firm_name}</span>
                        </div>
                      )}
                      {profile?.email && (
                        <div className="flex items-center gap-3">
                          <Mail size={14} className="flex-shrink-0" style={{ color: '#fcc201' }} />
                          <span className="text-sm font-opensans truncate" style={{ color: 'rgba(255,255,255,0.85)' }}>{profile.email}</span>
                        </div>
                      )}
                      {profile?.mobile && (
                        <div className="flex items-center gap-3">
                          <Phone size={14} className="flex-shrink-0" style={{ color: '#fcc201' }} />
                          <span className="text-sm font-opensans" style={{ color: 'rgba(255,255,255,0.85)' }}>{profile.mobile}</span>
                        </div>
                      )}
                      {profile?.location && (
                        <div className="flex items-center gap-3">
                          <MapPin size={14} className="flex-shrink-0" style={{ color: '#fcc201' }} />
                          <span className="text-sm font-opensans" style={{ color: 'rgba(255,255,255,0.85)' }}>{profile.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="px-5 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                      <button
                        onClick={() => { onLogout(); setProfileOpen(false); }}
                        className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold font-montserrat transition-all"
                        style={{ background: 'rgba(227,6,19,0.12)', color: '#E30613', border: '1px solid rgba(227,6,19,0.25)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#E30613'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(227,6,19,0.12)'; (e.currentTarget as HTMLElement).style.color = '#E30613'; }}
                      >
                        <LogOut size={14} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
              <div className="flex flex-col gap-3">
                {profile && (
                  <div className="rounded-xl p-4 flex flex-col gap-2.5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(252,194,1,0.2)' }}>
                    <p className="font-bold text-sm font-montserrat text-white">{profile.firm_name}</p>
                    {profile.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={12} style={{ color: '#fcc201' }} />
                        <span className="text-xs font-opensans" style={{ color: 'rgba(255,255,255,0.8)' }}>{profile.email}</span>
                      </div>
                    )}
                    {profile.mobile && (
                      <div className="flex items-center gap-2">
                        <Phone size={12} style={{ color: '#fcc201' }} />
                        <span className="text-xs font-opensans" style={{ color: 'rgba(255,255,255,0.8)' }}>{profile.mobile}</span>
                      </div>
                    )}
                    {profile.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={12} style={{ color: '#fcc201' }} />
                        <span className="text-xs font-opensans" style={{ color: 'rgba(255,255,255,0.8)' }}>{profile.location}</span>
                      </div>
                    )}
                  </div>
                )}
                <button
                  onClick={() => { onLogout(); setMenuOpen(false); }}
                  className="border-2 px-6 py-2 text-sm font-semibold w-fit font-montserrat"
                  style={{ borderColor: '#E30613', color: '#E30613' }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('login')}
                className="border-2 px-6 py-2 text-sm font-semibold w-fit font-montserrat"
                style={{ borderColor: '#fcc201', color: '#fcc201' }}
              >
                Login
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
