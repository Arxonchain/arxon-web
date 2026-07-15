import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "1. Information We Collect",
      content: (
        <>
          <p className="mb-3">We may collect the following types of information:</p>
          <ul className="list-disc list-inside space-y-2 text-white/60">
            <li><span className="text-white font-medium">Account Information:</span> Email address, username, and other details you provide when signing up or logging in.</li>
            <li><span className="text-foreground font-medium">Usage Data:</span> Information about how you interact with the App, such as battles you participate in, points earned, and staking activity.</li>
            <li><span className="text-foreground font-medium">Device Information:</span> Device type, operating system version, and unique device identifiers (for push notifications and analytics).</li>
            <li><span className="text-foreground font-medium">Wallet/Blockchain Data:</span> Public wallet addresses and transaction-related data on the Arxon blockchain (note: blockchain data is public by design).</li>
          </ul>
          <p className="mt-3 text-white/60">We do not collect sensitive personal information such as your full name, address, phone number, or payment card details unless you voluntarily provide them.</p>
        </>
      ),
    },
    {
      title: "2. How We Use Your Information",
      content: (
        <>
          <p className="mb-3">We use the collected information to:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Provide and improve the Arxon Mining App</li>
            <li>Enable mining, staking on battles, and point tracking</li>
            <li>Send important notifications (e.g., battle updates, new rewards)</li>
            <li>Maintain the security and integrity of the App</li>
            <li>Comply with legal obligations</li>
          </ul>
        </>
      ),
    },
    {
      title: "3. Data Sharing",
      content: (
        <>
          <p className="mb-3">We may share your information with:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Service providers (e.g., authentication and database services, push notification services)</li>
            <li>Legal authorities, if required by law</li>
          </ul>
          <p className="mt-3 text-muted-foreground">We do not sell your personal data to third parties.</p>
          <p className="mt-2 text-muted-foreground">Blockchain transactions are public by nature and visible on the Arxon network.</p>
        </>
      ),
    },
    {
      title: "4. Data Security",
      content: (
        <p className="text-muted-foreground">
          We take reasonable measures to protect your information. However, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
        </p>
      ),
    },
    {
      title: "5. Your Rights",
      content: (
        <>
          <p className="mb-3">You may:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Request access to or deletion of your personal data (where technically feasible)</li>
            <li>Opt out of marketing communications</li>
            <li>Withdraw consent for certain data processing</li>
          </ul>
          <p className="mt-3 text-muted-foreground">To exercise these rights, contact us at the email below.</p>
        </>
      ),
    },
    {
      title: "6. Children's Privacy",
      content: (
        <p className="text-muted-foreground">
          Our App is not directed to children under the age of 13. We do not knowingly collect data from children under 13.
        </p>
      ),
    },
    {
      title: "7. Changes to This Privacy Policy",
      content: (
        <p className="text-muted-foreground">
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy in the App and on our website.
        </p>
      ),
    },
    {
      title: "8. Contact Us",
      content: (
        <>
          <p className="text-muted-foreground mb-2">If you have any questions about this Privacy Policy, please contact us at:</p>
          <ul className="space-y-1 text-muted-foreground">
            <li><span className="text-foreground font-medium">Email:</span>{" "}
              <a href="mailto:arxonchain@yahoo.com" className="text-[#7c93c3] hover:underline">arxonchain@yahoo.com</a>
            </li>
            <li><span className="text-foreground font-medium">Website:</span>{" "}
              <a href="https://arxon.io" target="_blank" rel="noopener noreferrer" className="text-[#7c93c3] hover:underline">https://arxon.io</a>
            </li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.018]" style={{backgroundImage:"linear-gradient(rgba(124,147,195,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(124,147,195,0.5) 1px,transparent 1px)",backgroundSize:"64px 64px"}} />
      <PageMeta title="Privacy Policy | ARXON" description="How Arxon collects, uses, and protects your information." />
      <Navbar />
      <main className="relative z-10 max-w-3xl mx-auto px-6 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-white/55 text-sm mb-10">Last updated: March 31, 2026</p>

          <p className="text-white/60 mb-8">
            Arxon ("we", "our", or "us") operates the Arxon Mining App (the "App"). This Privacy Policy explains how we collect, use, and protect your information when you use our mobile application.
          </p>

          <div className="space-y-8">
            {sections.map((section, i) => (
              <motion.section
                key={section.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6"
              >
                <h2 className="text-lg font-semibold mb-3">{section.title}</h2>
                {section.content}
              </motion.section>
            ))}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
