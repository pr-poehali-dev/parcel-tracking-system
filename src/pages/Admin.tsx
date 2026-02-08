import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { PackageForm } from '@/components/PackageForm';
import { TrackingHistoryManager } from '@/components/TrackingHistoryManager';

const PACKAGES_API = 'https://functions.poehali.dev/1c205e38-f202-4c5a-a3b1-07344e13268f';
const TRACKING_API = 'https://functions.poehali.dev/407d591f-86ae-4560-9454-4accddae7ff4';

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

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [packages, setPackages] = useState<Package[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [showTrackingHistory, setShowTrackingHistory] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadPackages();
    }
  }, []);

  const handleLogin = () => {
    if (password === 'admin') {
      localStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
      loadPackages();
      toast({ title: 'Logged in successfully' });
    } else {
      toast({ title: 'Invalid password', variant: 'destructive' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    navigate('/');
  };

  const loadPackages = async () => {
    try {
      const response = await fetch(PACKAGES_API);
      const data = await response.json();
      if (data.success) {
        setPackages(data.packages || []);
      }
    } catch (error) {
      console.error('Error loading packages:', error);
    }
  };

  const handleCreatePackage = async (formData: Partial<Package>) => {
    try {
      const response = await fetch(PACKAGES_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: 'Package created successfully' });
        setShowCreateForm(false);
        loadPackages();
      } else {
        toast({ title: 'Failed to create package', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Failed to create package', variant: 'destructive' });
    }
  };

  const handleUpdatePackage = async (formData: Partial<Package>) => {
    try {
      const response = await fetch(PACKAGES_API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: 'Package updated successfully' });
        setShowCreateForm(false);
        setEditingPackage(null);
        loadPackages();
      } else {
        toast({ title: 'Failed to update package', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Failed to update package', variant: 'destructive' });
    }
  };

  const handleDeletePackage = async (id: number) => {
    if (!confirm('Delete this package?')) return;

    try {
      const response = await fetch(`${PACKAGES_API}?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: 'Package deleted successfully' });
        loadPackages();
      }
    } catch (error) {
      toast({ title: 'Failed to delete package', variant: 'destructive' });
    }
  };

  const openTrackingHistory = (pkg: Package) => {
    setSelectedPackage(pkg);
    setShowTrackingHistory(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f1729] flex items-center justify-center">
        <Card className="w-full max-w-md p-8 bg-[#1a2332] border-[#1e2a47]">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Icon name="Lock" size={48} className="mx-auto text-[#3b82f6]" />
              <h1 className="text-2xl font-bold text-white">Admin Login</h1>
              <p className="text-gray-400 text-sm">Enter password to access admin panel</p>
            </div>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="bg-[#0f1729] border-[#1e2a47] text-white"
              />
              <Button onClick={handleLogin} className="w-full bg-[#3b82f6] hover:bg-[#2563eb]">
                Login
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1729]">
      <header className="border-b border-[#1e2a47] py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Package" size={32} className="text-[#3b82f6]" />
              <div>
                <h1 className="text-xl font-bold text-white">Aboba Express</h1>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/')} className="border-[#1e2a47] text-white">
                <Icon name="Home" size={18} className="mr-2" />
                Home
              </Button>
              <Button variant="outline" onClick={handleLogout} className="border-[#1e2a47] text-white">
                <Icon name="LogOut" size={18} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Package Management</h2>
          <Button 
            onClick={() => {
              setEditingPackage(null);
              setShowCreateForm(true);
            }} 
            className="bg-[#3b82f6] hover:bg-[#2563eb]"
          >
            <Icon name="Plus" size={18} className="mr-2" />
            Create Package
          </Button>
        </div>

        <div className="grid gap-4">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="bg-[#1a2332] border-[#1e2a47] p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-[#3b82f6]">{pkg.tracking_code}</span>
                    <span className="px-2 py-1 rounded text-xs bg-[#3b82f6]/20 text-[#3b82f6]">
                      {pkg.status}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Sender</p>
                      <p className="text-white">{pkg.sender_name}</p>
                      <p className="text-gray-500">{pkg.sender_address}</p>
                      <p className="text-gray-500">{pkg.sender_country}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Recipient</p>
                      <p className="text-white">{pkg.recipient_name}</p>
                      <p className="text-gray-500">{pkg.recipient_address}</p>
                      <p className="text-gray-500">{pkg.recipient_country}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setEditingPackage(pkg);
                      setShowCreateForm(true);
                    }}
                    className="border-[#1e2a47] text-white hover:bg-[#1e2a47]"
                  >
                    <Icon name="Edit" size={16} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => openTrackingHistory(pkg)}
                    className="border-[#1e2a47] text-white hover:bg-[#1e2a47]"
                  >
                    <Icon name="Clock" size={16} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDeletePackage(pkg.id)}
                    className="border-red-500 text-red-400 hover:bg-red-500/10"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {packages.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Package" size={64} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">No packages yet. Create your first package!</p>
          </div>
        )}
      </main>

      <PackageForm
        open={showCreateForm}
        onClose={() => {
          setShowCreateForm(false);
          setEditingPackage(null);
        }}
        onSubmit={editingPackage ? handleUpdatePackage : handleCreatePackage}
        editingPackage={editingPackage}
      />

      {selectedPackage && (
        <TrackingHistoryManager
          open={showTrackingHistory}
          onClose={() => {
            setShowTrackingHistory(false);
            setSelectedPackage(null);
          }}
          packageId={selectedPackage.id}
          trackingCode={selectedPackage.tracking_code}
          apiUrl={TRACKING_API}
        />
      )}
    </div>
  );
}