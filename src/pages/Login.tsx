import { useState } from 'react';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { supabase } from '../hooks/lib/supabase';

interface LoginProps {
  onClose: () => void;
  onLoggedIn: () => void;
}

export default function Login({ onClose, onLoggedIn }: LoginProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [firmName, setFirmName] = useState('');
  const [mobile, setMobile] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const resetForm = () => {
    setFirmName('');
    setMobile('');
    setLocation('');
    setEmail('');
    setPassword('');
    setError(null);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (signUpData.user) {
      const { error: profileError } = await supabase.from('user_profiles').insert({
        id: signUpData.user.id,
        firm_name: firmName,
        mobile,
        location,
        email,
      });

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    onLoggedIn();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: foundEmail } = await supabase.rpc('lookup_email_by_firm', {
      p_firm_name: firmName,
    });

    if (!foundEmail) {
      setError('Firm name not found. Please register first.');
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: foundEmail,
      password,
    });

    if (signInError) {
      setError('Invalid password. Please try again.');
      setLoading(false);
      return;
    }

    setLoading(false);
    onLoggedIn();
  };

  const inputClass =
    'w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent font-opensans';

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage: 'url(/Gemini_Generated_Image_pfxebwpfxebwpfxe_%281%29.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-6">
            <h1
              className="text-2xl font-black font-montserrat mb-1"
              style={{ color: '#1a1a1a' }}
            >
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-sm text-gray-500 font-opensans">
              {mode === 'login'
                ? 'Enter your firm name and password to continue'
                : 'Fill in your details to register'}
            </p>
          </div>

          <form
            onSubmit={mode === 'login' ? handleLogin : handleRegister}
            className="flex flex-col gap-4"
          >
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 font-montserrat">
                Firm / Company Name
              </label>
              <input
                type="text"
                required
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                placeholder="Your firm or company name"
                className={inputClass}
                style={{ '--tw-ring-color': '#fcc201' } as React.CSSProperties}
              />
            </div>

            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 font-montserrat">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 font-montserrat">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, State"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 font-montserrat">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 font-montserrat">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={inputClass}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 font-opensans">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm font-montserrat transition-opacity mt-2"
              style={{
                backgroundColor: '#fcc201',
                color: '#1a1a1a',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <span>{mode === 'login' ? 'Signing in...' : 'Registering...'}</span>
              ) : (
                <>
                  {mode === 'login' ? <LogIn size={16} /> : <UserPlus size={16} />}
                  {mode === 'login' ? 'Sign In' : 'Register'}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 font-opensans">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  resetForm();
                }}
                className="font-semibold font-montserrat underline"
                style={{ color: '#E30613' }}
              >
                {mode === 'login' ? 'Register' : 'Sign In'}
              </button>
            </p>
          </div>

          <button
            onClick={onClose}
            className="mt-4 w-full text-center text-sm text-gray-400 hover:text-gray-600 font-opensans transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </main>
  );
}
