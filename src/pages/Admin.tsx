import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Package } from '@/types/package';
import { PackageManagement } from '@/components/PackageManagement';
import { PackageDialog } from '@/components/PackageDialog';
import { AdminLogin } from '@/components/AdminLogin';

const API_URL = 'https://functions.poehali.dev/377be8f8-6ae5-4538-9bd0-310ecc0aeec8';

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'success' | 'destructive' }> = {
  pending: { label: 'Pending', variant: 'secondary' },
  in_transit: { label: 'In Transit', variant: 'default' },
  delivered: { label: 'Delivered', variant: 'success' },
  returned: { label: 'Returned', variant: 'destructive' },
};

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const authStatus = localStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadPackages();
    }
  }, []);

  const generateTrackingCode = () => {
    const prefix = 'AB';
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 900000) + 100000;
    return `${prefix}${year}${random}`;
  };

  const loadPackages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (data.success) {
        setPackages(data.packages || []);
      }
    } catch (error) {
      toast({ title: 'Failed to load packages', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePackage = async (formData: Partial<Package>) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({ title: 'Package created successfully' });
        setIsDialogOpen(false);
        loadPackages();
      }
    } catch (error) {
      toast({ title: 'Failed to create package', variant: 'destructive' });
    }
  };

  const handleUpdatePackage = async (formData: Package) => {
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({ title: 'Package updated successfully' });
        setIsDialogOpen(false);
        setEditingPackage(null);
        loadPackages();
      }
    } catch (error) {
      toast({ title: 'Failed to update package', variant: 'destructive' });
    }
  };

  const handleDeletePackage = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({ title: 'Package deleted successfully' });
        loadPackages();
      }
    } catch (error) {
      toast({ title: 'Failed to delete package', variant: 'destructive' });
    }
  };

  const handleDialogSubmit = (formData: any) => {
    if (editingPackage) {
      handleUpdatePackage(formData);
    } else {
      handleCreatePackage(formData);
    }
  };

  const handleCreateNew = () => {
    setEditingPackage(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setIsDialogOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b backdrop-blur-sm sticky top-0 z-50 bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Package" size={32} className="text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Aboba Express</h1>
                <p className="text-sm text-muted-foreground">Admin Panel</p>
              </div>
            </div>
            {isAuthenticated && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate('/')}>
                  <Icon name="Home" size={18} className="mr-2" />
                  Home
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <Icon name="LogOut" size={18} className="mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {isAuthenticated ? (
          <PackageManagement
            packages={packages}
            isLoading={isLoading}
            onCreateNew={handleCreateNew}
            onEdit={handleEdit}
            onDelete={handleDeletePackage}
            statusMap={statusMap}
          />
        ) : (
          <AdminLogin onLoginSuccess={() => {
            setIsAuthenticated(true);
            loadPackages();
          }} />
        )}
      </main>

      <PackageDialog
        key={editingPackage?.id || 'new'}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingPackage(null);
        }}
        onSubmit={handleDialogSubmit}
        editingPackage={editingPackage}
        generateTrackingCode={generateTrackingCode}
      />
    </div>
  );
}
