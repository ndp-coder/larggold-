export default function PrivacyPolicy() {
  return (
    <div className="flex-1 py-16 px-4">
      <div className="max-w-3xl mx-auto" style={{ background: 'rgba(0,0,0,0.72)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="px-8 py-10">
          <h1 className="font-black text-3xl mb-2 font-montserrat" style={{ color: '#fcc201' }}>
            Privacy Policy
          </h1>
          <p className="text-sm mb-10 font-opensans" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Last updated: April 16, 2026
          </p>

          <Section title="1. Introduction">
            Welcome to Larg Gold. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and mobile application (collectively, the "Service").
          </Section>

          <Section title="2. Information We Collect">
            We may collect the following types of information:
            <ul className="mt-3 space-y-2 list-disc list-inside" style={{ color: 'rgba(255,255,255,0.75)' }}>
              <li><strong style={{ color: '#fcc201' }}>Account Information:</strong> Name, email address, and password when you register for an account.</li>
              <li><strong style={{ color: '#fcc201' }}>Contact Information:</strong> Information you provide when contacting us through our contact form, including name, email, phone number, and message content.</li>
              <li><strong style={{ color: '#fcc201' }}>Usage Data:</strong> Information about how you interact with our Service, including pages visited, time spent, and features used.</li>
              <li><strong style={{ color: '#fcc201' }}>Device Information:</strong> Browser type, operating system, IP address, and device identifiers.</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            We use the information we collect to:
            <ul className="mt-3 space-y-2 list-disc list-inside" style={{ color: 'rgba(255,255,255,0.75)' }}>
              <li>Provide, operate, and maintain our Service.</li>
              <li>Respond to your inquiries and support requests.</li>
              <li>Send you important notices, updates, and promotional communications (with your consent).</li>
              <li>Analyze usage patterns to improve our Service.</li>
              <li>Detect and prevent fraudulent activity and ensure the security of our platform.</li>
              <li>Comply with applicable legal obligations.</li>
            </ul>
          </Section>

          <Section title="4. Sharing of Information">
            We do not sell, trade, or rent your personal information to third parties. We may share your information in the following limited circumstances:
            <ul className="mt-3 space-y-2 list-disc list-inside" style={{ color: 'rgba(255,255,255,0.75)' }}>
              <li><strong style={{ color: '#fcc201' }}>Service Providers:</strong> Trusted third-party vendors who assist us in operating our Service (e.g., cloud hosting, analytics), subject to confidentiality agreements.</li>
              <li><strong style={{ color: '#fcc201' }}>Legal Requirements:</strong> When required by law or in response to valid legal process.</li>
              <li><strong style={{ color: '#fcc201' }}>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, your information may be transferred as a business asset.</li>
            </ul>
          </Section>

          <Section title="5. Data Security">
            We implement industry-standard security measures — including encryption, secure servers, and access controls — to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </Section>

          <Section title="6. Data Retention">
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this Policy, unless a longer retention period is required or permitted by law. Account data is retained for as long as your account remains active. Contact form submissions are retained for up to 2 years.
          </Section>

          <Section title="7. Your Rights">
            Depending on your location, you may have the following rights regarding your personal data:
            <ul className="mt-3 space-y-2 list-disc list-inside" style={{ color: 'rgba(255,255,255,0.75)' }}>
              <li>Right to access and receive a copy of your personal data.</li>
              <li>Right to correct inaccurate or incomplete data.</li>
              <li>Right to request deletion of your data.</li>
              <li>Right to withdraw consent at any time (where processing is based on consent).</li>
              <li>Right to object to or restrict processing of your data.</li>
            </ul>
            <p className="mt-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
              To exercise any of these rights, please contact us at <span style={{ color: '#fcc201' }}>larggold@gmail.com</span>.
            </p>
          </Section>

          <Section title="8. Cookies">
            We may use cookies and similar tracking technologies to enhance your experience. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, some features of our Service may not function properly without cookies.
          </Section>

          <Section title="9. Third-Party Links">
            Our Service may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies.
          </Section>

          <Section title="10. Children's Privacy">
            Our Service is not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will promptly delete it.
          </Section>

          <Section title="11. Changes to This Policy">
            We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page with an updated date. We encourage you to review this Policy periodically.
          </Section>

          <Section title="12. Contact Us" isLast>
            If you have any questions or concerns about this Privacy Policy, please contact us:
            <div className="mt-4 space-y-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
              <p><strong style={{ color: '#fcc201' }}>Email:</strong> larggold@gmail.com</p>
              <p><strong style={{ color: '#fcc201' }}>Phone:</strong> +91 9581366889</p>
              <p><strong style={{ color: '#fcc201' }}>Address:</strong> Vijayawada, India</p>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  isLast?: boolean;
}

function Section({ title, children, isLast }: SectionProps) {
  return (
    <div className={isLast ? 'mb-0' : 'mb-8'}>
      <h2 className="font-bold text-lg mb-3 font-montserrat" style={{ color: '#fcc201' }}>
        {title}
      </h2>
      <div className="text-sm leading-relaxed font-opensans" style={{ color: 'rgba(255,255,255,0.75)' }}>
        {children}
      </div>
      {!isLast && <div className="mt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />}
    </div>
  );
}
