import { useState } from 'react';
import { Eye, EyeOff, LogIn, UserPlus, KeyRound, ArrowLeft, ShieldCheck } from 'lucide-react';
import { supabase } from '../hooks/lib/supabase';

interface LoginProps {
  onClose: () => void;
  onLoggedIn: () => void;
}

type Mode = 'login' | 'register' | 'forgot' | 'verify-otp' | 'new-password';

export default function Login({ onClose, onLoggedIn }: LoginProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [firmName, setFirmName] = useState('');
  const [mobile, setMobile] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');

  const resetForm = () => {
    setFirmName('');
    setMobile('');
    setLocation('');
    setEmail('');
    setPassword('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setResetEmail('');
    setError(null);
    setSuccess(null);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });

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

      try {
        await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-welcome-email`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ to: email, firmName }),
          }
        );
      } catch (_) {
      }
    }

    setLoading(false);
    onLoggedIn();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: foundEmail } = await supabase.rpc('lookup_email_by_firm', { p_firm_name: firmName });

    if (!foundEmail) {
      setError('Firm name not found. Please register first.');
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email: foundEmail, password });

    if (signInError) {
      setError('Invalid password. Please try again.');
      setLoading(false);
      return;
    }

    setLoading(false);
    onLoggedIn();
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const { error: otpError } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: undefined,
    });

    if (otpError) {
      setError(otpError.message);
      setLoading(false);
      return;
    }

    setSuccess('A 6-digit OTP has been sent to your email address.');
    setLoading(false);
    setMode('verify-otp');
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: resetEmail,
      token: otp,
      type: 'recovery',
    });

    if (verifyError) {
      setError('Invalid or expired OTP. Please try again.');
      setLoading(false);
      return;
    }

    setLoading(false);
    setMode('new-password');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setSuccess('Password updated successfully! You can now sign in.');
    setTimeout(() => {
      resetForm();
      setMode('login');
    }, 2000);
  };

  const inputClass =
    'w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent font-opensans';

  const titles: Record<Mode, { heading: string; sub: string }> = {
    login: { heading: 'Welcome Back', sub: 'Enter your firm name and password to continue' },
    register: { heading: 'Create Account', sub: 'Fill in your details to register' },
    forgot: { heading: 'Reset Password', sub: 'Enter your registered email to receive an OTP' },
    'verify-otp': { heading: 'Verify OTP', sub: `Enter the 6-digit code sent to ${resetEmail}` },
    'new-password': { heading: 'New Password', sub: 'Set your new password to complete the reset' },
  };

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
            <h1 className="text-2xl font-black font-montserrat mb-1" style={{ color: '#1a1a1a' }}>
              {titles[mode].heading}
            </h1>
            <p className="text-sm text-gray-500 font-opensans">{titles[mode].sub}</p>
          </div>

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 font-montserrat">
                  Firm / Company Name
                </label>
                <input
                  type="text"
                  required
                  value={firmName}
                  onChange={e => setFirmName(e.target.value)}
                  placeholder="Your firm or company name"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 font-montserrat">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={inputClass}
                    minLength={6}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => { resetForm(); setMode('forgot'); }}
                  className="mt-1.5 text-xs font-semibold font-montserrat float-right"
                  style={{ color: '#E30613' }}
                >
                  Forgot Password?
                </button>
              </div>
              {error && <p className="text-sm text-red-600 font-opensans">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm font-montserrat transition-opacity mt-2"
                style={{ backgroundColor: '#fcc201', color: '#1a1a1a', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? <span>Signing in...</span> : <><LogIn size={16} />Sign In</>}
              </button>
              <div className="text-center mt-2">
                <p className="text-sm text-gray-500 font-opensans">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { resetForm(); setMode('register'); }}
                    className="font-semibold font-montserrat underline"
                    style={{ color: '#E30613' }}
                  >
                    Register
                  </button>
                </p>
              </div>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 font-montserrat">Firm / Company Name</label>
                <input type="text" required value={firmName} onChange={e => setFirmName(e.target.value)} placeholder="Your firm or company name" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 font-montserrat">Mobile Number</label>
                <input type="tel" required value={mobile} onChange={e => setMobile(e.target.value)} placeholder="+91 XXXXX XXXXX" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 font-montserrat">Location</label>
                <input type="text" required value={location} onChange={e => setLocation(e.target.value)} placeholder="City, State" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 font-montserrat">Email Address</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 font-montserrat">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={inputClass}
                    minLength={6}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {error && <p className="text-sm text-red-600 font-opensans">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm font-montserrat transition-opacity mt-2"
                style={{ backgroundColor: '#fcc201', color: '#1a1a1a', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? <span>Registering...</span> : <><UserPlus size={16} />Register</>}
              </button>
              <div className="text-center mt-2">
                <p className="text-sm text-gray-500 font-opensans">
                  Already have an account?{' '}
                  <button type="button" onClick={() => { resetForm(); setMode('login'); }} className="font-semibold font-montserrat underline" style={{ color: '#E30613' }}>Sign In</button>
                </p>
              </div>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 font-montserrat">Registered Email</label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
              {error && <p className="text-sm text-red-600 font-opensans">{error}</p>}
              {success && <p className="text-sm font-opensans" style={{ color: '#006b2a' }}>{success}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm font-montserrat transition-opacity"
                style={{ backgroundColor: '#fcc201', color: '#1a1a1a', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? <span>Sending OTP...</span> : <><KeyRound size={16} />Send OTP</>}
              </button>
              <button
                type="button"
                onClick={() => { resetForm(); setMode('login'); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold font-montserrat text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft size={14} />Back to Sign In
              </button>
            </form>
          )}

          {mode === 'verify-otp' && (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 font-montserrat">6-Digit OTP</label>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter OTP"
                  className={inputClass}
                  maxLength={6}
                  inputMode="numeric"
                  style={{ letterSpacing: '0.3em', fontSize: '20px', textAlign: 'center' }}
                />
              </div>
              {error && <p className="text-sm text-red-600 font-opensans">{error}</p>}
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm font-montserrat transition-opacity"
                style={{ backgroundColor: '#fcc201', color: '#1a1a1a', opacity: (loading || otp.length < 6) ? 0.6 : 1 }}
              >
                {loading ? <span>Verifying...</span> : <><ShieldCheck size={16} />Verify OTP</>}
              </button>
              <button
                type="button"
                onClick={() => { resetForm(); setMode('forgot'); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold font-montserrat text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft size={14} />Back
              </button>
            </form>
          )}

          {mode === 'new-password' && (
            <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 font-montserrat">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className={inputClass}
                    minLength={6}
                  />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 font-montserrat">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className={inputClass}
                  minLength={6}
                />
              </div>
              {error && <p className="text-sm text-red-600 font-opensans">{error}</p>}
              {success && <p className="text-sm font-opensans font-semibold" style={{ color: '#006b2a' }}>{success}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm font-montserrat transition-opacity"
                style={{ backgroundColor: '#fcc201', color: '#1a1a1a', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? <span>Updating...</span> : <><KeyRound size={16} />Update Password</>}
              </button>
            </form>
          )}

          {(mode === 'login' || mode === 'register') && (
            <button
              onClick={onClose}
              className="mt-4 w-full text-center text-sm text-gray-400 hover:text-gray-600 font-opensans transition-colors"
            >
              Back to Home
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
