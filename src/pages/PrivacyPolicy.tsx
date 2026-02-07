import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f1729]">
      <header className="border-b border-[#1e2a47] py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Package" size={32} className="text-[#3b82f6]" />
              <div>
                <h1 className="text-xl font-bold text-white">Aboba Express</h1>
                <p className="text-xs text-gray-400">Global Shipping Service</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/')} className="border-[#1e2a47] text-white">
              <Icon name="Home" size={18} className="mr-2" />
              Home
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-300">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">Information We Collect</h2>
            <p>
              We collect information necessary to process and deliver your shipments, including sender and recipient
              names, addresses, contact information, and package details.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">How We Use Your Information</h2>
            <p>
              Your information is used solely for shipping purposes, tracking, customer service, and improving our
              delivery services. We do not sell or share your personal information with third parties for marketing purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information from unauthorized
              access, disclosure, or misuse.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">Contact Us</h2>
            <p>
              If you have questions about our privacy policy, please contact us at support@abobaexpress.com
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
