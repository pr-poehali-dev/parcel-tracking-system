import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Index() {
  const [trackingCode, setTrackingCode] = useState('');
  const navigate = useNavigate();

  const handleTrack = () => {
    if (trackingCode.trim()) {
      navigate(`/track/${trackingCode.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1729]">
      {/* Header */}
      <header className="border-b border-[#1e2a47] py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <Icon name="Package" size={32} className="text-[#3b82f6]" />
            <div>
              <h1 className="text-xl font-bold text-white">Aboba Express</h1>
              <p className="text-xs text-gray-400">Global Shipping Service</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white">Track Your Package</h2>
            <p className="text-gray-400">Enter your tracking code to get real-time delivery updates</p>
          </div>

          {/* Search Box */}
          <div className="bg-[#1a2332] border border-[#1e2a47] rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2 text-left">
              <Icon name="Search" size={20} className="text-[#3b82f6]" />
              <div>
                <h3 className="text-white font-semibold">Search by Tracking Code</h3>
                <p className="text-xs text-gray-500">Format: AB2024XXXXXX</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Input
                placeholder="Enter tracking code"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                className="flex-1 bg-[#0f1729] border-[#1e2a47] text-white placeholder:text-gray-600"
              />
              <Button 
                onClick={handleTrack}
                className="bg-[#3b82f6] hover:bg-[#2563eb] text-white gap-2"
              >
                <Icon name="Search" size={16} />
                Track
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4 pt-8">
            <div className="bg-[#1a2332] border border-[#1e2a47] rounded-lg p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#3b82f6]/10 flex items-center justify-center">
                <Icon name="Zap" size={24} className="text-[#3b82f6]" />
              </div>
              <h3 className="text-white font-semibold">Fast Delivery</h3>
              <p className="text-sm text-gray-400">Express shipping to over 200 countries worldwide</p>
            </div>

            <div className="bg-[#1a2332] border border-[#1e2a47] rounded-lg p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#3b82f6]/10 flex items-center justify-center">
                <Icon name="Shield" size={24} className="text-[#3b82f6]" />
              </div>
              <h3 className="text-white font-semibold">Secure Shipping</h3>
              <p className="text-sm text-gray-400">Full insurance coverage for all packages</p>
            </div>

            <div className="bg-[#1a2332] border border-[#1e2a47] rounded-lg p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#3b82f6]/10 flex items-center justify-center">
                <Icon name="MapPin" size={24} className="text-[#3b82f6]" />
              </div>
              <h3 className="text-white font-semibold">Real-time Tracking</h3>
              <p className="text-sm text-gray-400">Track your package at every step of the journey</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e2a47] mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Icon name="Package" size={28} className="text-[#3b82f6]" />
                <div>
                  <h3 className="text-lg font-bold text-white">Aboba Express</h3>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Global shipping service with real-time tracking. Fast, secure, and reliable delivery to over 200 countries worldwide.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Headquarters: Guangzhou, China</p>
                <p>Email: support@abobaexpress.com</p>
                <p>Phone: +8618724278303</p>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <div className="space-y-2">
                <a href="/privacy-policy" className="block text-sm text-gray-400 hover:text-[#3b82f6]">
                  Privacy Policy
                </a>
                <a href="/terms-of-service" className="block text-sm text-gray-400 hover:text-[#3b82f6]">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}