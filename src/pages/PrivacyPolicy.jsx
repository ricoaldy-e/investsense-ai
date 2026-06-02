import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] },
});

const clauses = [
  {
    title: '1. Overview',
    body: 'InvestSense AI ("we", "our", or "the Platform") is committed to protecting your privacy. This Privacy Policy explains what information we collect, how we use it, and the choices you have. By using the Platform, you consent to the data practices described in this policy.',
  },
  {
    title: '2. Information We Collect',
    body: 'We collect information you provide directly when creating an account, including your email address, username, and password (stored as a bcrypt hash — your plaintext password is never retained). We do not collect financial data, payment information, or government identification. Usage data such as page interactions and session timestamps may be captured for system stability purposes.',
  },
  {
    title: '3. Authentication Tokens',
    body: 'When you log in, the Platform issues two types of tokens: a short-lived Access Token stored in your browser\'s local storage, and a long-lived Refresh Token stored in an HTTP-Only cookie. The HTTP-Only cookie is inaccessible to JavaScript, protecting it from Cross-Site Scripting (XSS) attacks. This is an industry-standard security architecture.',
  },
  {
    title: '4. How We Use Your Information',
    body: 'Your email and username are used solely to authenticate you, personalise your experience (e.g., displaying your name in the dashboard), and — if technically implemented — to send critical account notifications. We do not use your personal data to build advertising profiles, sell to third parties, or conduct behavioural tracking.',
  },
  {
    title: '5. Third-Party Services',
    body: 'The Platform integrates with third-party services to deliver market data, news, and AI capabilities. These include financial data APIs and large-language model providers. These third parties operate under their own privacy policies and are contractually required to handle your data responsibly. We do not transmit personally identifiable information (PII) to these services.',
  },
  {
    title: '6. Data Storage & Security',
    body: 'User account data is stored in a managed database hosted by a reputable cloud provider. We implement industry-standard security measures including password hashing (bcrypt), token-based authentication, HTTPS enforcement, and CORS restrictions. While we take these precautions seriously, no system is entirely immune to breach, and we cannot guarantee absolute security.',
  },
  {
    title: '7. Cookies',
    body: 'The Platform uses one functional cookie: the Refresh Token cookie required for session continuity. This cookie is classified as strictly necessary and is not used for tracking or advertising. It is automatically deleted when you log out or when it reaches its expiry period (up to 7 days).',
  },
  {
    title: '8. Data Retention',
    body: 'Your account data is retained for as long as your account remains active. If you request account deletion, your personal data (email, username, and token records) will be purged from our database within a reasonable timeframe. Aggregate and anonymised analytics data may be retained indefinitely.',
  },
  {
    title: '9. Your Rights',
    body: 'You have the right to access the personal data we hold about you, request correction of inaccurate data, and request deletion of your account and associated data. To exercise these rights, please contact the development team through official project channels. We will respond to verified requests within 30 calendar days.',
  },
  {
    title: '10. Children\'s Privacy',
    body: 'InvestSense AI is not directed at children under the age of 17. We do not knowingly collect personal information from individuals under this age. If we become aware that a minor has created an account, we will delete the account and associated data promptly.',
  },
  {
    title: '11. Changes to This Policy',
    body: 'We may update this Privacy Policy periodically to reflect changes in our practices or applicable law. The revised policy will be posted on this page with an updated date. We encourage you to review this page regularly. Continued use of the Platform following any update constitutes acceptance of the revised policy.',
  },
  {
    title: '12. Contact',
    body: 'If you have any questions, concerns, or requests regarding this Privacy Policy or the handling of your personal data, please reach out through the official InvestSense AI project channels listed in the About section of the Platform.',
  },
];

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-bg-dark text-text-main">
      <div className="fixed top-0 left-0 right-0 h-[1px] bg-card-border z-10" />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16 pt-20">
        <motion.div {...fadeUp(0)} className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[2px] uppercase text-text-muted hover:text-accent transition-colors duration-300"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Home
          </Link>
        </motion.div>

        <motion.div {...fadeUp(0.1)} className="mb-12 pt-4">
          <p className="font-mono text-[10px] tracking-[3px] uppercase text-accent mb-4">Legal</p>
          <h1 className="font-display text-[32px] md:text-[44px] font-light text-text-main leading-tight tracking-[1px] mb-5">
            Privacy Policy
          </h1>
          <div className="w-12 h-[1px] bg-accent mb-6" />
          <p className="font-body text-[14px] text-text-secondary leading-relaxed max-w-2xl">
            Your privacy matters to us. This policy describes how InvestSense AI collects, uses, and protects the personal information you provide when using the Platform.
          </p>
          <p className="font-mono text-[10px] tracking-[1.5px] uppercase text-text-muted mt-4">
            Last updated: June 2026
          </p>
        </motion.div>

        <div className="space-y-6">
          {clauses.map((clause, idx) => (
            <motion.div
              key={clause.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + idx * 0.04, ease: [0.25, 0.1, 0.25, 1] }}
              className="border-l-2 border-card-border pl-6 py-1 hover:border-accent/50 transition-colors duration-300"
            >
              <h2 className="font-mono text-[11px] tracking-[2px] uppercase text-text-main mb-3">
                {clause.title}
              </h2>
              <p className="font-body text-[14px] text-text-secondary leading-relaxed">
                {clause.body}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp(0.5)} className="mt-16 pt-8 border-t border-card-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="font-mono text-[10px] tracking-[1.5px] text-text-muted uppercase">
            © {new Date().getFullYear()} InvestSense AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/guide" className="font-mono text-[10px] tracking-[1.5px] uppercase text-text-muted hover:text-accent transition-colors duration-300">Guide</Link>
            <span className="text-card-border">·</span>
            <Link to="/terms" className="font-mono text-[10px] tracking-[1.5px] uppercase text-text-muted hover:text-accent transition-colors duration-300">Terms</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
