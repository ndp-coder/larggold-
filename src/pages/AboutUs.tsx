import { Shield, TrendingUp, Users, Award } from 'lucide-react';

export default function AboutUs() {
  const values = [
    {
      icon: Shield,
      title: 'Trust & Transparency',
      description: 'We provide accurate, real-time metal pricing with complete transparency. No hidden fees, no surprises.',
    },
    {
      icon: TrendingUp,
      title: 'Market Expertise',
      description: 'Years of experience in precious metals markets ensure you get the most reliable rates and insights.',
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'Our dedicated team is always available to assist jewellers, traders, and investors across India.',
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'All rates are sourced from certified exchanges and verified by our expert analysts daily.',
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
            Who We Are
          </p>
          <h1 className="text-4xl md:text-5xl font-black mb-6 font-montserrat">About Larg Gold</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-opensans">
            Larg Gold Private Limited is India's trusted platform for live precious metal rates,
            serving jewellers, traders, and investors with real-time pricing data and market intelligence.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p
                className="text-xs font-bold tracking-widest uppercase mb-3 font-montserrat"
                style={{ color: '#E30613' }}
              >
                Our Story
              </p>
              <h2 className="text-3xl font-black mb-5 text-gray-900 font-montserrat">
                Empowering the Precious Metals Industry
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4 font-opensans">
                Founded by Murali Krishna, Larg Gold was born out of a vision to bring clarity and
                accuracy to India's precious metals market. We understand the challenges faced by
                jewellers and traders who depend on live rates every single day.
              </p>
              <p className="text-gray-600 leading-relaxed font-opensans">
                Our platform delivers live gold, silver, and other metal rates along with costing tools
                that help businesses make informed decisions quickly and confidently.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img
                src="https://images.pexels.com/photos/3944405/pexels-photo-3944405.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Gold bars"
                className="w-full h-72 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3 font-montserrat"
              style={{ color: '#E30613' }}
            >
              What Drives Us
            </p>
            <h2 className="text-3xl font-black text-gray-900 font-montserrat">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-5"
                  style={{ backgroundColor: '#fef9e7' }}
                >
                  <Icon size={22} style={{ color: '#fcc201' }} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 font-montserrat">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed font-opensans">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: '#fcc201' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-3 font-montserrat">
            Trusted Across India
          </h2>
          <p className="text-gray-800 font-opensans">
            Jewellers, traders, and investors rely on Larg Gold every day for accurate, timely market data.
          </p>
        </div>
      </section>
    </main>
  );
}
