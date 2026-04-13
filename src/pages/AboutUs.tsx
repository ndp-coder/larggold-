import { Shield, TrendingUp, Users, Zap, Eye, Network, ArrowRight } from 'lucide-react';
import type { Page } from '../App';

interface AboutUsProps {
  setPage?: (p: Page) => void;
}

export default function AboutUs({ setPage }: AboutUsProps) {
  const services = [
    {
      title: 'Gold Release Services',
      description:
        'We help customers release their pledged gold from banks/NBFCs at the right time, avoiding losses and penalties.',
    },
    {
      title: 'Gold Buying & Selling',
      description:
        'We buy gold directly from customers at live market rates, ensuring they get the best possible value.',
    },
    {
      title: 'Market-Based Pricing',
      description:
        'Unlike traditional buyers, we follow real-time market pricing, giving customers fair and transparent deals.',
    },
    {
      title: 'Financial Guidance',
      description:
        'We guide customers on when to release, sell, or hold gold to maximize their financial benefit.',
    },
  ];

  const whyUs = [
    {
      icon: TrendingUp,
      title: 'Maximum Value Assurance',
      description:
        'We ensure customers get higher returns compared to local buyers and auction losses.',
    },
    {
      icon: Eye,
      title: 'Complete Transparency',
      description: 'No hidden charges, no confusion — 100% clear process from start to end.',
    },
    {
      icon: Zap,
      title: 'Fast & Hassle-Free Process',
      description: 'Quick documentation and smooth execution to save time and effort.',
    },
    {
      icon: Network,
      title: 'Strong Network',
      description:
        'We work closely with banks, NBFCs, and gold markets to provide the best solutions.',
    },
    {
      icon: Users,
      title: 'Customer-First Approach',
      description: 'Every decision we make is focused on customer benefit and long-term trust.',
    },
    {
      icon: Shield,
      title: 'Ethical & Reliable',
      description: 'Honest services built on long-term relationships, not just transactions.',
    },
  ];

  const growthPoints = [
    'Expand operations across multiple cities in India',
    'Build a strong digital platform (App + Website)',
    'Create a network of 100+ partners & agents',
    'Handle high-volume gold transactions monthly',
    'Become a recognized brand in the gold industry',
  ];

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundImage: 'url(/Gemini_Generated_Image_pfxebwpfxebwpfxe_(1).png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <section
        className="relative py-28 text-white"
        style={{
          background:
            'linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.85)), url("https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=1200") center/cover no-repeat',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-4 font-montserrat"
            style={{ color: '#fcc201' }}
          >
            Est. 2026 · Vijayawada, India
          </p>
          <h1 className="text-4xl md:text-6xl font-black mb-6 font-montserrat leading-tight">
            About Larg Gold
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-opensans">
            India's Emerging Leader in Gold Buying, Selling & Release Solutions.
          </p>
          <p
            className="text-sm font-semibold mt-4 font-montserrat tracking-wide"
            style={{ color: '#fcc201' }}
          >
            Your Gold, Your Value – Maximized.
          </p>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(2px)' }}>
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          <div>
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3 font-montserrat"
              style={{ color: '#E30613' }}
            >
              Who We Are
            </p>
            <h2 className="text-3xl font-black mb-5 text-gray-900 font-montserrat leading-snug">
              Revolutionizing the Way India Deals in Gold
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4 font-opensans text-sm">
              LARG GOLD is a fast-growing and trusted gold solutions company based in Vijayawada (est. 2026),
              built with a vision to revolutionize the way people buy, sell, and release pledged gold.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4 font-opensans text-sm">
              We specialize in helping customers unlock the true value of their gold by releasing pledged
              gold from banks and NBFCs and enabling them to sell at real-time market prices. Our business
              bridges the gap between financial institutions and customers, ensuring maximum value,
              transparency, and convenience.
            </p>
            <p className="text-gray-600 leading-relaxed font-opensans text-sm">
              With a strong foundation in the gold ecosystem, we combine market expertise, strategic
              partnerships, and customer-first service to deliver a seamless experience in every transaction.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img
              src="https://images.pexels.com/photos/3944405/pexels-photo-3944405.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Gold bars"
              className="w-full h-80 object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: 'rgba(243,244,246,0.85)', backdropFilter: 'blur(2px)' }}>
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            className="rounded-2xl p-10 text-white"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            <div
              className="inline-block text-xs font-bold tracking-widest uppercase mb-4 font-montserrat px-3 py-1 rounded"
              style={{ backgroundColor: '#fcc201', color: '#1a1a1a' }}
            >
              Our Vision
            </div>
            <p className="text-gray-200 leading-relaxed font-opensans text-sm">
              To become India's most trusted and largest gold transaction platform, empowering customers
              with transparent, profitable, and hassle-free gold solutions.
            </p>
          </div>
          <div
            className="rounded-2xl p-10 text-white"
            style={{ backgroundColor: '#E30613' }}
          >
            <div
              className="inline-block text-xs font-bold tracking-widest uppercase mb-4 font-montserrat px-3 py-1 rounded bg-white"
              style={{ color: '#E30613' }}
            >
              Our Mission
            </div>
            <ul className="space-y-2 text-sm text-red-100 font-opensans">
              <li className="flex items-start gap-2">
                <span className="text-white font-bold mt-0.5">·</span>
                Customers get maximum value for their gold
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white font-bold mt-0.5">·</span>
                Every transaction is transparent and trustworthy
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white font-bold mt-0.5">·</span>
                Gold liquidity becomes simple, fast, and accessible
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white font-bold mt-0.5">·</span>
                Continuously expand our network across banks, NBFCs, and markets
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(2px)' }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3 font-montserrat"
              style={{ color: '#E30613' }}
            >
              What We Do
            </p>
            <h2 className="text-3xl font-black text-gray-900 font-montserrat">
              End-to-End Gold Solutions
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map(({ title, description }) => (
              <div
                key={title}
                className="border border-gray-100 rounded-xl p-7 hover:shadow-md transition-shadow bg-gray-50"
              >
                <div
                  className="w-2 h-6 rounded mb-4"
                  style={{ backgroundColor: '#fcc201' }}
                />
                <h3 className="font-bold text-base mb-2 text-gray-900 font-montserrat">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed font-opensans">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: 'rgba(243,244,246,0.85)', backdropFilter: 'blur(2px)' }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3 font-montserrat"
              style={{ color: '#E30613' }}
            >
              Why Choose Us
            </p>
            <h2 className="text-3xl font-black text-gray-900 font-montserrat">
              Why Choose Larg Gold?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUs.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white rounded-xl p-7 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#fef9e7' }}
                >
                  <Icon size={20} style={{ color: '#fcc201' }} />
                </div>
                <h3 className="font-bold text-sm mb-2 text-gray-900 font-montserrat">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-opensans">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(2px)' }}>
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-14 items-start">
          <div>
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3 font-montserrat"
              style={{ color: '#E30613' }}
            >
              Business Model
            </p>
            <h2 className="text-2xl font-black mb-5 text-gray-900 font-montserrat">
              How We Operate
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 font-opensans">
              We operate on a hybrid model (B2C + B2B) that allows us to scale rapidly while
              maintaining high service quality.
            </p>
            <div className="flex flex-col gap-4">
              <div
                className="rounded-xl p-5 border-l-4"
                style={{ backgroundColor: '#fffbeb', borderColor: '#fcc201' }}
              >
                <p className="font-bold text-sm text-gray-900 font-montserrat mb-1">B2C</p>
                <p className="text-sm text-gray-600 font-opensans">
                  Directly serving customers for gold release and selling.
                </p>
              </div>
              <div
                className="rounded-xl p-5 border-l-4"
                style={{ backgroundColor: '#fff5f5', borderColor: '#E30613' }}
              >
                <p className="font-bold text-sm text-gray-900 font-montserrat mb-1">B2B</p>
                <p className="text-sm text-gray-600 font-opensans">
                  Partnering with agents, financial consultants, and institutions.
                </p>
              </div>
            </div>
          </div>

          <div>
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3 font-montserrat"
              style={{ color: '#E30613' }}
            >
              Growth Vision
            </p>
            <h2 className="text-2xl font-black mb-5 text-gray-900 font-montserrat">
              Next 5 Years
            </h2>
            <ul className="space-y-3">
              {growthPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <ArrowRight size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#fcc201' }} />
                  <span className="text-sm text-gray-600 font-opensans">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        className="py-20 text-white relative"
        style={{
          background:
            'linear-gradient(rgba(0,0,0,0.82), rgba(0,0,0,0.88)), url("https://images.pexels.com/photos/3944405/pexels-photo-3944405.jpeg?auto=compress&cs=tinysrgb&w=1200") center/cover no-repeat',
        }}
      >
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-4 font-montserrat"
            style={{ color: '#fcc201' }}
          >
            Our Commitment
          </p>
          <h2 className="text-3xl md:text-4xl font-black mb-6 font-montserrat">
            We Don't Just Deal in Gold
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6 font-opensans">
            We help people unlock financial value and make smarter decisions. Building long-term
            relationships, delivering honest and ethical services, and continuously innovating to
            improve customer experience.
          </p>
          <div
            className="text-lg font-black font-montserrat mb-8"
            style={{ color: '#fcc201' }}
          >
            LARG GOLD – India's Emerging Leader in Gold Buying, Selling & Release Solutions.
          </div>
          {setPage && (
            <button
              onClick={() => { setPage('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-sm font-montserrat transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#fcc201', color: '#1a1a1a' }}
            >
              Get In Touch
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
