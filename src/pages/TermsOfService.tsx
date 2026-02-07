import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

export default function TermsOfService() {
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
        <h1 className="text-3xl font-bold text-white mb-8">Terms of Service</h1>
        
        <div className="space-y-6 text-gray-300">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">Service Agreement</h2>
            <p>
              By using Aboba Express shipping services, you agree to these terms and conditions. We provide
              international shipping services to over 200 countries worldwide.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">Shipping Responsibilities</h2>
            <p>
              Customers are responsible for accurate package information, proper packaging, and compliance with
              customs regulations. Aboba Express is not liable for delays caused by customs or force majeure events.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">Insurance and Claims</h2>
            <p>
              All shipments include basic insurance coverage. Additional insurance can be purchased for high-value
              items. Claims must be filed within 30 days of delivery or expected delivery date.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">Prohibited Items</h2>
            <p>
              Hazardous materials, illegal substances, weapons, and perishable goods are strictly prohibited.
              Violation may result in service termination and legal action.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">Contact Information</h2>
            <p>
              For questions or concerns, contact us at support@abobaexpress.com or call +8618724278303
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
