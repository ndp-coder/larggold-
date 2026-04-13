import { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import { supabase } from '../hooks/lib/supabase';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: dbError } = await supabase.from('contact_messages').insert({
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
    });
    setLoading(false);
    if (dbError) {
      setError('Something went wrong. Please try again.');
    } else {
      setSubmitted(true);
    }
  };

  const contactDetails = [
    {
      icon: Phone,
      label: 'Phone',
      value: '+91 8184839498',
      href: 'tel:+918184839498',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'support@larggold.com',
      href: 'mailto:support@larggold.com',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Murali Krishna, India',
      href: null,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <section
        className="relative py-24 text-white"
        style={{
          background:
            'linear-gradient(rgba(0,0,0,0.72), rgba(0,0,0,0.82)), url("https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=1200") center/cover no-repeat',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-4 font-montserrat"
            style={{ color: '#fcc201' }}
          >
            Get In Touch
          </p>
          <h1 className="text-4xl md:text-5xl font-black mb-6 font-montserrat">Contact Us</h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto leading-relaxed font-opensans">
            Have questions about our rates, services, or platform? We're here to help.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-black mb-2 text-gray-900 font-montserrat">
              Reach Out Directly
            </h2>
            <p className="text-gray-500 text-sm mb-8 font-opensans">
              Our team typically responds within a few hours during business days.
            </p>

            <div className="flex flex-col gap-6">
              {contactDetails.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#fef9e7' }}
                  >
                    <Icon size={20} style={{ color: '#fcc201' }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 font-montserrat">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="text-gray-800 font-semibold text-sm font-opensans hover:underline"
                        style={{ color: '#1a1a1a' }}
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-gray-800 font-semibold text-sm font-opensans">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div
              className="mt-10 rounded-xl p-6 border"
              style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a' }}
            >
              <p className="text-sm font-bold text-gray-800 mb-1 font-montserrat">Business Hours</p>
              <p className="text-xs text-gray-600 font-opensans">Monday – Saturday: 9:00 AM – 7:00 PM IST</p>
              <p className="text-xs text-gray-600 font-opensans">Sunday: Closed</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <CheckCircle size={48} style={{ color: '#fcc201' }} className="mb-4" />
                <h3 className="text-xl font-black text-gray-900 mb-2 font-montserrat">Message Sent!</h3>
                <p className="text-gray-500 text-sm font-opensans">
                  Thank you for reaching out. We'll get back to you shortly.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', message: '' }); }}
                  className="mt-6 text-sm font-semibold font-montserrat underline"
                  style={{ color: '#E30613' }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <h2 className="text-xl font-black text-gray-900 font-montserrat mb-1">Send a Message</h2>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 font-montserrat">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent font-opensans"
                    style={{ '--tw-ring-color': '#fcc201' } as React.CSSProperties}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 font-montserrat">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent font-opensans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 font-montserrat">
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent font-opensans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 font-montserrat">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent resize-none font-opensans"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 font-opensans">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm font-montserrat transition-opacity"
                  style={{ backgroundColor: '#fcc201', color: '#1a1a1a', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
