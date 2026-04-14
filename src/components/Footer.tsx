import { Phone, MapPin, ArrowUp } from 'lucide-react';
import type { Page } from '../App';

interface FooterProps {
  setPage: (p: Page) => void;
}

export default function Footer({ setPage }: FooterProps) {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer
      className="relative text-white"
      style={{
        background: 'linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.92)), url("https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=1200") center/cover no-repeat',
      }}
      id="contact"
    >
      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          <div id="about">
            <h3 className="font-bold text-base mb-4 tracking-wide font-montserrat">Delivery Desk</h3>
            <div className="flex items-center gap-2 text-sm text-gray-300 mb-2 font-opensans">
              <Phone size={14} className="flex-shrink-0" style={{ color: '#fcc201' }} />
              <span>+91 8184839498</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300 font-opensans">
              <MapPin size={14} className="flex-shrink-0" style={{ color: '#fcc201' }} />
              <span>vijayawada, India</span>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-base mb-4 tracking-wide font-montserrat">Customer Support</h3>
            <div className="flex items-center gap-2 text-sm text-gray-300 mb-2 font-opensans">
              <Phone size={14} className="flex-shrink-0" style={{ color: '#fcc201' }} />
              <span>+91 9581366889</span>
            </div>
            <div className="text-sm text-gray-300 font-opensans">larggold@gmail.com</div>
          </div>

          <div id="download">
            <h3 className="font-bold text-base mb-4 tracking-wide font-montserrat">Download App</h3>
            <div className="flex flex-col gap-3">
              <div className="bg-black border border-gray-600 rounded-lg px-4 py-2 flex items-center gap-3 w-fit cursor-pointer transition-colors"
                style={{ borderColor: undefined }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#fcc201')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#4B5563')}
                onClick={() => alert('Coming soon on Google Play!')}
                title="Coming Soon"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                  <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.36.6 1.24 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z"/>
                </svg>
                <div>
                  <div className="text-xs text-gray-400 leading-none font-opensans">GET IT ON</div>
                  <div className="text-sm font-semibold leading-tight font-montserrat">Google Play</div>
                </div>
              </div>
              <div className="bg-black border border-gray-600 rounded-lg px-4 py-2 flex items-center gap-3 w-fit cursor-pointer transition-colors"
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#fcc201')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#4B5563')}
                onClick={() => alert('Coming soon on the App Store!')}
                title="Coming Soon"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.19 1.28-2.17 3.82.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.76M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div>
                  <div className="text-xs text-gray-400 leading-none font-opensans">Available on the</div>
                  <div className="text-sm font-semibold leading-tight font-montserrat">App Store</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-8 text-center">
          <p className="text-sm font-bold tracking-widest text-white mb-4 uppercase font-montserrat">
            Larg Gold 
          </p>
          <div className="flex justify-center gap-6 mb-4">
            <button
              onClick={() => { setPage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-xs text-gray-400 hover:text-yellow-400 transition-colors font-opensans"
            >
              About Us
            </button>
            <button
              onClick={() => { setPage('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-xs text-gray-400 hover:text-yellow-400 transition-colors font-opensans"
            >
              Contact
            </button>
          </div>
          <p className="text-xs text-gray-400 leading-loose font-opensans">
            vijayawada &nbsp;|&nbsp; India
          </p>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <p className="text-xs text-gray-500 font-opensans">
            Copyrights &copy; Larg Gold &nbsp;<span className="text-gray-600">Version 1.0</span>
          </p>
          <button
            onClick={scrollTop}
            className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center transition-colors"
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#fcc201')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#374151')}
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
