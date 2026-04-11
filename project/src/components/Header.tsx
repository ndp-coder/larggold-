import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <div
              className="text-white font-black text-2xl px-4 py-2 tracking-wide rounded-sm font-montserrat"
              style={{ backgroundColor: '#E30613' }}
            >
              LARG
            </div>
            <div className="text-gray-600 text-sm font-semibold tracking-widest uppercase leading-tight font-montserrat">
              GOLD
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#rates"
              className="font-semibold border-b-2 pb-1 text-sm transition-colors font-montserrat"
              style={{ color: '#E30613', borderColor: '#E30613' }}
            >
              Live Rates
            </a>
            <a href="#about" className="text-gray-700 font-medium text-sm hover:text-red-600 transition-colors font-montserrat">
              About Us
            </a>
            <a href="#download" className="text-gray-700 font-medium text-sm hover:text-red-600 transition-colors font-montserrat">
              Download
            </a>
            <a href="#contact" className="text-gray-700 font-medium text-sm hover:text-red-600 transition-colors font-montserrat">
              Contact
            </a>
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
            <a href="#rates" onClick={() => setMenuOpen(false)} className="font-semibold text-sm font-montserrat" style={{ color: '#E30613' }}>Live Rates</a>
            <a href="#about" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium text-sm font-montserrat">About Us</a>
            <a href="#download" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium text-sm font-montserrat">Download</a>
            <a href="#contact" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium text-sm font-montserrat">Contact</a>
            <button className="border-2 border-gray-800 text-gray-800 px-6 py-2 text-sm font-semibold w-fit font-montserrat">Login</button>
          </div>
        )}
      </div>
    </header>
  );
}
