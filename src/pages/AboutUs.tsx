import { TrendingUp, Shield, Eye, Zap, Truck, Target, ArrowRight, CheckCircle } from 'lucide-react';
import type { Page } from '../App';

interface AboutUsProps {
  setPage?: (p: Page) => void;
}

const whyChooseUs = [
  {
    icon: TrendingUp,
    title: 'Live Market Pricing',
    description: 'Our prices are directly aligned with international and MCX market movements — not manually adjusted guesswork.',
  },
  {
    icon: Truck,
    title: 'Strong Supply Network',
    description: 'We ensure consistent availability of gold and silver across all major weights without delays.',
  },
  {
    icon: Eye,
    title: 'Transparency First',
    description: 'No hidden margins, no manipulation — what you see is what you trade.',
  },
  {
    icon: Shield,
    title: 'Precision & Purity',
    description: 'All products meet strict industry standards with guaranteed weight and purity accuracy.',
  },
  {
    icon: Zap,
    title: 'Speed & Execution',
    description: 'Fast order processing, quick confirmations, and reliable delivery systems.',
  },
];

const missionPoints = [
  'Deliver real-time, market-linked bullion prices',
  'Build a seamless and secure trading experience',
  'Maintain institutional-level standards in purity and logistics',
  'Scale aggressively across major trading hubs',
];

export default function AboutUs({ setPage }: AboutUsProps) {
  return (
    <main
      className="min-h-screen"
      style={{
        backgroundImage: 'url(/Gemini_Generated_Image_pfxebwpfxebwpfxe_%281%29.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <section
        className="relative py-28 text-white"
        style={{
          background: 'linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.85)), url("https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=1200") center/cover no-repeat',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6 font-montserrat leading-tight">
            ABOUT US
          </h1>
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
              Built for Precision, Speed & Trust
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4 font-opensans text-sm">
              We are a high-volume bullion trading company built for precision, speed, and trust in the modern gold market. With a growing presence across multiple cities, we specialize in delivering real-time gold and silver pricing aligned with live market movements.
            </p>
            <p className="text-gray-800 font-semibold leading-relaxed font-opensans text-sm">
              Our core focus is simple: accurate pricing, reliable supply, and zero compromise on purity.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4 font-opensans text-sm">
              We don't operate like traditional dealers — we operate like a market-driven pricing engine backed by strong physical supply chains.
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
          <div className="rounded-2xl p-10 text-white" style={{ backgroundColor: '#1a1a1a' }}>
            <div className="flex items-center gap-3 mb-5">
              <Target size={22} style={{ color: '#fcc201' }} />
              <div
                className="inline-block text-xs font-bold tracking-widest uppercase font-montserrat px-3 py-1 rounded"
                style={{ backgroundColor: '#fcc201', color: '#1a1a1a' }}
              >
                Our Vision
              </div>
            </div>
            <p className="text-gray-200 leading-relaxed font-opensans text-sm">
              To become the most trusted and technologically advanced bullion platform in India, setting the benchmark for transparency, pricing accuracy, and execution speed.
            </p>
          </div>
          <div className="rounded-2xl p-10 text-white" style={{ backgroundColor: '#E30613' }}>
            <div className="flex items-center gap-3 mb-5">
              <Target size={22} className="text-white" />
              <div
                className="inline-block text-xs font-bold tracking-widest uppercase font-montserrat px-3 py-1 rounded bg-white"
                style={{ color: '#E30613' }}
              >
                Our Mission
              </div>
            </div>
            <ul className="space-y-3 text-sm text-red-100 font-opensans">
              {missionPoints.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-white mt-0.5 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
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
              Why Choose Us
            </p>
            <h2 className="text-3xl font-black text-gray-900 font-montserrat">
              What Sets Us Apart
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map(({ icon: Icon, title, description }) => (
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

      <section className="py-16" style={{ backgroundColor: 'rgba(243,244,246,0.85)', backdropFilter: 'blur(2px)' }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3 font-montserrat"
              style={{ color: '#E30613' }}
            >
              Our Edge
            </p>
            <h2 className="text-2xl font-black text-gray-900 font-montserrat mb-4">
              Why We're Different
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed font-opensans max-w-2xl mx-auto">
              Most bullion businesses rely on outdated pricing models and slow operations. We focus on automation, real-time data, and scalability — the things that actually matter in today's market.
            </p>
          </div>
        </div>
      </section>

      <section
        className="py-20 text-white relative"
        style={{
          background: 'linear-gradient(rgba(0,0,0,0.82), rgba(0,0,0,0.88)), url("https://images.pexels.com/photos/3944405/pexels-photo-3944405.jpeg?auto=compress&cs=tinysrgb&w=1200") center/cover no-repeat',
        }}
      >
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-4 font-montserrat"
            style={{ color: '#fcc201' }}
          >
            Our Promise
          </p>
          <h2 className="text-3xl md:text-4xl font-black mb-6 font-montserrat">
            We're Not Just Another Bullion Dealer
          </h2>
          <p className="text-gray-300 leading-relaxed mb-8 font-opensans text-lg">
            We're building a next-generation bullion ecosystem designed for serious traders and businesses.
          </p>
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
