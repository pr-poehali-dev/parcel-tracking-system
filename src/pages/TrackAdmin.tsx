import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TrackingHistoryManager } from '@/components/TrackingHistoryManager';

const PACKAGES_API = 'https://functions.poehali.dev/YOUR_URL_HERE';
const TRACKING_API = 'https://functions.poehali.dev/YOUR_URL_HERE';

interface Package {
  id: number;
  tracking_code: string;
  sender_name: string;
  sender_address: string;
  sender_country: string;
  recipient_name: string;
  recipient_address: string;
  recipient_country: string;
  status: string;
  shipped_date: string;
  delivery_date: string;
}

interface TrackingEvent {
  id: number;
  location: string;
  status: string;
  description: string;
  event_date: string;
}

const getCountryFlag = (countryName: string) => {
  const flags: Record<string, string> = {
    'United States': '🇺🇸',
    'China': '🇨🇳',
    'Russia': '🇷🇺',
    'United Kingdom': '🇬🇧',
    'Germany': '🇩🇪',
    'France': '🇫🇷',
    'Japan': '🇯🇵',
    'South Korea': '🇰🇷',
    'Canada': '🇨🇦',
    'Australia': '🇦🇺',
    'Brazil': '🇧🇷',
    'India': '🇮🇳',
    'Mexico': '🇲🇽',
    'Spain': '🇪🇸',
    'Italy': '🇮🇹',
  };
  return flags[countryName] || '🌍';
};

export default function TrackAdmin() {
  const { trackingCode } = useParams<{ trackingCode: string }>();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [history, setHistory] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showHistoryManager, setShowHistoryManager] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth !== 'true') {
      navigate('/admin');
      return;
    }
    if (trackingCode) {
      loadPackageData();
    }
  }, [trackingCode]);

  const loadPackageData = async () => {
    try {
      setLoading(true);
      setError('');

      const pkgResponse = await fetch(`${PACKAGES_API}?tracking_code=${trackingCode}`);
      const pkgData = await pkgResponse.json();

      if (!pkgData.success) {
        setError('Package not found');
        setLoading(false);
        return;
      }

      setPackageData(pkgData.package);

      const historyResponse = await fetch(`${TRACKING_API}?package_id=${pkgData.package.id}`);
      const historyData = await historyResponse.json();

      if (historyData.success) {
        setHistory(historyData.history || []);
      }

      setLoading(false);
    } catch (err) {
      setError('Failed to load package data');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1729]">
      {/* Header */}
      <header className="border-b border-[#1e2a47] py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Package" size={32} className="text-[#3b82f6]" />
              <div>
                <h1 className="text-xl font-bold text-white">Aboba Express</h1>
                <p className="text-xs text-gray-400">Admin Panel - Tracking</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/admin')} className="border-[#1e2a47] text-white">
              <Icon name="ArrowLeft" size={18} className="mr-2" />
              Back to Admin
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <Icon name="Loader2" size={48} className="mx-auto text-[#3b82f6] animate-spin mb-4" />
            <p className="text-gray-400">Loading package information...</p>
          </div>
        ) : error ? (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-[#1a2332] border-[#1e2a47] p-12 text-center">
              <Icon name="AlertCircle" size={64} className="mx-auto text-red-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Package Not Found</h2>
              <p className="text-gray-400 mb-6">
                We couldn't find a package with tracking code: <span className="text-[#3b82f6]">{trackingCode}</span>
              </p>
              <Button onClick={() => navigate('/admin')} className="bg-[#3b82f6] hover:bg-[#2563eb]">
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Back to Admin
              </Button>
            </Card>
          </div>
        ) : packageData ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Admin Actions */}
            <div className="flex gap-3 justify-end">
              <Button 
                onClick={() => setShowHistoryManager(true)}
                className="bg-[#3b82f6] hover:bg-[#2563eb]"
              >
                <Icon name="Edit" size={16} className="mr-2" />
                Manage Tracking History
              </Button>
            </div>

            {/* Package Info Card */}
            <Card className="bg-[#1a2332] border-[#1e2a47] p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Tracking Number</h2>
                  <p className="text-[#3b82f6] text-3xl font-bold">{packageData.tracking_code}</p>
                </div>
                <div className="px-4 py-2 rounded-lg bg-[#3b82f6]/20 border border-[#3b82f6]">
                  <span className="text-[#3b82f6] font-semibold text-lg capitalize">
                    {packageData.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Sender */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Icon name="Send" size={18} />
                    <span className="font-semibold">Sender</span>
                  </div>
                  <div className="pl-6 space-y-1">
                    <p className="text-white font-semibold">{packageData.sender_name}</p>
                    <p className="text-gray-400 text-sm">{packageData.sender_address}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-2xl">{getCountryFlag(packageData.sender_country)}</span>
                      <span className="text-gray-400">{packageData.sender_country}</span>
                    </div>
                  </div>
                </div>

                {/* Recipient */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Icon name="MapPin" size={18} />
                    <span className="font-semibold">Recipient</span>
                  </div>
                  <div className="pl-6 space-y-1">
                    <p className="text-white font-semibold">{packageData.recipient_name}</p>
                    <p className="text-gray-400 text-sm">{packageData.recipient_address}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-2xl">{getCountryFlag(packageData.recipient_country)}</span>
                      <span className="text-gray-400">{packageData.recipient_country}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-[#1e2a47]">
                {packageData.shipped_date && (
                  <div className="flex items-center gap-3">
                    <Icon name="Calendar" size={18} className="text-[#3b82f6]" />
                    <div>
                      <p className="text-gray-400 text-sm">Shipped Date</p>
                      <p className="text-white">{new Date(packageData.shipped_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
                {packageData.delivery_date && (
                  <div className="flex items-center gap-3">
                    <Icon name="Clock" size={18} className="text-[#3b82f6]" />
                    <div>
                      <p className="text-gray-400 text-sm">Estimated Delivery</p>
                      <p className="text-white">{new Date(packageData.delivery_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Tracking History */}
            <Card className="bg-[#1a2332] border-[#1e2a47] p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Icon name="Clock" size={24} className="text-[#3b82f6]" />
                Tracking History
              </h3>

              {history.length === 0 ? (
                <div className="text-center py-8">
                  <Icon name="Package" size={48} className="mx-auto text-gray-600 mb-3" />
                  <p className="text-gray-400">No tracking events yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      {/* Timeline */}
                      <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full ${index === 0 ? 'bg-[#3b82f6]' : 'bg-[#1e2a47]'}`} />
                        {index !== history.length - 1 && (
                          <div className="w-0.5 h-full bg-[#1e2a47] mt-2" />
                        )}
                      </div>

                      {/* Event Details */}
                      <div className="flex-1 pb-6">
                        <div className="bg-[#0f1729] border border-[#1e2a47] rounded-lg p-4 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-white font-semibold">{event.location}</p>
                              <p className="text-[#3b82f6] text-sm">{event.status}</p>
                            </div>
                            <span className="text-gray-500 text-sm">
                              {new Date(event.event_date).toLocaleString()}
                            </span>
                          </div>
                          {event.description && (
                            <p className="text-gray-400 text-sm">{event.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        ) : null}
      </main>

      {packageData && (
        <TrackingHistoryManager
          open={showHistoryManager}
          onClose={() => setShowHistoryManager(false)}
          packageId={packageData.id}
          trackingCode={packageData.tracking_code}
          apiUrl={TRACKING_API}
        />
      )}
    </div>
  );
}
